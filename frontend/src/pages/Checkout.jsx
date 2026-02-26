import React, { useState } from 'react';
import useCartStore from '../store/useCartStore';
import useAuthStore from '../store/useAuthStore';
import { IndianRupee, MapPin, Phone, User, CreditCard, ArrowRight, ShieldCheck, Lock, Truck } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const Checkout = () => {
    const { cartItems, getTotalPrice, clearCart } = useCartStore();
    const cart = cartItems;
    const totalPrice = getTotalPrice();
    const { user } = useAuthStore();
    const navigate = useNavigate();
    const [isProcessing, setIsProcessing] = useState(false);

    const [shippingData, setShippingData] = useState({
        address: '',
        city: '',
        postalCode: '',
        phone: ''
    });

    const handleChange = (e) => {
        setShippingData({ ...shippingData, [e.target.name]: e.target.value });
    };

    const handlePayment = async () => {
        if (!shippingData.address || !shippingData.phone || !shippingData.city || !shippingData.postalCode) {
            return toast.error("Please fill all delivery details");
        }

        setIsProcessing(true);
        try {
            // 1. Create order on backend
            const { data: orderData } = await api.post('/pay/order', { amount: totalPrice });

            // 2. Configure Razorpay
            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY || 'rzp_test_placeholder',
                amount: orderData.amount,
                currency: "INR",
                name: "RefurbNest",
                description: "Purchase of Certified Electronics",
                order_id: orderData.id,
                handler: async (response) => {
                    try {
                        // 3. Verify Payment
                        const { data } = await api.post('/pay/verify', {
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                            orderItems: cart,
                            shippingAddress: shippingData,
                            paymentMethod: 'Razorpay',
                            totalPrice: totalPrice
                        });

                        toast.success("Payment Successful! Order Confirmed.");
                        clearCart();
                        navigate(`/order/${data.order?._id || data.orderId || ''}`);
                    } catch (err) {
                        toast.error("Signature verification failed!");
                        setIsProcessing(false);
                    }
                },
                modal: {
                    ondismiss: function () {
                        setIsProcessing(false);
                    }
                },
                prefill: {
                    name: user?.name || "Customer",
                    email: user?.email || "",
                    contact: shippingData.phone
                },
                theme: { color: "#0d9488" }
            };

            const rzp = new window.Razorpay(options);
            rzp.open();

        } catch (err) {
            toast.error("Failed to initiate payment. Check configuration.");
            setIsProcessing(false);
        }
    };

    if (cart.length === 0) return (
        <div className="section" style={{ marginTop: '150px', textAlign: 'center' }}>
            <h2>Your basket is empty</h2>
            <button className="btn btn-primary" onClick={() => navigate('/products')}>Explore Collection</button>
        </div>
    );

    return (
        <div className="section" style={{ marginTop: '100px', maxWidth: '1200px', margin: '100px auto' }}>
            <div style={{ marginBottom: '3rem' }}>
                <h1 style={{ fontSize: '3rem', fontWeight: 900, marginBottom: '0.5rem' }}>Secure <span style={{ color: 'var(--primary)' }}>Checkout</span></h1>
                <p style={{ color: 'var(--gray)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Lock size={16} /> 256-bit SSL Encrypted Payment Gateway
                </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '4rem', alignItems: 'start' }}>
                {/* Left: Shipping Info */}
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="glass" style={{ padding: '3rem', borderRadius: '40px', background: 'white', border: '1px solid #e2e8f0' }}>
                    <h3 style={{ marginBottom: '2.5rem', display: 'flex', alignItems: 'center', gap: '12px', fontSize: '1.4rem' }}>
                        <MapPin color="var(--primary)" size={24} /> 1. Shipping Meta
                    </h3>

                    <div style={{ display: 'grid', gap: '2rem' }}>
                        <div style={inputGroup}>
                            <label style={labelStyle}>Recipient's Full Name</label>
                            <div style={inputWrapper}><User size={18} color="var(--primary)" /> <input type="text" value={user?.name || ''} readOnly style={inputStyle} /></div>
                        </div>

                        <div style={inputGroup}>
                            <label style={labelStyle}>Verified Contact Number</label>
                            <div style={inputWrapper}><Phone size={18} color="var(--primary)" /> <input type="text" name="phone" onChange={handleChange} placeholder="+91 00000 00000" style={inputStyle} /></div>
                        </div>

                        <div style={inputGroup}>
                            <label style={labelStyle}>Primary Delivery Address</label>
                            <textarea name="address" onChange={handleChange} placeholder="House/Flat No, Apartment, Street, Landmark..." style={{ ...inputStyle, minHeight: '100px', padding: '1.2rem', background: '#f8fafc', borderRadius: '16px', border: '1px solid #e2e8f0' }} />
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                            <div style={inputGroup}>
                                <label style={labelStyle}>City / District</label>
                                <input type="text" name="city" onChange={handleChange} placeholder="Bengaluru" style={nestedInput} />
                            </div>
                            <div style={inputGroup}>
                                <label style={labelStyle}>PIN Code</label>
                                <input type="text" name="postalCode" onChange={handleChange} placeholder="560102" style={nestedInput} />
                            </div>
                        </div>
                    </div>

                    <div style={{ marginTop: '3rem', display: 'flex', gap: '2rem', padding: '1.5rem', background: '#f0fdf4', borderRadius: '20px', border: '1px solid #dcfce7' }}>
                        <div style={{ color: '#16a34a' }}><Truck size={32} /></div>
                        <div>
                            <h4 style={{ margin: 0, color: '#166534' }}>Eco-Fast Shipping Active</h4>
                            <p style={{ margin: 0, fontSize: '0.85rem', color: '#166534', opacity: 0.8 }}>Your certified device will be dispatched via insured air-courier.</p>
                        </div>
                    </div>
                </motion.div>

                {/* Right: Order Summary */}
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} style={{ position: 'sticky', top: '120px' }}>
                    <div className="glass" style={{ padding: '2.5rem', borderRadius: '40px', background: 'white', border: '1px solid #e2e8f0', boxShadow: '0 20px 40px rgba(0,0,0,0.03)' }}>
                        <h3 style={{ marginBottom: '2rem', fontSize: '1.3rem', fontWeight: 800 }}>Order Synthesis</h3>

                        <div style={{ display: 'grid', gap: '1.2rem', marginBottom: '2.5rem', maxHeight: '300px', overflowY: 'auto', paddingRight: '10px' }}>
                            {cart.map(item => (
                                <div key={item._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                                        <div style={{ width: '40px', height: '40px', background: '#f8fafc', borderRadius: '8px', padding: '4px' }}>
                                            <img src={item.image} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                                        </div>
                                        <div>
                                            <p style={{ margin: 0, fontWeight: 700, fontSize: '0.9rem' }}>{item.name}</p>
                                            <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--gray)' }}>QTY: {item.qty}</p>
                                        </div>
                                    </div>
                                    <span style={{ fontWeight: 800 }}>₹{(item.price * item.qty).toLocaleString()}</span>
                                </div>
                            ))}
                        </div>

                        <div style={{ borderTop: '2px dashed #f1f5f9', paddingTop: '2rem', marginBottom: '2.5rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--gray)', fontSize: '0.95rem', marginBottom: '10px' }}>
                                <span>Cart Valuation</span>
                                <span>₹{totalPrice.toLocaleString()}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#16a34a', fontSize: '0.95rem', marginBottom: '20px' }}>
                                <span>Refurbnest Shipping</span>
                                <span>FREE</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontWeight: 800, fontSize: '1.1rem' }}>Net Payable</span>
                                <span style={{ fontWeight: 900, fontSize: '2.2rem', color: 'var(--primary)' }}>₹{totalPrice.toLocaleString()}</span>
                            </div>
                        </div>

                        <button
                            onClick={handlePayment}
                            disabled={isProcessing}
                            className="btn btn-primary"
                            style={{ width: '100%', justifyContent: 'center', padding: '1.5rem', fontSize: '1.2rem', borderRadius: '20px', boxShadow: '0 15px 30px rgba(13, 148, 136, 0.3)' }}
                        >
                            {isProcessing ? "Initialising Gateway..." : <><CreditCard size={22} /> Proceed to Razorpay</>}
                        </button>

                        <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'center', gap: '1rem', opacity: 0.6 }}>
                            <ShieldCheck size={20} />
                            <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>PCI-DSS Level 1 Secure</span>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

const inputGroup = { display: 'grid', gap: '10px' };
const labelStyle = { fontSize: '0.85rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px' };
const inputWrapper = { display: 'flex', alignItems: 'center', gap: '12px', background: '#f8fafc', padding: '0 1.2rem', borderRadius: '16px', border: '1px solid #e2e8f0', transition: '0.3s' };
const inputStyle = { width: '100%', padding: '1.1rem 0', border: 'none', background: 'transparent', outline: 'none', fontSize: '1rem', fontWeight: 600, color: 'var(--dark)' };
const nestedInput = { width: '100%', padding: '1.1rem 1.2rem', borderRadius: '16px', border: '1px solid #e2e8f0', background: '#f8fafc', outline: 'none', fontWeight: 600, fontSize: '1rem' };

export default Checkout;
