import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import connectDB from './config/db.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

import userRoutes from './routes/userRoutes.js';
import productRoutes from './routes/productRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import sendEmail from './utils/sendEmail.js';

dotenv.config();
connectDB();

const app = express();

app.use(cors({
    origin: [
        'http://localhost:5173',
        'http://localhost:5174',
        'http://127.0.0.1:5173',
        'http://127.0.0.1:5174',
        process.env.FRONTEND_URL
    ].filter(Boolean),
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/upload', uploadRoutes);

import Order from './models/orderModel.js';
import Product from './models/productModel.js';
import { protect } from './middleware/authMiddleware.js';

// --- RAZORPAY PAYMENT ROUTES ---
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_placeholder',
    key_secret: process.env.RAZORPAY_KEY_SECRET || 'secret_placeholder'
});

app.post('/api/pay/order', protect, async (req, res) => {
    try {
        const options = {
            amount: req.body.amount * 100,
            currency: "INR",
            receipt: `receipt_order_${Math.floor(Math.random() * 1000)}`
        };
        const order = await razorpay.orders.create(options);
        res.json(order);
    } catch (error) {
        res.status(500).json({ message: 'Razorpay error', error });
    }
});

app.post('/api/pay/verify', protect, async (req, res) => {
    const {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        orderItems,
        shippingAddress,
        paymentMethod,
        totalPrice
    } = req.body;

    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || 'secret_placeholder')
        .update(sign.toString())
        .digest("hex");

    if (razorpay_signature === expectedSign) {
        try {
            const order = new Order({
                orderItems: orderItems.map(item => ({
                    name: item.name,
                    qty: item.qty || 1,
                    image: typeof item.image === 'string' ? item.image : (item.images && item.images[0] ? (typeof item.images[0] === 'string' ? item.images[0] : item.images[0].url) : ''),
                    price: item.price,
                    product: item._id
                })),
                user: req.user._id,
                shippingAddress: {
                    ...shippingAddress,
                    country: shippingAddress.country || 'India'
                },
                paymentMethod,
                itemsPrice: totalPrice,
                shippingPrice: 0,
                taxPrice: 0,
                totalPrice,
                isPaid: true,
                paidAt: Date.now(),
                status: 'Paid',
                paymentResult: {
                    id: razorpay_payment_id,
                    status: 'success',
                    update_time: Date.now().toString(),
                    email_address: req.user.email
                }
            });

            for (const item of orderItems) {
                const product = await Product.findById(item._id);
                if (product) {
                    product.countInStock -= (item.qty || 1);
                    await product.save();
                }
            }

            const createdOrder = await order.save();

            // Send Confirmation Email
            try {
                await sendEmail({
                    email: req.user.email,
                    subject: 'Purchase Confirmed | RefurbNest',
                    html: `<h1>Thank you for your order, ${req.user.name}!</h1>
                           <p>Your payment of ₹${totalPrice.toLocaleString()} was successful.</p>
                           <p>Order ID: <b>#${createdOrder._id}</b></p>
                           <p>We are preparing your certified gadget for shipment.</p>`
                });
            } catch (mailErr) {
                console.error("Mail failed");
            }

            return res.status(200).json({ message: "Payment verified & Order created", order: createdOrder });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Error creating order after payment" });
        }
    } else {
        return res.status(400).json({ message: "Invalid signature sent!" });
    }
});
// ------------------------------

app.get('/', (req, res) => {
    res.send('API is running...');
});

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Trigger restart
