import React, { useState, useEffect } from 'react';
import useProductStore from '../store/useProductStore';
import ProductCard from '../components/product/ProductCard';
import { Filter, Search, ArrowUpDown, IndianRupee } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Categories = ['All', 'Smartphones', 'Laptops', 'Gaming', 'Tablets', 'Audio'];

const Products = () => {
    const { products, loading, fetchProducts } = useProductStore();
    const [activeCategory, setActiveCategory] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [priceRange, setPriceRange] = useState(200000);
    const [sortBy, setSortBy] = useState('newest');

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    const filteredProducts = React.useMemo(() => {
        let result = [...products];

        // Category Filter
        if (activeCategory !== 'All') {
            result = result.filter(p => p.category === activeCategory);
        }

        // Search Filter
        if (searchQuery) {
            result = result.filter(p =>
                p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                p.category.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // Price Filter
        result = result.filter(p => p.price <= priceRange);

        // Sorting
        if (sortBy === 'low-high') {
            result.sort((a, b) => a.price - b.price);
        } else if (sortBy === 'high-low') {
            result.sort((a, b) => b.price - a.price);
        } else if (sortBy === 'newest') {
            result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        }

        return result;
    }, [activeCategory, searchQuery, priceRange, sortBy, products]);

    return (
        <div className="products-page section" style={{ marginTop: '90px' }}>
            <div style={{ marginBottom: '3rem', textAlign: 'center' }}>
                <h1 style={{ fontSize: '3rem', fontWeight: 900, marginBottom: '0.5rem' }}>
                    Browse <span style={{ color: 'var(--primary)' }}>Collection</span>
                </h1>
                <p style={{ color: 'var(--gray)', fontSize: '1.1rem' }}>Premium gadgets, professional testing, unbeatable value.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '3rem', alignItems: 'start' }}>
                {/* Filters Sidebar */}
                <aside style={{ position: 'sticky', top: '120px' }}>
                    <div className="glass" style={{ padding: '2rem', borderRadius: '24px', background: 'white', border: '1px solid #e2e8f0' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '2rem' }}>
                            <Filter size={20} color="var(--primary)" />
                            <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800 }}>Filters</h3>
                        </div>

                        {/* Search */}
                        <div style={{ marginBottom: '2rem' }}>
                            <label style={filterLabelStyle}>Search Products</label>
                            <div style={{ position: 'relative' }}>
                                <Search style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} color="var(--gray)" size={16} />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Type to search..."
                                    style={filterInputStyle}
                                />
                            </div>
                        </div>

                        {/* Category */}
                        <div style={{ marginBottom: '2rem' }}>
                            <label style={filterLabelStyle}>Category</label>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                {Categories.map(cat => (
                                    <button
                                        key={cat}
                                        onClick={() => setActiveCategory(cat)}
                                        style={{
                                            padding: '8px 16px',
                                            borderRadius: '50px',
                                            border: '1px solid #e2e8f0',
                                            background: activeCategory === cat ? 'var(--primary)' : 'white',
                                            color: activeCategory === cat ? 'white' : 'var(--dark)',
                                            fontSize: '0.85rem',
                                            fontWeight: 700,
                                            cursor: 'pointer',
                                            transition: '0.2s',
                                            boxShadow: activeCategory === cat ? '0 5px 10px rgba(13, 148, 136, 0.2)' : 'none'
                                        }}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Price Range */}
                        <div style={{ marginBottom: '2rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                                <label style={filterLabelStyle}>Max Price</label>
                                <span style={{ fontWeight: 800, color: 'var(--primary)', fontSize: '0.9rem' }}>₹{priceRange.toLocaleString()}</span>
                            </div>
                            <input
                                type="range"
                                min="0"
                                max="200000"
                                step="5000"
                                value={priceRange}
                                onChange={(e) => setPriceRange(Number(e.target.value))}
                                style={{ width: '100%', accentColor: 'var(--primary)' }}
                            />
                        </div>

                        {/* Sort */}
                        <div>
                            <label style={filterLabelStyle}>Sort By</label>
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                style={{ ...filterInputStyle, paddingLeft: '1rem' }}
                            >
                                <option value="newest">Latest Arrivals</option>
                                <option value="low-high">Price: Low to High</option>
                                <option value="high-low">Price: High to Low</option>
                            </select>
                        </div>

                        <button
                            onClick={() => { setActiveCategory('All'); setSearchQuery(''); setPriceRange(200000); setSortBy('newest'); }}
                            style={{ width: '100%', marginTop: '2rem', padding: '12px', borderRadius: '12px', border: '1px solid #fee2e2', background: '#fef2f2', color: '#ef4444', fontWeight: 700, cursor: 'pointer', fontSize: '0.9rem' }}
                        >
                            Reset All Filters
                        </button>
                    </div>
                </aside>

                {/* Products Grid */}
                <main>
                    {loading ? (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
                            {[1, 2, 3, 4, 5, 6].map(i => <ProductSkeleton key={i} />)}
                        </div>
                    ) : (
                        <>
                            <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <p style={{ margin: 0, fontWeight: 700, color: 'var(--gray)' }}>Showing {filteredProducts.length} certified gadgets</p>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
                                <AnimatePresence mode='popLayout'>
                                    {filteredProducts.map(product => (
                                        <motion.div
                                            key={product._id}
                                            layout
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, scale: 0.9 }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            <ProductCard product={product} />
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </div>

                            {filteredProducts.length === 0 && (
                                <div style={{ textAlign: 'center', padding: '8rem 2rem', background: '#f8fafc', borderRadius: '32px' }}>
                                    <Filter size={48} color="#cbd5e1" style={{ marginBottom: '1.5rem' }} />
                                    <h2 style={{ color: '#1e293b' }}>No gadgets found</h2>
                                    <p style={{ color: 'var(--gray)', fontSize: '1.1rem' }}>Try adjusting your filters or search query.</p>
                                </div>
                            )}
                        </>
                    )}
                </main>
            </div>

            <style>{`
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

const filterLabelStyle = { display: 'block', fontSize: '0.85rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.8rem' };
const filterInputStyle = { width: '100%', padding: '0.8rem 1rem 0.8rem 2.8rem', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '0.9rem', outline: 'none', background: '#f8fafc', transition: '0.2s', position: 'relative' };

export default Products;
