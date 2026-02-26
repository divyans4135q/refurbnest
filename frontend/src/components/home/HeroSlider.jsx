import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Zap, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const slides = [
    {
        id: 1,
        title: "iPhone 15 Pro",
        span: "Titanium",
        desc: "Certified Refurbished. 49-Point Inspected. Triple-Pass Quality Audit. Save up to ₹35,000.",
        badge: "REFURBISHED EXCELLENT",
        image: "https://images.unsplash.com/photo-1696446701796-da61225697cc?q=80&w=2000&auto=format&fit=crop"
    },
    {
        id: 2,
        title: "Galaxy S24 Ultra",
        span: "AI Evolution",
        desc: "The pinnacle of Android performance. Refurbished by experts to perform like day one.",
        badge: "PRE-OWNED SUPERB",
        image: "https://images.unsplash.com/photo-1707149022045-8134768393e1?q=80&w=2000&auto=format&fit=crop"
    },
    {
        id: 3,
        title: "MacBook Pro M3",
        span: "Powerhouse",
        desc: "Unleash extreme productivity with the M3 chip. Sustainably refurbished, undeniably powerful.",
        badge: "CERTIFIED MINT",
        image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=2000"
    }
];

const HeroSlider = () => {
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
        }, 6000);
        return () => clearInterval(timer);
    }, []);

    const nextSlide = () => setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    const prevSlide = () => setCurrent((prev) => (prev === 0 ? slides.length - 1 : prev - 1));

    return (
        <div className="hero-slider" style={{ height: '100vh', position: 'relative', overflow: 'hidden', background: '#0f172a' }}>
            <AnimatePresence mode="wait">
                <motion.div
                    key={current}
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1.5, ease: 'easeOut' }}
                    style={{
                        position: 'absolute',
                        width: '100%',
                        height: '100%',
                        backgroundImage: `linear-gradient(to right, rgba(15, 23, 42, 0.9) 0%, rgba(15, 23, 42, 0.4) 50%, rgba(15, 23, 42, 0.2) 100%), url(${slides[current].image})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'flex-start',
                        color: 'white',
                    }}
                >
                    <div className="section" style={{ width: '100%', maxWidth: '1400px', margin: '0 auto', padding: '0 5%' }}>
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.5, duration: 0.8 }}
                            style={{ maxWidth: '700px' }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1.5rem' }}>
                                <span style={{
                                    background: 'var(--primary)',
                                    color: 'white',
                                    padding: '6px 14px',
                                    borderRadius: '50px',
                                    fontSize: '0.75rem',
                                    fontWeight: 900,
                                    letterSpacing: '1px'
                                }}>{slides[current].badge}</span>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem', fontWeight: 700 }}>
                                    <ShieldCheck size={16} color="var(--primary)" /> 49-PT CHECKED
                                </div>
                            </div>

                            <h1 style={{ fontSize: '6rem', margin: '0 0 1.5rem 0', fontWeight: 900, lineHeight: 0.9, letterSpacing: '-3px' }}>
                                {slides[current].title} <br />
                                <span style={{
                                    background: 'linear-gradient(to right, var(--primary), #5eead4)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent'
                                }}>{slides[current].span}</span>
                            </h1>

                            <p style={{ fontSize: '1.3rem', marginBottom: '2.5rem', color: 'rgba(255,255,255,0.8)', lineHeight: 1.6, maxWidth: '500px' }}>
                                {slides[current].desc}
                            </p>

                            <div style={{ display: 'flex', gap: '1.5rem' }}>
                                <Link to="/products" className="btn btn-primary" style={{ padding: '1.2rem 3rem', fontSize: '1.1rem', borderRadius: '16px', boxShadow: '0 10px 30px rgba(13, 148, 136, 0.3)' }}>
                                    Shop Collection
                                </Link>
                                <Link to="/about" style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'white', textDecoration: 'none', fontWeight: 700 }}>
                                    <div style={{ background: 'rgba(255,255,255,0.1)', padding: '10px', borderRadius: '50%', backdropFilter: 'blur(10px)' }}>
                                        <Zap size={20} fill="white" />
                                    </div>
                                    Why Refurbnest?
                                </Link>
                            </div>
                        </motion.div>
                    </div>
                </motion.div>
            </AnimatePresence>

            {/* Navigation Overlays */}
            <div style={{ position: 'absolute', bottom: '60px', left: '5%', display: 'flex', gap: '20px', zItems: 20 }}>
                <button onClick={prevSlide} style={navIconStyle}><ChevronLeft size={24} /></button>
                <button onClick={nextSlide} style={navIconStyle}><ChevronRight size={24} /></button>
            </div>

            {/* Slide Progress */}
            <div style={{ position: 'absolute', bottom: '40px', right: '5%', display: 'flex', gap: '10px' }}>
                {slides.map((_, idx) => (
                    <motion.div
                        key={idx}
                        onClick={() => setCurrent(idx)}
                        animate={{
                            width: current === idx ? '40px' : '10px',
                            background: current === idx ? 'var(--primary)' : 'rgba(255,255,255,0.3)'
                        }}
                        style={{
                            height: '6px',
                            borderRadius: '50px',
                            cursor: 'pointer',
                            transition: '0.3s'
                        }}
                    />
                ))}
            </div>

            <style>{`
                .hero-slider::after {
                    content: '';
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    width: 100%;
                    height: 150px;
                    background: linear-gradient(transparent, #ffffff);
                    pointer-events: none;
                }
            `}</style>
        </div>
    );
};

const navIconStyle = {
    background: 'rgba(255,255,255,0.1)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(255,255,255,0.2)',
    color: 'white',
    width: '56px',
    height: '56px',
    borderRadius: '16px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: '0.3s'
};

export default HeroSlider;
