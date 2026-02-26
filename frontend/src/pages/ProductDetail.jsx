import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShoppingCart, Star, ArrowLeft, ShieldCheck, CheckCircle2, CreditCard, Truck, RefreshCw } from 'lucide-react';
import useProductStore from '../store/useProductStore';
import useCartStore from '../store/useCartStore';
import QualityCheckBadge from '../components/product/QualityCheckBadge';
import toast from 'react-hot-toast';
import api from '../services/api';
import useAuthStore from '../store/useAuthStore';
import { motion } from 'framer-motion';

const ProductDetail = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [mainImage, setMainImage] = useState('');
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const { addToCart } = useCartStore();
    const { user } = useAuthStore();

    const fetchProduct = async () => {
        try {
            const { data } = await api.get(`/products/${id}`);
            setProduct(data);
            setMainImage(data.images[0]?.url || data.images[0]);
            setLoading(false);
        } catch (err) {
            toast.error("Product not found");
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProduct();
    }, [id]);

    const submitHandler = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await api.post(`/products/${id}/reviews`, { rating, comment });
            toast.success("Review submitted! Thank you.");
            setComment('');
            fetchProduct();
        } catch (err) {
            toast.error(err.response?.data?.message || "Submit failed");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div style={{ height: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><div className="loader"></div></div>;
    if (!product) return <div className="section"><h2>Product not found</h2><Link to="/products">Back to Shop</Link></div>;

    return (
        <div className="section" style={{ marginTop: '100px', maxWidth: '1400px', margin: '100px auto' }}>
            <Link to="/products" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--gray)', textDecoration: 'none', marginBottom: '2rem', fontWeight: 600 }}>
                <ArrowLeft size={20} /> Back to Collection
            </Link>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '4rem' }}>
                {/* Image Gallery */}
                <div>
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ background: 'white', borderRadius: '32px', overflow: 'hidden', padding: '2rem', border: '1px solid #f1f5f9', marginBottom: '1.5rem', height: '500px', boxShadow: '0 20px 40px rgba(0,0,0,0.02)' }}>
                        <img src={mainImage} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                    </motion.div>
                    <div style={{ display: 'flex', gap: '1rem', overflowX: 'auto', paddingBottom: '1rem' }}>
                        {product.images.map((img, i) => (
                            <motion.img
                                whileHover={{ scale: 1.05 }}
                                key={i}
                                src={img?.url || img}
                                onClick={() => setMainImage(img?.url || img)}
                                style={{
                                    width: '100px', height: '100px', borderRadius: '16px', cursor: 'pointer',
                                    border: mainImage === (img?.url || img) ? '3px solid var(--primary)' : '1px solid #e2e8f0',
                                    objectFit: 'cover', background: 'white'
                                }}
                            />
                        ))}
                    </div>
                </div>

                {/* Content Details */}
                <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }}>
                    <span style={{ color: 'var(--primary)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px' }}>{product.category}</span>
                    <h1 style={{ fontSize: '3rem', fontWeight: 900, margin: '1rem 0', color: 'var(--dark)', lineHeight: 1.1 }}>{product.name}</h1>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                        <div style={{ display: 'flex', color: 'var(--secondary)' }}>
                            {[...Array(5)].map((_, i) => <Star key={i} size={20} fill={i < Math.floor(product.rating) ? "var(--secondary)" : "none"} stroke={i < Math.floor(product.rating) ? "none" : "currentColor"} />)}
                        </div>
                        <span style={{ fontWeight: 700 }}>{product.rating.toFixed(1)} ({product.numReviews} Verified Reviews)</span>
                    </div>

                    <div style={{ background: '#f8fafc', padding: '2.5rem', borderRadius: '32px', border: '1px solid #e2e8f0', marginBottom: '2.5rem', position: 'relative', overflow: 'hidden' }}>
                        <div style={{ position: 'absolute', top: 0, right: 0, background: 'var(--primary)', color: 'white', padding: '0.5rem 1.5rem', borderRadius: '0 0 0 20px', fontSize: '0.8rem', fontWeight: 800 }}>CERTIFIED REFURBISHED</div>
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '15px' }}>
                            <span style={{ fontSize: '4rem', fontWeight: 900, color: 'var(--primary)' }}>₹{product.price.toLocaleString()}</span>
                            <span style={{ fontSize: '1.8rem', color: 'var(--gray)', textDecoration: 'line-through' }}>₹{(product.price * 1.4).toLocaleString()}</span>
                        </div>
                        <p style={{ color: '#16a34a', fontWeight: 700, fontSize: '1.1rem', marginTop: '0.5rem' }}>
                            Save over ₹{(product.price * 0.4).toLocaleString()} compared to new
                        </p>
                    </div>

                    {/* EMI Promo Card */}
                    <div className="glass" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', padding: '1.5rem', borderRadius: '24px', border: '1px solid #e2e8f0', marginBottom: '2.5rem', background: 'white' }}>
                        <div style={{ background: 'rgba(13, 148, 136, 0.1)', padding: '1rem', borderRadius: '20px' }}>
                            <CreditCard size={32} color="var(--primary)" />
                        </div>
                        <div>
                            <h4 style={{ margin: 0 }}>Starting ₹{product.emiPerMonth.toLocaleString()}/mo</h4>
                            <p style={{ margin: 0, color: 'var(--gray)', fontSize: '0.9rem' }}>Choose from 3, 6, 9 or 12 month plans</p>
                        </div>
                        <button className="btn" style={{ marginLeft: 'auto', background: 'var(--primary)', color: 'white', padding: '0.5rem 1rem', borderRadius: '10px', fontSize: '0.85rem' }}>View Plans</button>
                    </div>

                    <QualityCheckBadge isChecked={product.is49PointChecked} />

                    <div style={{ display: 'flex', gap: '1rem', marginTop: '3rem' }}>
                        <button
                            className="btn btn-primary"
                            style={{ flex: 1, padding: '1.5rem', justifyContent: 'center', fontSize: '1.2rem', boxShadow: '0 15px 30px rgba(13, 148, 136, 0.3)' }}
                            onClick={() => {
                                addToCart(product);
                                toast.success('Added to your basket!');
                            }}
                        >
                            <ShoppingCart /> Add to Basket
                        </button>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginTop: '3.5rem' }}>
                        <div style={smallFeatureStyle}><Truck size={20} /> Guaranteed Free 48-Hour Delivery</div>
                        <div style={smallFeatureStyle}><RefreshCw size={20} /> 10-Day Easy Replacement</div>
                        <div style={smallFeatureStyle}><CheckCircle2 size={20} /> 6-Month Refurbnest Warranty</div>
                        <div style={smallFeatureStyle}><ShieldCheck size={20} /> Triple-Pass 49-PT Inspection</div>
                    </div>
                </motion.div>
            </div>

            {/* Product description & Reviews Tabs */}
            <div style={{ marginTop: '7rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '5rem', alignItems: 'start' }}>
                    <div>
                        <h2 style={{ fontSize: '2.2rem', fontWeight: 900, marginBottom: '2rem' }}>Detailed Specifications</h2>
                        <div style={{ fontSize: '1.15rem', lineHeight: '1.9', color: '#4b5563', whiteSpace: 'pre-wrap', background: '#f8fafc', padding: '2rem', borderRadius: '24px', border: '1px solid #e2e8f0' }}>
                            {product.description}
                        </div>
                    </div>

                    <div>
                        <h2 style={{ fontSize: '2.2rem', fontWeight: 900, marginBottom: '2rem' }}>Customer Reviews</h2>

                        <div style={{ display: 'grid', gap: '1.5rem', marginBottom: '3rem' }}>
                            {product.reviews && product.reviews.length === 0 ? (
                                <p style={{ color: 'var(--gray)', fontStyle: 'italic' }}>No reviews yet. Be the first to share your experience!</p>
                            ) : (
                                product.reviews?.map((rev, i) => (
                                    <div key={i} className="glass" style={{ padding: '1.5rem', borderRadius: '20px', border: '1px solid #f1f5f9', background: 'white' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.8rem' }}>
                                            <span style={{ fontWeight: 800 }}>{rev.name}</span>
                                            <div style={{ display: 'flex', color: 'var(--secondary)' }}>
                                                {[...Array(5)].map((_, j) => <Star key={j} size={14} fill={j < rev.rating ? "var(--secondary)" : "none"} />)}
                                            </div>
                                        </div>
                                        <p style={{ margin: 0, color: '#4b5563', fontSize: '0.95rem' }}>"{rev.comment}"</p>
                                        <div style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: 'var(--gray)' }}>{new Date(rev.createdAt).toLocaleDateString()}</div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Leave a Review */}
                        <div className="glass" style={{ padding: '2rem', borderRadius: '24px', background: '#f8fafc', border: '1px solid #e2e8f0' }}>
                            <h3 style={{ margin: '0 0 1.5rem 0' }}>Share Your Experience</h3>
                            {user ? (
                                <form onSubmit={submitHandler} style={{ display: 'grid', gap: '1.2rem' }}>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '8px' }}>Your Rating</label>
                                        <select value={rating} onChange={(e) => setRating(e.target.value)} style={{ width: '100%', padding: '0.8rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                                            <option value="5">Excellent - 5 Stars</option>
                                            <option value="4">Good - 4 Stars</option>
                                            <option value="3">Average - 3 Stars</option>
                                            <option value="2">Poor - 2 Stars</option>
                                            <option value="1">Terrible - 1 Star</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '8px' }}>Your Thoughts</label>
                                        <textarea
                                            value={comment}
                                            onChange={(e) => setComment(e.target.value)}
                                            required
                                            placeholder="What do you think about this certified gadget?"
                                            style={{ width: '100%', padding: '1rem', borderRadius: '12px', border: '1px solid #e2e8f0', minHeight: '100px' }}
                                        />
                                    </div>
                                    <button type="submit" disabled={submitting} className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                                        {submitting ? 'Submitting...' : 'Post Verified Review'}
                                    </button>
                                </form>
                            ) : (
                                <div style={{ textAlign: 'center', padding: '1rem' }}>
                                    <p style={{ color: 'var(--gray)', fontSize: '0.9rem' }}>Please log in to share your review.</p>
                                    <Link to={`/login?redirect=/product/${id}`} className="btn btn-secondary" style={{ display: 'inline-block', marginTop: '10px' }}>Sign In to Review</Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const smallFeatureStyle = {
    display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', color: 'var(--gray)', fontWeight: 600
};

export default ProductDetail;
