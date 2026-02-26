import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin, ShieldCheck, Zap } from 'lucide-react';

const Footer = () => {
    return (
        <footer style={{ background: '#0f172a', color: 'white', paddingTop: '5rem', paddingBottom: '2rem' }}>
            <div className="section" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '4rem', marginBottom: '4rem' }}>
                {/* Brand Section */}
                <div>
                    <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none', color: 'white', marginBottom: '1.5rem' }}>
                        <div style={{ background: 'var(--primary)', padding: '8px', borderRadius: '12px' }}>
                            <Zap size={24} color="white" fill="white" />
                        </div>
                        <span style={{ fontSize: '1.8rem', fontWeight: 900, letterSpacing: '-1px' }}>REFURB<span style={{ color: 'var(--primary)' }}>NEST</span></span>
                    </Link>
                    <p style={{ color: '#94a3b8', lineHeight: '1.8', fontSize: '0.95rem' }}>
                        India's most trusted destination for certified refurbished gadgets. Every device undergoes a rigorous 49-point quality check to ensure peak performance.
                    </p>
                    <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                        <SocialIcon icon={<Instagram size={20} />} />
                        <SocialIcon icon={<Twitter size={20} />} />
                        <SocialIcon icon={<Facebook size={20} />} />
                        <SocialIcon icon={<Youtube size={20} />} />
                    </div>
                </div>

                {/* Quick Links */}
                <div>
                    <h4 style={footerTitleStyle}>Shop Categories</h4>
                    <ul style={listStyle}>
                        <li><FooterLink to="/products?category=Smartphones">Smartphones</FooterLink></li>
                        <li><FooterLink to="/products?category=Laptops">Premium Laptops</FooterLink></li>
                        <li><FooterLink to="/products?category=Gaming">Gaming Consoles</FooterLink></li>
                        <li><FooterLink to="/products?category=Audio">Audio & Wearables</FooterLink></li>
                        <li><FooterLink to="/products?category=Tablets">Tablets & iPads</FooterLink></li>
                    </ul>
                </div>

                {/* Support */}
                <div>
                    <h4 style={footerTitleStyle}>Our Promise</h4>
                    <ul style={listStyle}>
                        <li style={promiseItemStyle}><ShieldCheck size={18} color="var(--primary)" /> 6-Month Warranty</li>
                        <li style={promiseItemStyle}><Zap size={18} color="var(--primary)" /> 49-PT Quality Check</li>
                        <li style={promiseItemStyle}><Mail size={18} color="var(--primary)" /> 10-Day Returns</li>
                        <li style={promiseItemStyle}><Phone size={18} color="var(--primary)" /> 24/7 Expert Support</li>
                    </ul>
                </div>

                {/* Contact */}
                <div>
                    <h4 style={footerTitleStyle}>Contact Us</h4>
                    <div style={{ display: 'grid', gap: '1.2rem' }}>
                        <div style={contactItemStyle}>
                            <MapPin size={20} color="var(--primary)" />
                            <span style={{ color: '#94a3b8' }}>123 Tech Park, HSR Layout, Bengaluru, Karnataka 560102</span>
                        </div>
                        <div style={contactItemStyle}>
                            <Phone size={20} color="var(--primary)" />
                            <span style={{ color: '#94a3b8' }}>+91 800 123 4567</span>
                        </div>
                        <div style={contactItemStyle}>
                            <Mail size={20} color="var(--primary)" />
                            <span style={{ color: '#94a3b8' }}>hello@refurbnest.com</span>
                        </div>
                    </div>
                </div>
            </div>

            <div style={{ borderTop: '1px solid #1e293b', paddingTop: '2rem', textAlign: 'center' }}>
                <p style={{ color: '#64748b', fontSize: '0.85rem' }}>
                    © {new Date().getFullYear()} RefurbNest Electronics Pvt Ltd. All rights reserved. Made with ❤️ for a Greener Planet.
                </p>
            </div>
        </footer>
    );
};

const SocialIcon = ({ icon }) => (
    <div style={{
        width: '40px', height: '40px', borderRadius: '12px', background: '#1e293b',
        display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
        transition: '0.3s', color: '#94a3b8'
    }} onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--primary)'; e.currentTarget.style.color = 'white'; }}
        onMouseLeave={(e) => { e.currentTarget.style.background = '#1e293b'; e.currentTarget.style.color = '#94a3b8'; }}>
        {icon}
    </div>
);

const FooterLink = ({ children, to }) => (
    <Link to={to} style={{
        color: '#94a3b8', textDecoration: 'none', transition: '0.3s', fontSize: '0.95rem'
    }} onMouseEnter={(e) => e.target.style.color = 'white'}
        onMouseLeave={(e) => e.target.style.color = '#94a3b8'}>
        {children}
    </Link>
);

const footerTitleStyle = { fontSize: '1.1rem', fontWeight: 800, marginBottom: '2rem', textTransform: 'uppercase', letterSpacing: '1px' };
const listStyle = { listStyle: 'none', padding: 0, display: 'grid', gap: '1rem' };
const promiseItemStyle = { display: 'flex', alignItems: 'center', gap: '10px', color: '#94a3b8', fontSize: '0.95rem' };
const contactItemStyle = { display: 'flex', gap: '12px', alignItems: 'start', fontSize: '0.95rem' };

export default Footer;
