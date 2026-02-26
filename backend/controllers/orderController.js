import asyncHandler from 'express-async-handler';
import Order from '../models/orderModel.js';
import Product from '../models/productModel.js';

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const addOrderItems = asyncHandler(async (req, res) => {
    const {
        orderItems,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        emiPlan
    } = req.body;

    if (orderItems && orderItems.length === 0) {
        res.status(400);
        throw new Error('No order items');
    } else {
        const order = new Order({
            orderItems: orderItems.map((x) => ({
                ...x,
                product: x._id,
                _id: undefined,
            })),
            user: req.user._id,
            shippingAddress,
            paymentMethod,
            itemsPrice,
            taxPrice,
            shippingPrice,
            totalPrice,
            emiPlan
        });

        // Reduce stock quantity after order placement
        for (const item of order.orderItems) {
            const product = await Product.findById(item.product);
            if (product) {
                product.countInStock -= item.qty;
                await product.save();
            }
        }

        const createdOrder = await order.save();
        res.status(201).json(createdOrder);
    }
});

// @desc    Get logged in user orders
// @route   GET /api/orders/mine
// @access  Private
const getMyOrders = asyncHandler(async (req, res) => {
    const orders = await Order.find({ user: req.user._id });
    res.status(200).json(orders);
});

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id).populate(
        'user',
        'name email'
    );

    if (order) {
        res.status(200).json(order);
    } else {
        res.status(404);
        throw new Error('Order not found');
    }
});

// @desc    Update order to paid (via Razorpay confirmation)
// @route   PUT /api/orders/:id/pay
// @access  Private
const updateOrderToPaid = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);

    if (order) {
        order.isPaid = true;
        order.paidAt = Date.now();
        order.status = 'Paid';
        order.paymentResult = {
            id: req.body.razorpay_payment_id,
            status: 'success',
            update_time: Date.now(),
            email_address: req.user.email,
        };

        const updatedOrder = await order.save();
        res.status(200).json(updatedOrder);
    } else {
        res.status(404);
        throw new Error('Order not found');
    }
});

import sendEmail from '../utils/sendEmail.js';

// @desc    Update order to delivered
// @route   PUT /api/orders/:id/deliver
// @access  Private/Admin
const updateOrderToDelivered = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id).populate('user', 'name email');

    if (order) {
        order.status = 'Delivered';
        order.deliveredAt = Date.now();

        const updatedOrder = await order.save();

        try {
            await sendEmail({
                email: order.user.email,
                subject: 'Your Certified Gadget has been Delivered! | RefurbNest',
                html: `<h3>Hey ${order.user.name},</h3>
                       <p>Great news! Your order <b>#${order._id}</b> has been successfully delivered.</p>
                       <p>Please check your items and feel free to reach out if you have any questions.</p>
                       <p>Enjoy your premium refurbished electronics!</p>`
            });
        } catch (err) {
            console.error("Mail error");
        }

        res.status(200).json(updatedOrder);
    } else {
        res.status(404);
        throw new Error('Order not found');
    }
});

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
const updateOrderStatus = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);

    if (order) {
        order.status = req.body.status || order.status;
        if (req.body.status === 'Shipped') order.shippedAt = Date.now();
        if (req.body.status === 'Delivered') order.deliveredAt = Date.now();

        const updatedOrder = await order.save();
        res.json(updatedOrder);
    } else {
        res.status(404);
        throw new Error('Order not found');
    }
});

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = asyncHandler(async (req, res) => {
    const orders = await Order.find({}).populate('user', 'id name');
    res.status(200).json(orders);
});

// @desc    Get order analytics
// @route   GET /api/orders/analytics
// @access  Private/Admin
const getAnalytics = asyncHandler(async (req, res) => {
    const orders = await Order.find({});

    // Revenue over time (Last 7 Days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const revenueData = [];
    for (let i = 0; i < 7; i++) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const dateStr = d.toISOString().split('T')[0];

        const dayRevenue = orders
            .filter(o => o.createdAt.toISOString().split('T')[0] === dateStr)
            .reduce((acc, o) => acc + o.totalPrice, 0);

        revenueData.unshift({ name: dateStr.slice(5), revenue: dayRevenue });
    }

    // Category Performance
    const categoryStats = {};
    orders.forEach(order => {
        order.orderItems.forEach(item => {
            const category = item.category || 'Other';
            categoryStats[category] = (categoryStats[category] || 0) + item.qty;
        });
    });

    const categoryData = Object.entries(categoryStats).map(([name, value]) => ({ name, value }));

    // Status Distribution
    const statusCounts = orders.reduce((acc, o) => {
        acc[o.status] = (acc[o.status] || 0) + 1;
        return acc;
    }, {});
    const statusData = Object.entries(statusCounts).map(([name, value]) => ({ name, value }));

    const totalRevenue = orders.reduce((acc, o) => acc + o.totalPrice, 0);
    const totalOrders = orders.length;

    res.json({
        revenueData,
        categoryData,
        statusData,
        totalRevenue,
        totalOrders,
        avgOrderValue: totalOrders > 0 ? (totalRevenue / totalOrders).toFixed(2) : 0
    });
});

export {
    addOrderItems,
    getMyOrders,
    getOrderById,
    updateOrderToPaid,
    updateOrderToDelivered,
    getOrders,
    getAnalytics,
    updateOrderStatus,
};
