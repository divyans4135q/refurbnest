import React from 'react';
import HeroSlider from '../components/home/HeroSlider';
import ProductCard from '../components/product/ProductCard';
import api from '../services/api';
import { ShieldCheck, Zap, CreditCard, CheckCircle2, Award, Truck, Shield, Mail } from 'lucide-react';
import { motion } from 'framer-motion';

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
            <section className="section" style={{ padding: '6rem 5%' }}>
                <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                    <span style={{ color: 'var(--primary)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '2px', fontSize: '0.8rem' }}>Staff Picks</span>
                    <h2 style={{ fontSize: '3rem', fontWeight: 900, marginTop: '0.5rem' }}>Premium <span style={{ color: 'var(--primary)' }}>Certified</span> Deals</h2>
                    <p style={{ color: 'var(--gray)', fontSize: '1.2rem', maxWidth: '600px', margin: '1rem auto' }}>Handpicked premium gadgets that look and perform like brand new.</p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2.5rem' }}>
                    {loading ? (
                        [1, 2, 3].map(i => <ProductSkeleton key={i} />)
                    ) : products.length > 0 ? (
                        products.map(product => (
                            <ProductCard key={product._id} product={product} />
                        ))
                    ) : (
                        <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '5rem', background: '#f8fafc', borderRadius: '32px' }}>
                            <p style={{ fontWeight: 700, color: 'var(--gray)' }}>No trending deals at the moment.</p>
                        </div>
                    )}
                </div>
            </section>

            {/* 49-Point Check Marketing Section */}
            <section className="section" style={{ background: '#f8fafc', padding: '8rem 5%', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: '-100px', left: '-100px', width: '400px', height: '400px', background: 'rgba(13, 148, 136, 0.05)', borderRadius: '50%' }}></div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5rem', alignItems: 'center', position: 'relative', zIndex: 1 }}>
                    <motion.div initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--primary)', fontWeight: 800, marginBottom: '1rem' }}>
                            <Award size={24} /> THE REFURBNEST PROMISE
                        </div>
                        <h2 style={{ fontSize: '3.5rem', fontWeight: 900, lineHeight: 1.1, marginBottom: '2rem' }}>
                            Every Device <span style={{ color: 'var(--primary)' }}>Deep-Tested</span> Across 49-Points
                        </h2>
                        <p style={{ fontSize: '1.2rem', color: '#4b5563', lineHeight: 1.8, marginBottom: '2.5rem' }}>
                            Unlike others, we don't just "check" phones. We pass them through a 49-point rigorous diagnostic engine covering hardware, software, and battery health. If it's not perfect, it's not here.
                        </p>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '3rem' }}>
                            <FeatureItem icon={<ShieldCheck />} text="Certified Expert Audited" />
                            <FeatureItem icon={<CheckCircle2 />} text="OEM Grade Spares" />
                            <FeatureItem icon={<Truck />} text="Insured Free Shipping" />
                            <FeatureItem icon={<Shield />} text="6-Month Doorstep Warranty" />
                        </div>

                        <button className="btn btn-primary" style={{ padding: '1.2rem 2.5rem', fontSize: '1.1rem' }}>
                            Learn About Refurbishing Process
                        </button>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        className="glass"
                        style={{ padding: '2rem', background: 'white', borderRadius: '40px', boxShadow: '0 30px 60px rgba(0,0,0,0.1)' }}
                    >
                        <div style={{ background: '#0d9488', color: 'white', padding: '2rem', borderRadius: '30px', marginBottom: '2rem' }}>
                            <h3 style={{ margin: 0 }}>Diagnostic Scorecard</h3>
                            <p style={{ opacity: 0.8, fontSize: '0.9rem' }}>Live passing status for current inventory</p>
                            <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                                <div style={pillStyle}>Battery: Pass</div>
                                <div style={pillStyle}>LCD: Pass</div>
                                <div style={pillStyle}>Auth: Verified</div>
                            </div>
                        </div>

                        <div style={{ display: 'grid', gap: '1.2rem' }}>
                            {[
                                "Touch Screen & Display Sensitivity",
                                "Battery Capacity & Charging Cycles",
                                "Network & WiFi Signal Strength",
                                "Front & Rear Camera Clarity Audits",
                                "Biometric & FaceID Validation"
                            ].map((check, i) => (
                                <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.8rem 1rem', background: '#f8fafc', borderRadius: '12px' }}>
                                    <span style={{ fontSize: '0.95rem', fontWeight: 600 }}>{check}</span>
                                    <div style={{ width: '10px', height: '10px', background: '#16a34a', borderRadius: '50%', boxShadow: '0 0 10px #16a34a80' }}></div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Newsletter section */}
            <section className="section" style={{ padding: '8rem 5%' }}>
                <div style={{
                    background: 'var(--primary)', padding: '5rem', borderRadius: '48px',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center',
                    boxShadow: '0 30px 60px rgba(13, 148, 136, 0.3)', position: 'relative', overflow: 'hidden'
                }}>
                    <div style={{ position: 'absolute', top: '-100px', right: '-100px', width: '300px', height: '300px', background: 'rgba(255,255,255,0.1)', borderRadius: '50%' }}></div>
                    <div style={{ position: 'absolute', bottom: '-50px', left: '-50px', width: '200px', height: '200px', background: 'rgba(255,255,255,0.1)', borderRadius: '50%' }}></div>

                    <h2 style={{ fontSize: '3rem', fontWeight: 900, color: 'white', marginBottom: '1rem', zIndex: 1 }}>Join the Nest</h2>
                    <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '1.2rem', marginBottom: '3rem', maxWidth: '500px', zIndex: 1 }}>Get exclusive early access to premium drops and member-only pricing. No spam, just deals.</p>

                    <div style={{ display: 'flex', gap: '1rem', width: '100%', maxWidth: '500px', zIndex: 1 }}>
                        <div style={{ position: 'relative', flex: 1 }}>
                            <Mail style={{ position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)', color: 'var(--primary)' }} />
                            <input
                                type="email"
                                placeholder="Enter your email address"
                                style={{ width: '100%', padding: '1.2rem 1.2rem 1.2rem 3.5rem', borderRadius: '18px', border: 'none', fontSize: '1rem', fontWeight: 600 }}
                            />
                        </div>
                        <button className="btn" style={{ background: 'var(--dark)', color: 'white', padding: '0 2rem', borderRadius: '18px', fontWeight: 800 }}>Subscribe</button>
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
