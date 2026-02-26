import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Zap, UserCircle, ShoppingCart, LogOut, LayoutDashboard, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import useAuthStore from '../../store/useAuthStore';
import useCartStore from '../../store/useCartStore';

const Navbar = () => {
    const { user, logout } = useAuthStore();
    const { cartItems } = useCartStore();
    const location = useLocation();
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const isActive = (path) => location.pathname === path;

    return (
        <nav className="navbar" style={{
            position: 'fixed',
            top: 15,
            left: '50%',
            transform: 'translateX(-50%)',
            width: '90%',
            maxWidth: '1400px',
            padding: scrolled ? '0.8rem 2rem' : '1.2rem 2.5rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            zIndex: 1000,
            background: scrolled ? 'rgba(255, 255, 255, 0.85)' : 'rgba(255, 255, 255, 0.4)',
            backdropFilter: 'blur(15px)',
            borderRadius: '24px',
            border: scrolled ? '1px solid rgba(13, 148, 136, 0.1)' : '1px solid rgba(255, 255, 255, 0.4)',
            boxShadow: scrolled ? '0 10px 40px rgba(0,0,0,0.06)' : 'none',
            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
        }}>
            <Link to="/" style={{
                fontSize: '1.4rem',
                fontWeight: 900,
                color: 'var(--dark)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem',
                textDecoration: 'none',
                letterSpacing: '-1px'
            }}>
                <div style={{ background: 'var(--primary)', padding: '6px', borderRadius: '10px' }}>
                    <Zap size={22} color="white" fill="white" />
                </div>
                <span>REFURB<span style={{ color: 'var(--primary)' }}>NEST</span></span>
            </Link>

            <ul style={{ display: 'flex', gap: '2.5rem', alignItems: 'center', listStyle: 'none', margin: 0, padding: 0 }}>
                <li><NavLink to="/" active={isActive('/')}>Explore</NavLink></li>
                <li><NavLink to="/products" active={isActive('/products')}>Collection</NavLink></li>
                <li><NavLink to="/emi" active={isActive('/emi')}>Financing</NavLink></li>

                {user?.isAdmin && (
                    <li><NavLink to="/admin" active={isActive('/admin')}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                            <Settings size={16} /> Admin
                        </span>
                    </NavLink></li>
                )}
            </ul>

            <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                <Link to="/cart" style={{ position: 'relative', display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
                    <ShoppingCart size={24} color="var(--dark)" />
                    {cartItems.length > 0 && (
                        <span style={{
                            position: 'absolute', top: '-8px', right: '-10px',
                            background: 'var(--primary)', color: 'white', borderRadius: '50%',
                            width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '0.7rem', fontWeight: 900, border: '2px solid white'
                        }}>
                            {cartItems.reduce((acc, item) => acc + item.qty, 0)}
                        </span>
                    )}
                </Link>

                {user ? (
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                        <Link to="/dashboard" className="btn btn-primary" style={{ padding: '0.6rem 1.4rem', borderRadius: '15px', fontSize: '0.9rem', display: 'flex', gap: '8px' }}>
                            <UserCircle size={18} /> {user.name.split(' ')[0]}
                        </Link>
                        <button onClick={() => logout()} style={{ background: 'rgba(239, 68, 68, 0.1)', border: 'none', padding: '10px', borderRadius: '12px', cursor: 'pointer', color: '#ef4444' }}>
                            <LogOut size={20} />
                        </button>
                    </div>
                ) : (
                    <Link to="/login" className="btn btn-primary" style={{ padding: '0.6rem 1.8rem', borderRadius: '15px', fontWeight: 700 }}>Login</Link>
                )}
            </div>
        </nav>
    );
};

const NavLink = ({ to, children, active }) => (
    <Link to={to} style={{
        textDecoration: 'none',
        fontSize: '0.95rem',
        fontWeight: active ? 800 : 600,
        color: active ? 'var(--primary)' : 'var(--dark)',
        transition: '0.3s',
        display: 'flex',
        alignItems: 'center',
        padding: '5px 0',
        position: 'relative'
    }}>
        {children}
        {active && (
            <motion.div
                layoutId="nav-underline"
                style={{ position: 'absolute', bottom: -5, left: 0, right: 0, height: '3px', background: 'var(--primary)', borderRadius: '2px' }}
            />
        )}
    </Link>
);

export default Navbar;
