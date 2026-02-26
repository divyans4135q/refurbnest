import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, ShieldCheck, ChevronRight, ShoppingBag, ArrowLeft, Zap, CreditCard } from 'lucide-react';
import useCartStore from '../store/useCartStore';
import useAuthStore from '../store/useAuthStore';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

const Cart = () => {
    const { cartItems, removeFromCart } = useCartStore();
    const { user } = useAuthStore();
    const navigate = useNavigate();

    const itemsPrice = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
    const minEmi = cartItems.length > 0 ? Math.min(...cartItems.map(i => i.emiPerMonth || 0)) : 0;

    const handleCheckout = () => {
        if (!user) {
            toast.error("Please login to proceed");
            navigate('/login?redirect=checkout');
        } else {
            navigate('/checkout');
        }
    };

    return (
        <div className="section" style={{ marginTop: '100px', minHeight: '80vh', maxWidth: '1300px', margin: '100px auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3rem' }}>
                <div>
                    <h1 style={{ fontSize: '3.5rem', fontWeight: 900, marginBottom: '0.5rem' }}>Your <span style={{ color: 'var(--primary)' }}>Basket</span></h1>
                    <p style={{ color: 'var(--gray)', fontWeight: 600 }}>{cartItems.length} premium items ready for delivery</p>
                </div>
                <Link to="/products" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary)', textDecoration: 'none', fontWeight: 700, fontSize: '1rem' }}>
                    <ArrowLeft size={18} /> Continue Exploring
                </Link>
            </div>

            {cartItems.length === 0 ? (
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} style={{ textAlign: 'center', padding: '10rem 2rem', background: '#f8fafc', borderRadius: '48px', border: '2px dashed #e2e8f0' }}>
                    <div style={{ background: 'white', width: '100px', height: '100px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem', border: '1px solid #f1f5f9' }}>
                        <ShoppingBag size={48} color="#cbd5e1" />
                    </div>
                    <h2 style={{ marginBottom: '1rem', color: '#1e293b', fontWeight: 800 }}>Your basket is light...</h2>
                    <p style={{ color: 'var(--gray)', marginBottom: '2.5rem', fontSize: '1.1rem' }}>Looks like you haven't added any certified gadgets yet.</p>
                    <Link to="/products" className="btn btn-primary" style={{ padding: '1.2rem 2.5rem', fontSize: '1.1rem' }}>Browse Latest Drops</Link>
                </motion.div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '4rem', alignItems: 'start' }}>

                    {/* Items List */}
                    <div style={{ display: 'grid', gap: '1.5rem' }}>
                        <AnimatePresence>
                            {cartItems.map((item, idx) => (
                                <motion.div
                                    key={item._id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, x: -50 }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="glass"
                                    style={{
                                        display: 'flex', alignItems: 'center', gap: '2rem',
                                        background: 'white', padding: '1.5rem', borderRadius: '32px',
                                        border: '1px solid #f1f5f9', position: 'relative'
                                    }}
                                >
                                    <div style={{ width: '140px', height: '140px', background: '#f8fafc', borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '15px' }}>
                                        <img src={item.image || (item.images?.[0]?.url || item.images?.[0])} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                                    </div>

                                    <div style={{ flex: 1 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary)', fontWeight: 800, fontSize: '0.75rem', textTransform: 'uppercase', marginBottom: '8px' }}>
                                            <ShieldCheck size={14} /> Refurbnest Certified
                                        </div>
                                        <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '0.5rem', color: 'var(--dark)' }}>{item.name}</h3>
                                        <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--gray)', fontWeight: 600 }}>Qty: {item.qty} units</p>
                                    </div>

                                    <div style={{ textAlign: 'right', display: 'grid', gap: '10px' }}>
                                        <div style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--primary)' }}>
                                            ₹{item.price.toLocaleString()}
                                        </div>
                                        <button
                                            onClick={() => removeFromCart(item._id)}
                                            style={{
                                                background: '#fee2e2', border: 'none', color: '#ef4444',
                                                padding: '10px', borderRadius: '12px', cursor: 'pointer',
                                                transition: '0.3s', display: 'flex', alignItems: 'center', gap: '8px',
                                                fontSize: '0.8rem', fontWeight: 700, marginLeft: 'auto'
                                            }}
                                        >
                                            <Trash2 size={16} /> Remove
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>

                    {/* Summary Panel */}
                    <div style={{ position: 'sticky', top: '120px' }}>
                        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="glass" style={{ padding: '3rem', borderRadius: '40px', background: 'white', border: '1px solid #e2e8f0' }}>
                            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '2rem' }}>Order Analysis</h2>

                            <div style={{ display: 'grid', gap: '1.2rem', marginBottom: '2.5rem' }}>
                                <div style={sumRow}><span>Sub-valuation ({cartItems.length} units)</span><span>₹{itemsPrice.toLocaleString()}</span></div>
                                <div style={sumRow}><span>Logistics (Eco-Fast)</span><span style={{ color: '#16a34a' }}>FREE</span></div>
                                <div style={sumRow}><span>Platform Discount</span><span style={{ color: '#16a34a' }}>- ₹0.00</span></div>
                            </div>

                            <div style={{ borderTop: '2px dashed #f1f5f9', paddingTop: '2rem', marginBottom: '2.5rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ fontWeight: 800, fontSize: '1.2rem' }}>Total Payable</span>
                                    <div style={{ textAlign: 'right' }}>
                                        <span style={{ fontWeight: 900, fontSize: '2.5rem', color: 'var(--primary)' }}>₹{itemsPrice.toLocaleString()}</span>
                                        <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--gray)', fontWeight: 600 }}>GST Included</p>
                                    </div>
                                </div>
                            </div>

                            {minEmi > 0 && (
                                <div style={{ background: '#f0f9ff', padding: '1.2rem', borderRadius: '20px', border: '1px solid #e0f2fe', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '15px' }}>
                                    <CreditCard size={24} color="#0369a1" />
                                    <div>
                                        <h4 style={{ margin: 0, color: '#0369a1', fontSize: '0.9rem' }}>Smart Financing Available</h4>
                                        <p style={{ margin: 0, color: '#0369a1', opacity: 0.8, fontSize: '0.8rem' }}>Start paying from ₹{minEmi.toLocaleString()}/mo</p>
                                    </div>
                                </div>
                            )}

                            <button
                                className="btn btn-primary"
                                style={{ width: '100%', justifyContent: 'center', padding: '1.5rem', fontSize: '1.2rem', borderRadius: '20px', boxShadow: '0 15px 30px rgba(13, 148, 136, 0.3)' }}
                                onClick={handleCheckout}
                            >
                                <Zap size={20} fill="white" /> Proceed to Secure Checkout
                            </button>

                            <div style={{ marginTop: '2rem', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                                <ShieldCheck size={18} color="var(--gray)" />
                                <span style={{ fontSize: '0.8rem', color: 'var(--gray)', fontWeight: 600 }}>100% Buyer Protection & Satisfaction Guarantee</span>
                            </div>
                        </motion.div>
                    </div>

                </div>
            )}
        </div>
    );
};

const sumRow = { display: 'flex', justifyContent: 'space-between', color: '#64748b', fontWeight: 600, fontSize: '1.05rem' };

export default Cart;
