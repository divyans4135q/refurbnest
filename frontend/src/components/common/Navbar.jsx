import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Zap, UserCircle, ShoppingCart, LogOut, LayoutDashboard, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import useAuthStore from '../../store/useAuthStore';
import useCartStore from '../../store/useCartStore';

import Button from './Button';

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
            top: scrolled ? 0 : 15,
            left: '50%',
            transform: 'translateX(-50%)',
            width: scrolled ? '100%' : '90%',
            maxWidth: scrolled ? '100%' : '1400px',
            padding: scrolled ? '1rem 5%' : '1.2rem 2.5rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            zIndex: 1000,
            background: scrolled ? 'rgba(255, 255, 255, 0.95)' : 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(20px)',
            borderRadius: scrolled ? 0 : 'var(--radius-lg)',
            borderBottom: scrolled ? '1px solid #f1f5f9' : '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: scrolled ? 'var(--shadow-sm)' : 'none',
            transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
        }}>
            <Link to="/" style={{
                fontSize: '1.4rem',
                fontWeight: 900,
                color: 'var(--dark)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem',
                textDecoration: 'none',
                letterSpacing: '-1.5px'
            }}>
                <div style={{ background: 'var(--primary)', padding: '6px', borderRadius: '10px', boxShadow: '0 4px 12px rgba(13, 148, 136, 0.3)' }}>
                    <Zap size={22} color="white" fill="white" />
                </div>
                <span>REFURB<span style={{ color: 'var(--primary)' }}>NEST</span></span>
            </Link>

            <ul style={{ display: 'flex', gap: '2.5rem', alignItems: 'center', listStyle: 'none', margin: 0, padding: 0 }}>
                <li><NavLink to="/" active={isActive('/')}>Explore</NavLink></li>
                <li><NavLink to="/products" active={isActive('/products')}>Collection</NavLink></li>
                <li><NavLink to="/about" active={isActive('/about')}>About</NavLink></li>
                <li><NavLink to="/emi" active={isActive('/emi')}>Financing</NavLink></li>

                {user?.isAdmin && (
                    <li><NavLink to="/admin" active={isActive('/admin')}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                            <Settings size={16} /> Admin
                        </span>
                    </NavLink></li>
                )}
            </ul>

            <div style={{ display: 'flex', gap: '1.2rem', alignItems: 'center' }}>
                <Link to="/cart" style={{ position: 'relative', display: 'flex', alignItems: 'center', textDecoration: 'none', background: 'white', padding: '10px', borderRadius: '14px', border: '1px solid #f1f5f9' }}>
                    <ShoppingCart size={22} color="var(--dark)" />
                    {cartItems.length > 0 && (
                        <span style={{
                            position: 'absolute', top: '-5px', right: '-5px',
                            background: 'var(--primary)', color: 'white', borderRadius: '50%',
                            width: '18px', height: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '0.65rem', fontWeight: 900, border: '2px solid white'
                        }}>
                            {cartItems.reduce((acc, item) => acc + item.qty, 0)}
                        </span>
                    )}
                </Link>

                {user ? (
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <Button type="primary" size="sm" onClick={() => window.location.href = '/dashboard'}>
                            <UserCircle size={18} /> {user.name.split(' ')[0]}
                        </Button>
                        <button onClick={() => logout()} style={{ background: 'rgba(239, 68, 68, 0.08)', border: 'none', padding: '10px 12px', borderRadius: '14px', cursor: 'pointer', color: '#ef4444' }}>
                            <LogOut size={20} />
                        </button>
                    </div>
                ) : (
                    <Button type="primary" size="sm" onClick={() => window.location.href = '/login'}>Login</Button>
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
