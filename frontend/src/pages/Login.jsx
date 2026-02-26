import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';
import toast from 'react-hot-toast';
import { User, Lock, Mail, Zap, ShieldCheck, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isRegistering, setIsRegistering] = useState(false);
    const [name, setName] = useState('');

    const navigate = useNavigate();
    const { search } = useLocation();
    const sp = new URLSearchParams(search);
    const redirect = sp.get('redirect') || '/';

    const { login, register, loading, error, user } = useAuthStore();

    useEffect(() => {
        if (user) {
            navigate(redirect);
        }
    }, [navigate, redirect, user]);

    useEffect(() => {
        if (error) {
            toast.error(error);
        }
    }, [error]);

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            if (isRegistering) {
                await register(name, email, password);
                toast.success('Successfully Registered!');
            } else {
                await login(email, password);
                toast.success('Welcome back!');
            }
        } catch (err) {
            // Error is handled via zustand store effect hook
        }
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc', padding: '2rem' }}>
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass"
                style={{ padding: '0', borderRadius: '40px', background: 'white', width: '100%', maxWidth: '1000px', display: 'grid', gridTemplateColumns: 'minmax(400px, 1fr) 1fr', overflow: 'hidden', boxShadow: '0 30px 60px rgba(0,0,0,0.05)', border: '1px solid rgba(13, 148, 136, 0.1)' }}
            >
                {/* Visual Side */}
                <div style={{ background: 'var(--primary)', padding: '4rem', display: 'flex', flexDirection: 'column', justifyContent: 'center', color: 'white', position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', top: '-100px', right: '-100px', width: '300px', height: '300px', background: 'rgba(255,255,255,0.1)', borderRadius: '50%' }}></div>
                    <div style={{ position: 'absolute', bottom: '-50px', left: '-50px', width: '200px', height: '200px', background: 'rgba(255,255,255,0.1)', borderRadius: '50%' }}></div>

                    <div style={{ background: 'white', width: '60px', height: '60px', borderRadius: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '2rem' }}>
                        <Zap size={32} color="var(--primary)" fill="var(--primary)" />
                    </div>

                    <h2 style={{ fontSize: '3rem', fontWeight: 900, marginBottom: '1.5rem', lineHeight: 1.1 }}>Join India's Largest <br />Certified Nest.</h2>
                    <p style={{ fontSize: '1.2rem', opacity: 0.9, lineHeight: 1.6, marginBottom: '3rem' }}>Access premium refurbished tech with a 6-month warranty and doorstep support.</p>

                    <div style={{ display: 'grid', gap: '1.5rem' }}>
                        <TrustItem icon={<ShieldCheck size={20} />} text="49-Point Physical & Tech Audit" />
                        <TrustItem icon={<ShieldCheck size={20} />} text="6-Month Doorstep Warranty" />
                        <TrustItem icon={<ShieldCheck size={20} />} text="Verified Authentic Pre-owned Tech" />
                    </div>
                </div>

                {/* Form Side */}
                <div style={{ padding: '4rem' }}>
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={isRegistering ? 'reg' : 'log'}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                        >
                            <h2 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '0.5rem', color: 'var(--dark)' }}>
                                {isRegistering ? 'Get Started.' : 'Hello Again.'}
                            </h2>
                            <p style={{ color: 'var(--gray)', fontWeight: 600, marginBottom: '2.5rem' }}>
                                {isRegistering ? 'Create your account to start shopping.' : 'Login to access your orders and profile.'}
                            </p>

                            <form onSubmit={submitHandler} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                {isRegistering && (
                                    <div style={inputGroup}>
                                        <label style={labelStyle}>Full Legal Name</label>
                                        <div style={inputWrapper}>
                                            <User size={20} color="var(--gray)" />
                                            <input type="text" placeholder="John Doe" value={name} onChange={(e) => setName(e.target.value)} required style={inputStyle} />
                                        </div>
                                    </div>
                                )}

                                <div style={inputGroup}>
                                    <label style={labelStyle}>Work / Personal Email</label>
                                    <div style={inputWrapper}>
                                        <Mail size={20} color="var(--gray)" />
                                        <input type="email" placeholder="john@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required style={inputStyle} />
                                    </div>
                                </div>

                                <div style={inputGroup}>
                                    <label style={labelStyle}>Secure Password</label>
                                    <div style={inputWrapper}>
                                        <Lock size={20} color="var(--gray)" />
                                        <input type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required style={inputStyle} />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                    disabled={loading}
                                    style={{ width: '100%', padding: '1.2rem', fontSize: '1.1rem', justifyContent: 'center', marginTop: '1rem', borderRadius: '18px', boxShadow: '0 10px 25px rgba(13, 148, 136, 0.3)' }}
                                >
                                    {loading ? 'Processing...' : (isRegistering ? 'Initiate Register' : 'Enter the Nest')} <ArrowRight size={20} />
                                </button>
                            </form>

                            <div style={{ textAlign: 'center', marginTop: '3rem', color: 'var(--gray)', fontWeight: 600 }}>
                                {isRegistering ? 'Already a member? ' : "New here? "}
                                <button
                                    onClick={() => setIsRegistering(!isRegistering)}
                                    style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: 800, cursor: 'pointer', padding: 0 }}
                                >
                                    {isRegistering ? 'Sign In' : 'Create Account'}
                                </button>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </motion.div>
        </div>
    );
};

const TrustItem = ({ icon, text }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '1rem', fontWeight: 600 }}>
        <div style={{ background: 'rgba(255,255,255,0.2)', padding: '8px', borderRadius: '10px' }}>{icon}</div>
        {text}
    </div>
);

const inputGroup = { display: 'grid', gap: '8px' };
const labelStyle = { fontSize: '0.8rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px' };
const inputWrapper = { display: 'flex', alignItems: 'center', gap: '15px', background: '#f8fafc', padding: '0 1.5rem', borderRadius: '18px', border: '1px solid #e2e8f0', transition: '0.3s' };
const inputStyle = { width: '100%', padding: '1.1rem 0', border: 'none', background: 'transparent', outline: 'none', fontSize: '1rem', fontWeight: 600, color: 'var(--dark)' };

export default Login;
