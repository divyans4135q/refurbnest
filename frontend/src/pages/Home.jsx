import React from 'react';
import HeroSlider from '../components/home/HeroSlider';
import ProductCard from '../components/product/ProductCard';
import api from '../services/api';
import { ShieldCheck, Zap, CreditCard, CheckCircle2, Award, Truck, Shield, Mail } from 'lucide-react';
import { motion } from 'framer-motion';

import Button from '../components/common/Button';

const Home = () => {
    const [products, setProducts] = React.useState([]);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        const fetchLiveProducts = async () => {
            setLoading(true);
            try {
                const { data } = await api.get('/products');
                setProducts(data.slice(0, 3));
            } catch (err) {
                console.error("Live fetch failed");
            } finally {
                setLoading(false);
            }
        };
        fetchLiveProducts();
    }, []);

    return (
        <div className="home-page">
            <HeroSlider />

            {/* Trending Section */}
            <section className="section" style={{ padding: 'var(--space-xl) 5%' }}>
                <div style={{ textAlign: 'center', marginBottom: 'var(--space-xl)' }}>
                    <span style={{ color: 'var(--primary)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '2px', fontSize: 'var(--font-xs)' }}>Staff Picks</span>
                    <h2 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 900, marginTop: 'var(--space-xs)' }}>Premium <span style={{ color: 'var(--primary)' }}>Certified</span> Deals</h2>
                    <p style={{ color: 'var(--gray)', fontSize: 'var(--font-lg)', maxWidth: '600px', margin: 'var(--space-sm) auto' }}>Handpicked premium gadgets that look and perform like brand new.</p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 'var(--space-lg)' }}>
                    {loading ? (
                        [1, 2, 3].map(i => <ProductSkeleton key={i} />)
                    ) : products.length > 0 ? (
                        products.map(product => (
                            <ProductCard key={product._id} product={product} />
                        ))
                    ) : (
                        <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: 'var(--space-xl)', background: 'var(--light)', borderRadius: 'var(--radius-xl)' }}>
                            <p style={{ fontWeight: 700, color: 'var(--gray)' }}>No trending deals at the moment.</p>
                        </div>
                    )}
                </div>
            </section>

            {/* 49-Point Check Marketing Section */}
            <section className="section" style={{ background: 'var(--white)', padding: 'var(--space-xxl) 5%', position: 'relative', overflow: 'hidden', borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-lg)', margin: '0 5% var(--space-xxl) 5%' }}>
                <div style={{ position: 'absolute', top: '-100px', left: '-100px', width: '400px', height: '400px', background: 'rgba(13, 148, 136, 0.03)', borderRadius: '50%' }}></div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: 'var(--space-xl)', alignItems: 'center', position: 'relative', zIndex: 1 }}>
                    <motion.div initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--primary)', fontWeight: 800, marginBottom: 'var(--space-sm)' }}>
                            <Award size={24} /> THE REFURBNEST PROMISE
                        </div>
                        <h2 style={{ fontSize: 'clamp(2.5rem, 6vw, 3.5rem)', fontWeight: 900, lineHeight: 1.1, marginBottom: 'var(--space-md)' }}>
                            Every Device <span style={{ color: 'var(--primary)' }}>Deep-Tested</span> Across 49-Points
                        </h2>
                        <p style={{ fontSize: 'var(--font-lg)', color: 'var(--gray)', lineHeight: 1.8, marginBottom: 'var(--space-lg)' }}>
                            Unlike others, we don't just "check" phones. We pass them through a 49-point rigorous diagnostic engine covering hardware, software, and battery health.
                        </p>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-sm)', marginBottom: 'var(--space-lg)' }}>
                            <FeatureItem icon={<ShieldCheck />} text="Expert Audited" />
                            <FeatureItem icon={<CheckCircle2 />} text="OEM Spares" />
                            <FeatureItem icon={<Truck />} text="Free Shipping" />
                            <FeatureItem icon={<Shield />} text="6-Month Warranty" />
                        </div>

                        <Button type="primary" size="lg" onClick={() => window.location.href = '/about'}>
                            Our Refurbishing Process
                        </Button>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        style={{ padding: 'var(--space-md)', background: 'var(--light)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)' }}
                    >
                        <div style={{ background: 'var(--primary)', color: 'white', padding: 'var(--space-md)', borderRadius: 'var(--radius-md)', marginBottom: 'var(--space-md)' }}>
                            <h3 style={{ margin: 0, fontSize: 'var(--font-xl)' }}>Diagnostic Scorecard</h3>
                            <p style={{ opacity: 0.8, fontSize: 'var(--font-sm)' }}>Live passing status for current inventory</p>
                            <div style={{ display: 'flex', gap: '0.8rem', marginTop: 'var(--space-sm)' }}>
                                <div style={pillStyle}>Battery: Pass</div>
                                <div style={pillStyle}>LCD: Pass</div>
                                <div style={pillStyle}>Auth: Verified</div>
                            </div>
                        </div>

                        <div style={{ display: 'grid', gap: '1rem' }}>
                            {[
                                "Touch Screen & Display Sensitivity",
                                "Battery Capacity & Charging Cycles",
                                "Network & WiFi Signal Strength",
                                "Camera Clarity Audits",
                                "Biometric & FaceID Validation"
                            ].map((check, i) => (
                                <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.8rem 1rem', background: 'var(--white)', borderRadius: 'var(--radius-sm)', border: '1px solid #f1f5f9' }}>
                                    <span style={{ fontSize: 'var(--font-sm)', fontWeight: 600 }}>{check}</span>
                                    <div style={{ width: '8px', height: '8px', background: '#16a34a', borderRadius: '50%', boxShadow: '0 0 10px #16a34a80' }}></div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Newsletter section */}
            <section className="section" style={{ padding: 'var(--space-xxl) 5%' }}>
                <div style={{
                    background: 'var(--dark)', padding: 'var(--space-xl)', borderRadius: 'var(--radius-xl)',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center',
                    boxShadow: 'var(--shadow-lg)', position: 'relative', overflow: 'hidden'
                }}>
                    <div style={{ position: 'absolute', top: '-100px', right: '-100px', width: '300px', height: '300px', background: 'rgba(255,255,255,0.03)', borderRadius: '50%' }}></div>

                    <h2 style={{ fontSize: 'var(--font-xxl)', fontWeight: 900, color: 'white', marginBottom: 'var(--space-sm)', zIndex: 1 }}>Join the Nest</h2>
                    <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 'var(--font-lg)', marginBottom: 'var(--space-lg)', maxWidth: '500px', zIndex: 1 }}>Get exclusive early access to premium drops and member-only pricing.</p>

                    <div style={{ display: 'flex', gap: '1rem', width: '100%', maxWidth: '500px', zIndex: 1 }}>
                        <div style={{ position: 'relative', flex: 1 }}>
                            <Mail style={{ position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)', color: 'var(--primary)' }} />
                            <input
                                type="email"
                                placeholder="Email address"
                                style={{ width: '100%', padding: '1rem 1rem 1rem 3.5rem', borderRadius: 'var(--radius-full)', border: 'none', fontSize: 'var(--font-md)', outline: 'none' }}
                            />
                        </div>
                        <Button type="primary" onClick={() => toast.success("Subscribed!")}>Join</Button>
                    </div>
                </div>
            </section>

            <style>{`
                .loader { width: 40px; height: 40px; border: 4px solid #f3f3f3; border-top: 4px solid var(--primary); border-radius: 50%; animation: spin 1s linear infinite; margin: auto; }
                @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
                
                .skeleton {
                    background: #f1f5f9;
                    background: linear-gradient(110deg, #f1f5f9 8%, #f8fafc 18%, #f1f5f9 33%);
                    background-size: 200% 100%;
                    animation: skeleton-loading 1.5s linear infinite;
                }
                @keyframes skeleton-loading {
                    0% { background-position: 200% 0; }
                    100% { background-position: -200% 0; }
                }
            `}</style>
        </div>
    );
};

const ProductSkeleton = () => (
    <div style={{ background: 'white', borderRadius: '32px', border: '1px solid #f1f5f9', overflow: 'hidden' }}>
        <div className="skeleton" style={{ height: '240px', width: '100%' }}></div>
        <div style={{ padding: '1.5rem 1.8rem' }}>
            <div className="skeleton" style={{ height: '14px', width: '30%', marginBottom: '10px' }}></div>
            <div className="skeleton" style={{ height: '24px', width: '80%', marginBottom: '15px' }}></div>
            <div className="skeleton" style={{ height: '32px', width: '50%', marginBottom: '10px' }}></div>
            <div className="skeleton" style={{ height: '14px', width: '60%', marginBottom: '20px' }}></div>
            <div className="skeleton" style={{ height: '50px', width: '100%', borderRadius: '18px' }}></div>
        </div>
    </div>
);

const FeatureItem = ({ icon, text }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.95rem', fontWeight: 700, color: '#374151' }}>
        <div style={{ color: 'var(--primary)', background: 'rgba(13, 148, 136, 0.1)', padding: '8px', borderRadius: '10px' }}>{icon}</div>
        {text}
    </div>
);

const pillStyle = { padding: '5px 12px', background: 'rgba(255,255,255,0.2)', borderRadius: '50px', fontSize: '0.75rem', fontWeight: 800 };

export default Home;
