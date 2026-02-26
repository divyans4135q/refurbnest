import React from 'react';
import { ShoppingCart, Star, ShieldCheck, Zap, Heart } from 'lucide-react';
import useCartStore from '../../store/useCartStore';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const ProductCard = ({ product }) => {
    const navigate = useNavigate();
    const { addToCart } = useCartStore();

    return (
        <motion.div
            whileHover={{ y: -12 }}
            className="product-card"
            style={{
                background: 'white',
                borderRadius: '32px',
                overflow: 'hidden',
                border: '1px solid #f1f5f9',
                boxShadow: '0 10px 30px rgba(0,0,0,0.02)',
                position: 'relative',
                cursor: 'pointer',
                transition: 'box-shadow 0.3s'
            }}
            onClick={() => navigate(`/product/${product._id}`)}
        >
            {/* Image Section */}
            <div style={{ position: 'relative', height: '240px', background: '#f8fafc', padding: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                <motion.img
                    whileHover={{ scale: 1.15 }}
                    transition={{ duration: 0.5 }}
                    src={product.image || (product.images?.[0]?.url || product.images?.[0])}
                    alt={product.name}
                    loading="lazy"
                    style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                />

                {/* Floating Tags */}
                <div style={{ position: 'absolute', top: '15px', left: '15px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ background: 'var(--primary)', color: 'white', padding: '5px 12px', borderRadius: '50px', fontSize: '0.65rem', fontWeight: 900, textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <ShieldCheck size={12} /> GRADE A+
                    </div>
                </div>

                <div style={{ position: 'absolute', top: '15px', right: '15px' }}>
                    <button style={{ background: 'white', border: 'none', padding: '8px', borderRadius: '12px', boxShadow: '0 5px 15px rgba(0,0,0,0.05)', color: '#cbd5e1', cursor: 'pointer' }}>
                        <Heart size={18} />
                    </button>
                </div>
            </div>

            {/* Content Section */}
            <div style={{ padding: '1.5rem 1.8rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--primary)', letterSpacing: '1px', textTransform: 'uppercase' }}>
                        {product.category}
                    </span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b', padding: '4px 8px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 800 }}>
                        <Star size={12} fill="#f59e0b" /> {product.rating}
                    </div>
                </div>

                <h3 style={{ fontSize: '1.2rem', margin: '0 0 1rem 0', fontWeight: 800, color: 'var(--dark)', display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {product.name}
                </h3>

                <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', marginBottom: '4px' }}>
                    <span style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--dark)' }}>₹{product.discountedPrice?.toLocaleString() || product.price.toLocaleString()}</span>
                    {product.discountedPrice < product.price && (
                        <span style={{ fontSize: '0.95rem', color: '#94a3b8', textDecoration: 'line-through', fontWeight: 600 }}>₹{product.price.toLocaleString()}</span>
                    )}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#64748b', fontSize: '0.85rem', fontWeight: 700, marginBottom: '1.5rem' }}>
                    <Zap size={14} color="var(--primary)" fill="var(--primary)" /> EMI from ₹{product.emiPerMonth?.toLocaleString() || Math.round(product.price / 12).toLocaleString()}/mo
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                        className="btn btn-primary"
                        style={{ flex: 1, justifyContent: 'center', padding: '1rem', borderRadius: '18px', fontWeight: 800, fontSize: '0.95rem' }}
                        onClick={(e) => {
                            e.stopPropagation();
                            addToCart(product);
                            toast.success(`Success! ${product.name} ready for delivery.`);
                        }}
                    >
                        <ShoppingCart size={18} /> Add to Cart
                    </button>
                </div>
            </div>

            <style>{`
                .product-card:hover { 
                    box-shadow: 0 30px 60px rgba(0,0,0,0.08); 
                    border-color: var(--primary);
                }
            `}</style>
        </motion.div>
    );
};

export default ProductCard;
