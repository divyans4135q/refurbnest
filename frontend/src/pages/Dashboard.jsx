import React, { useEffect, useState } from 'react';
import { ShoppingBag, User, Package, Clock, CheckCircle2, ChevronRight, MapPin, Zap, ShieldCheck, Heart, LayoutDashboard, Settings } from 'lucide-react';
import useAuthStore from '../store/useAuthStore';
import api from '../services/api';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Dashboard = () => {
    const { user } = useAuthStore();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const { data } = await api.get('/orders/mine');
                setOrders(data);
            } catch (err) {
                console.error("Error fetching orders");
            }
            setLoading(false);
        };
        fetchOrders();
    }, []);

    const totalSpend = orders.reduce((acc, order) => acc + order.totalPrice, 0);
    const activeOrders = orders.filter(o => o.status !== 'Delivered').length;

    const getStatusColor = (status) => {
        switch (status) {
            case 'Paid': return '#8b5cf6';
            case 'Shipped': return '#0ea5e9';
            case 'Delivered': return '#16a34a';
            default: return '#94a3b8';
        }
    };

    return (
        <div className="section" style={{ marginTop: '100px', maxWidth: '1400px', margin: '100px auto' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '4rem', alignItems: 'start' }}>

                {/* Sidebar Profile */}
                <div className="glass" style={{ padding: '3rem 2rem', borderRadius: '40px', background: 'white', position: 'sticky', top: '120px', border: '1px solid #f1f5f9', boxShadow: '0 20px 40px rgba(0,0,0,0.02)' }}>
                    <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                        <div style={{ position: 'relative', width: '100px', height: '100px', margin: '0 auto 1.5rem' }}>
                            <div style={{ width: '100%', height: '100%', background: 'var(--primary)', color: 'white', borderRadius: '35%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', fontWeight: 900, transform: 'rotate(-5deg)' }}>
                                {user?.name?.charAt(0)}
                            </div>
                            <div style={{ position: 'absolute', bottom: '-5px', right: '-5px', background: 'white', padding: '5px', borderRadius: '50%', boxShadow: '0 5px 10px rgba(0,0,0,0.1)' }}>
                                <ShieldCheck size={20} color="var(--primary)" fill="var(--primary-light)" />
                            </div>
                        </div>
                        <h2 style={{ margin: 0, fontSize: '1.6rem', fontWeight: 900, color: 'var(--dark)' }}>{user?.name}</h2>
                        <p style={{ color: 'var(--gray)', fontSize: '0.9rem', fontWeight: 600 }}>{user?.email}</p>
                    </div>

                    <div style={{ display: 'grid', gap: '0.8rem' }}>
                        <DashboardNavLink icon={<ShoppingBag size={20} />} text="Orders & Fulfillment" active />
                        <DashboardNavLink icon={<User size={20} />} text="Account Identity" />
                        <DashboardNavLink icon={<MapPin size={20} />} text="Shipping Vault" />
                        <DashboardNavLink icon={<Heart size={20} />} text="Curated Wishlist" />
                    </div>

                    <div style={{ marginTop: '3rem', padding: '1.5rem', background: '#f8fafc', borderRadius: '24px', border: '1px solid #f1f5f9' }}>
                        <p style={{ margin: '0 0 10px 0', fontSize: '0.75rem', fontWeight: 800, color: 'var(--gray)', textTransform: 'uppercase' }}>Nest Rank</p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <Zap size={20} color="var(--primary)" fill="var(--primary)" />
                            <span style={{ fontWeight: 900, color: 'var(--dark)' }}>Elite Member</span>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div>
                    <div style={{ marginBottom: '3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h1 style={{ fontSize: '3rem', fontWeight: 900, margin: 0 }}>Nest <span style={{ color: 'var(--primary)' }}>Control</span></h1>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <StatCard label="Total Investment" value={`₹${totalSpend.toLocaleString()}`} />
                            <StatCard label="In-Transit" value={activeOrders} color="var(--primary)" />
                        </div>
                    </div>

                    <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <Package size={24} color="var(--primary)" /> Recent Transactions
                    </h3>

                    {loading ? (
                        <div style={{ textAlign: 'center', padding: '10rem 0' }}><div className="loader"></div></div>
                    ) : orders.length === 0 ? (
                        <div className="glass" style={{ padding: '5rem', textAlign: 'center', borderRadius: '40px', background: 'white', border: '2px dashed #f1f5f9' }}>
                            <ShoppingBag size={64} color="#cbd5e1" style={{ marginBottom: '1.5rem' }} />
                            <h3 style={{ fontSize: '1.5rem', fontWeight: 800 }}>No orders found</h3>
                            <p style={{ color: 'var(--gray)', marginBottom: '2.5rem', maxWidth: '300px', margin: '0 auto 2.5rem' }}>Your nest is currently empty. Ready for a certified upgrade?</p>
                            <Link to="/products" className="btn btn-primary" style={{ padding: '1rem 2.5rem' }}>Explore Catalog</Link>
                        </div>
                    ) : (
                        <div style={{ display: 'grid', gap: '2rem' }}>
                            {orders.map((order, idx) => (
                                <motion.div
                                    key={order._id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="order-card"
                                    style={{
                                        padding: '2rem', borderRadius: '32px', background: 'white',
                                        border: '1px solid #f1f5f9', boxShadow: '0 10px 30px rgba(0,0,0,0.02)',
                                        display: 'grid', gridTemplateColumns: '1fr 180px', gap: '2rem', alignItems: 'center'
                                    }}
                                >
                                    <div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '1.5rem' }}>
                                            <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--gray)', background: '#f8fafc', padding: '6px 12px', borderRadius: '10px' }}>
                                                #{order._id.slice(-8).toUpperCase()}
                                            </span>
                                            <div style={{
                                                background: `${getStatusColor(order.status)}15`,
                                                color: getStatusColor(order.status),
                                                padding: '6px 15px',
                                                borderRadius: '50px',
                                                fontSize: '0.8rem',
                                                fontWeight: 900,
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '6px'
                                            }}>
                                                <div style={{ width: '6px', height: '6px', background: getStatusColor(order.status), borderRadius: '50%' }}></div>
                                                {order.status.toUpperCase()}
                                            </div>
                                        </div>

                                        <div style={{ display: 'flex', gap: '1rem' }}>
                                            {order.orderItems.slice(0, 3).map((item, i) => (
                                                <div key={i} style={{ width: '60px', height: '60px', background: '#f8fafc', borderRadius: '12px', padding: '8px', border: '1px solid #f1f5f9' }}>
                                                    <img src={item.image} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                                                </div>
                                            ))}
                                            {order.orderItems.length > 3 && (
                                                <div style={{ width: '60px', height: '60px', background: '#f8fafc', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: 'var(--gray)', fontSize: '0.9rem' }}>
                                                    +{order.orderItems.length - 3}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div style={{ textAlign: 'right', borderLeft: '1px solid #f1f5f9', paddingLeft: '2rem' }}>
                                        <p style={{ margin: '0 0 5px 0', fontSize: '0.8rem', fontWeight: 700, color: 'var(--gray)' }}>VALUATION</p>
                                        <p style={{ margin: '0 0 1.5rem 0', fontSize: '1.8rem', fontWeight: 900, color: 'var(--dark)' }}>₹{order.totalPrice.toLocaleString()}</p>
                                        <Link to={`/order/${order._id}`} style={{
                                            display: 'inline-flex', alignItems: 'center', gap: '8px',
                                            color: 'var(--primary)', fontWeight: 800, textDecoration: 'none',
                                            fontSize: '0.9rem', padding: '8px 16px', background: 'rgba(13, 148, 136, 0.05)', borderRadius: '12px'
                                        }}>
                                            DETAILS <ChevronRight size={16} />
                                        </Link>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <style>{`
                .order-card:hover { transform: translateY(-5px); box-shadow: 0 20px 40px rgba(0,0,0,0.05); border-color: var(--primary-light); }
                .loader { border: 4px solid #f3f3f3; border-top: 4px solid var(--primary); border-radius: 50%; width: 40px; height: 40px; animation: spin 1s linear infinite; margin: auto; }
                @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
            `}</style>
        </div>
    );
};

const DashboardNavLink = ({ icon, text, active }) => (
    <button style={{
        width: '100%', padding: '1.2rem', borderRadius: '18px', border: 'none',
        background: active ? 'var(--primary)' : 'transparent',
        color: active ? 'white' : '#64748b',
        fontWeight: 800, textAlign: 'left', cursor: 'pointer',
        display: 'flex', alignItems: 'center', gap: '15px',
        transition: '0.3s', boxShadow: active ? '0 10px 20px rgba(13, 148, 136, 0.2)' : 'none'
    }}>
        {icon} {text}
    </button>
);

const StatCard = ({ label, value, color = 'var(--dark)' }) => (
    <div style={{ padding: '1.5rem 2rem', background: 'white', borderRadius: '24px', border: '1px solid #f1f5f9', minWidth: '180px' }}>
        <p style={{ margin: '0 0 8px 0', fontSize: '0.75rem', fontWeight: 800, color: 'var(--gray)', textTransform: 'uppercase', letterSpacing: '1px' }}>{label}</p>
        <p style={{ margin: 0, fontSize: '1.8rem', fontWeight: 900, color: color }}>{value}</p>
    </div>
);

export default Dashboard;
