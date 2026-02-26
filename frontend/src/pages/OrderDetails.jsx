import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Package, Truck, CheckCircle2, MapPin, IndianRupee, ArrowLeft, Clock, ShieldCheck, Download, Zap } from 'lucide-react';
import api from '../services/api';
import { motion } from 'framer-motion';

const OrderDetails = () => {
    const { id } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const { data } = await api.get(`/orders/${id}`);
                setOrder(data);
            } catch (err) {
                console.error("Order details failed");
            }
            setLoading(false);
        };
        fetchOrder();
    }, [id]);

    if (loading) return <div style={{ height: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><div className="loader"></div></div>;
    if (!order) return <div className="section"><center><h2>Order not found</h2><Link to="/dashboard">Back to Dashboard</Link></center></div>;

    const timeline = [
        { status: 'Paid', icon: <IndianRupee size={20} />, active: true, title: 'Payment Confirmed', date: order.paidAt },
        { status: 'Shipped', icon: <Truck size={20} />, active: order.status === 'Shipped' || order.status === 'Delivered', title: 'Package Shipped', date: order.shippedAt },
        { status: 'Delivered', icon: <CheckCircle2 size={20} />, active: order.status === 'Delivered', title: 'Delivered', date: order.deliveredAt },
    ];

    return (
        <div className="section" style={{ marginTop: '100px', maxWidth: '1100px', margin: '100px auto' }}>
            <Link to="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--gray)', textDecoration: 'none', marginBottom: '2rem', fontWeight: 600 }}>
                <ArrowLeft size={20} /> Back to My Orders
            </Link>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass" style={{ padding: '0', borderRadius: '40px', background: 'white', overflow: 'hidden', border: '1px solid #e2e8f0', boxShadow: '0 20px 50px rgba(0,0,0,0.05)' }}>
                {/* Header Strip */}
                <div style={{ background: '#0f172a', padding: '2.5rem 3rem', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h1 style={{ margin: 0, fontSize: '1.8rem', fontWeight: 900 }}>Order <span style={{ color: 'var(--primary)' }}>#{(order._id || '').slice(-8).toUpperCase()}</span></h1>
                        <p style={{ margin: '8px 0 0', opacity: 0.7, fontSize: '0.9rem' }}>Planted on {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString()}</p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(22, 163, 74, 0.2)', color: '#4ade80', padding: '0.5rem 1.2rem', borderRadius: '50px', fontSize: '0.9rem', fontWeight: 800 }}>
                            <ShieldCheck size={18} /> VERIFIED PAYMENT
                        </div>
                    </div>
                </div>

                <div style={{ padding: '3rem' }}>
                    {/* Timeline */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative', marginBottom: '5rem' }}>
                        <div style={{ position: 'absolute', top: '25px', left: '0', right: '0', height: '4px', background: '#f1f5f9', zIndex: 1, borderRadius: '2px' }}>
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: order.status === 'Delivered' ? '100%' : (order.status === 'Shipped' ? '50%' : '0%') }}
                                transition={{ duration: 1, ease: 'easeInOut' }}
                                style={{ height: '100%', background: 'var(--primary)', borderRadius: '2px' }}
                            />
                        </div>
                        {timeline.map((step, i) => (
                            <div key={i} style={{ position: 'relative', zIndex: 2, textAlign: 'center', minWidth: '120px' }}>
                                <motion.div
                                    initial={{ scale: 0.8 }}
                                    animate={{ scale: step.active ? 1.1 : 1 }}
                                    style={{
                                        width: '56px', height: '56px', background: step.active ? 'var(--primary)' : 'white',
                                        color: step.active ? 'white' : 'var(--gray)', borderRadius: '50%',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        border: step.active ? '4px solid white' : '2px solid #f1f5f9',
                                        margin: '0 auto 12px',
                                        boxShadow: step.active ? '0 10px 20px rgba(13, 148, 136, 0.3)' : 'none'
                                    }}>
                                    {step.icon}
                                </motion.div>
                                <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 800, color: step.active ? 'var(--dark)' : 'var(--gray)' }}>{step.title}</h4>
                                {step.date && <p style={{ margin: '4px 0 0', fontSize: '0.75rem', color: 'var(--gray)', fontWeight: 600 }}>{new Date(step.date).toLocaleDateString()}</p>}
                            </div>
                        ))}
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '4rem' }}>
                        {/* Left: Products & Certificate */}
                        <div>
                            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <Package size={22} color="var(--primary)" /> Shiping Group (Basket)
                            </h3>
                            <div style={{ display: 'grid', gap: '1.2rem' }}>
                                {order.orderItems.map((item, idx) => (
                                    <div key={idx} style={{ display: 'flex', gap: '1.5rem', background: '#f8fafc', padding: '1.2rem', borderRadius: '24px', border: '1px solid #f1f5f9' }}>
                                        <div style={{ width: '100px', height: '100px', background: 'white', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '10px' }}>
                                            <img src={item.image} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                                        </div>
                                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                            <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800 }}>{item.name}</h4>
                                            <div style={{ display: 'flex', gap: '15px', alignItems: 'center', marginTop: '8px' }}>
                                                <span style={{ fontWeight: 900, fontSize: '1.3rem', color: 'var(--primary)' }}>₹{item.price.toLocaleString()}</span>
                                                <span style={{ fontSize: '0.85rem', color: 'var(--gray)', fontWeight: 700, padding: '4px 10px', background: '#f1f5f9', borderRadius: '8px' }}>QTY: {item.qty}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Virtual QC Certificate UI */}
                            <div className="glass" style={{ marginTop: '2.5rem', padding: '2rem', borderRadius: '24px', background: 'white', border: '2px solid rgba(13, 148, 136, 0.1)', position: 'relative' }}>
                                <div style={{ position: 'absolute', top: '15px', right: '20px', color: 'rgba(13, 148, 136, 0.1)' }}><ShieldCheck size={80} /></div>
                                <h4 style={{ margin: '0 0 1rem 0', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.1rem' }}>
                                    <Zap size={20} color="var(--primary)" fill="var(--primary)" /> 49-PT Quality Certificate
                                </h4>
                                <p style={{ fontSize: '0.9rem', color: '#4b5563', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                                    This order has passed our global standards for premium refurbishment. Each item in this group has completed its triple-pass diagnostic audit.
                                </p>
                                <button className="btn btn-secondary" style={{ padding: '0.6rem 1.2rem', gap: '10px', borderRadius: '12px', fontSize: '0.85rem' }}>
                                    <Download size={16} /> Download QC Report
                                </button>
                            </div>
                        </div>

                        {/* Right: Address & Totals */}
                        <div>
                            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <MapPin size={22} color="var(--primary)" /> Delivery Meta
                            </h3>
                            <div style={{ background: '#f8fafc', padding: '2rem', borderRadius: '24px', border: '1px solid #f1f5f9' }}>
                                <p style={{ fontWeight: 900, fontSize: '1.2rem', margin: '0 0 10px 0', color: 'var(--dark)' }}>{order.user?.name || "Customer"}</p>
                                <div style={{ color: '#4b5563', fontSize: '0.95rem', lineHeight: 1.8 }}>
                                    {order.shippingAddress.address}<br />
                                    {order.shippingAddress.city}, {order.shippingAddress.postalCode}<br />
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '10px', fontWeight: 600 }}>
                                        <Clock size={16} color="var(--primary)" /> Ship Tier: 48-Hr Delivery
                                    </span>
                                </div>
                            </div>

                            <div style={{ marginTop: '2.5rem' }}>
                                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '1.5rem' }}>Cost Synthesis</h3>
                                <div style={{ display: 'grid', gap: '1.2rem' }}>
                                    <div style={sumRow}><span>Subtotal Valuation</span> <span>₹{order.totalPrice.toLocaleString()}</span></div>
                                    <div style={sumRow}><span>NEST Shipping (Insured)</span> <span style={{ color: '#16a34a' }}>FREE</span></div>
                                    <div style={sumRow}><span>Platform GST (Inc.)</span> <span style={{ color: 'var(--gray)' }}>₹0.00</span></div>
                                    <div style={{ ...sumRow, fontSize: '1.8rem', fontWeight: 900, marginTop: '1rem', borderTop: '2px solid #f1f5f9', paddingTop: '1.5rem' }}>
                                        <span>Total Paid</span>
                                        <span style={{ color: 'var(--primary)' }}>₹{order.totalPrice.toLocaleString()}</span>
                                    </div>
                                </div>
                                <div style={{ marginTop: '2.5rem', textAlign: 'center' }}>
                                    <p style={{ color: 'var(--gray)', fontSize: '0.8rem', fontStyle: 'italic' }}>Need help? Support ID: #{order._id.slice(0, 8)}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

const sumRow = { display: 'flex', justifyContent: 'space-between', fontSize: '1rem', fontWeight: 700, color: '#4b5563' };

export default OrderDetails;
