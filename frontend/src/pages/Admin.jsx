import { PlusCircle, Image as ImageIcon, Tag, IndianRupee, Layers, CheckCircle, Trash2, LayoutList, BarChart3, Package, Users, ShoppingBag, Truck, Clock, UploadCloud, X, RefreshCw, Eye, TrendingUp, PieChart as PieIcon, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, BarChart, Bar, Legend
} from 'recharts';
import api from '../services/api';
import toast from 'react-hot-toast';

const Admin = () => {
    const [products, setProducts] = useState([]);
    const [orders, setOrders] = useState([]);
    const [stats, setStats] = useState({ revenue: 0, orders: 0, users: 0, products: 0 });
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [activeTab, setActiveTab] = useState('inventory');
    const [uploadedImages, setUploadedImages] = useState([]);
    const [analytics, setAnalytics] = useState(null);

    const [formData, setFormData] = useState({
        name: '',
        category: 'Smartphones',
        price: '',
        discountedPrice: '',
        emiPerMonth: '',
        description: '',
        countInStock: '',
        is49PointChecked: true
    });

    useEffect(() => {
        fetchAdminData();
    }, []);

    const fetchAdminData = async () => {
        setLoading(true);
        try {
            const prodRes = await api.get('/products');
            setProducts(prodRes.data);

            const orderRes = await api.get('/orders');
            setOrders(orderRes.data);

            const userRes = await api.get('/users');

            const totalRev = orderRes.data.reduce((acc, order) => acc + (order.isPaid ? order.totalPrice : 0), 0);

            setStats({
                revenue: totalRev,
                orders: orderRes.data.length,
                users: userRes.data.length,
                products: prodRes.data.length
            });

            // Fetch Analytics
            const analyticsRes = await api.get('/orders/analytics');
            setAnalytics(analyticsRes.data);
        } catch (err) {
            toast.error("Failed to load admin data");
        }
        setLoading(false);
    };

    const handleUpload = async (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;

        const formDataUpload = new FormData();
        files.forEach(file => formDataUpload.append('image', file));

        setUploading(true);
        try {
            const { data } = await api.post('/upload', formDataUpload, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            // data.images is an array from the new backend
            setUploadedImages(prev => [...prev, ...data.images]);
            toast.success(`${data.images.length} image(s) uploaded!`);
        } catch (err) {
            toast.error(err.response?.data?.message || "Upload failed. Check Cloudinary credentials.");
        } finally {
            setUploading(false);
        }
    };

    const removeImage = async (img) => {
        if (img.public_id) {
            try {
                await api.delete(`/upload/${img.public_id}`);
            } catch (err) {
                console.error("Cloudinary delete failed", err);
            }
        }
        setUploadedImages(prev => prev.filter(i => i.url !== img.url));
    };

    const handleUpdateStatus = async (id, status) => {
        try {
            await api.put(`/orders/${id}/status`, { status });
            toast.success(`Order status updated to ${status}`);
            fetchAdminData();
        } catch (err) {
            toast.error("Update failed");
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (uploadedImages.length === 0) {
            return toast.error("Please upload at least one image");
        }

        try {
            const productData = {
                ...formData,
                price: Number(formData.price),
                discountedPrice: Number(formData.discountedPrice || formData.price),
                emiPerMonth: Number(formData.emiPerMonth),
                countInStock: Number(formData.countInStock),
                images: uploadedImages // Array of {url, public_id}
            };

            await api.post('/products', productData);
            toast.success("Product added to inventory!");
            setFormData({
                name: '', category: 'Smartphones', price: '', discountedPrice: '', emiPerMonth: '',
                description: '', countInStock: '', is49PointChecked: true
            });
            setUploadedImages([]);
            fetchAdminData();
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to add product");
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Remove this product permanently?')) {
            try {
                await api.delete(`/products/${id}`);
                toast.success("Product removed");
                fetchAdminData();
            } catch (err) {
                toast.error("Delete failed");
            }
        }
    };

    return (
        <div className="admin-page section" style={{ marginTop: '100px', maxWidth: '1400px', margin: '100px auto' }}>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                <div>
                    <h1 style={{ fontSize: '3.5rem', fontWeight: 900, marginBottom: '0.5rem' }}>Nest <span style={{ color: 'var(--primary)' }}>Control</span></h1>
                    <p style={{ color: 'var(--gray)', fontWeight: 600 }}>Command center for India's premium tech marketplace</p>
                </div>
                <button onClick={fetchAdminData} style={{ background: 'white', border: '1px solid #e2e8f0', padding: '12px', borderRadius: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700 }}>
                    <RefreshCw size={20} className={loading ? 'spin' : ''} /> Sync Data
                </button>
            </div>

            {/* Stats Header */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '4rem' }}>
                <StatCard icon={<IndianRupee />} title="Verified Revenue" value={`₹${stats.revenue.toLocaleString()}`} color="#0d9488" />
                <StatCard icon={<ShoppingBag />} title="Total Orders" value={stats.orders} color="#8b5cf6" />
                <StatCard icon={<Users />} title="Live Users" value={stats.users} color="#ec4899" />
                <StatCard icon={<Package />} title="Catalog Size" value={stats.products} color="#f59e0b" />
            </div>

            {/* Tab Switcher */}
            <div style={{ display: 'inline-flex', background: 'white', padding: '8px', borderRadius: '24px', border: '1px solid #f1f5f9', gap: '10px', marginBottom: '3rem', boxShadow: '0 10px 30px rgba(0,0,0,0.02)' }}>
                <TabButton active={activeTab === 'analytics'} onClick={() => setActiveTab('analytics')} icon={<BarChart3 size={20} />} text="Analytics" />
                <TabButton active={activeTab === 'inventory'} onClick={() => setActiveTab('inventory')} icon={<LayoutList size={20} />} text="Inventory" />
                <TabButton active={activeTab === 'orders'} onClick={() => setActiveTab('orders')} icon={<Truck size={20} />} text="Shipments" />
                <TabButton active={activeTab === 'media'} onClick={() => setActiveTab('media')} icon={<UploadCloud size={20} />} text="Media Assets" />
            </div>

            <AnimatePresence mode="wait">
                {activeTab === 'analytics' && analytics && (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} style={{ display: 'grid', gap: '2rem' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.2fr', gap: '2rem' }}>
                            {/* Revenue Area Chart */}
                            <div className="glass" style={{ ...panelStyle, height: '450px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                                    <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <TrendingUp color="var(--primary)" /> Revenue Velocity (Last 7 Days)
                                    </h3>
                                    <div style={{ fontSize: '1.5rem', fontWeight: 900 }}>₹{analytics.totalRevenue.toLocaleString()}</div>
                                </div>
                                <ResponsiveContainer width="100%" height="80%">
                                    <AreaChart data={analytics.revenueData}>
                                        <defs>
                                            <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3} />
                                                <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 700, fill: '#64748b' }} />
                                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 700, fill: '#64748b' }} />
                                        <Tooltip
                                            contentStyle={{ borderRadius: '15px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', fontWeight: 800 }}
                                            formatter={(value) => [`₹${value.toLocaleString()}`, 'Revenue']}
                                        />
                                        <Area type="monotone" dataKey="revenue" stroke="var(--primary)" strokeWidth={4} fillOpacity={1} fill="url(#colorRev)" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>

                            {/* Category Performance */}
                            <div className="glass" style={{ ...panelStyle, height: '450px' }}>
                                <h3 style={{ margin: '0 0 2rem 0', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <PieIcon color="#ec4899" /> Category Affinity
                                </h3>
                                <ResponsiveContainer width="100%" height="80%">
                                    <PieChart>
                                        <Pie
                                            data={analytics.categoryData}
                                            innerRadius={80}
                                            outerRadius={120}
                                            paddingAngle={5}
                                            dataKey="value"
                                        >
                                            {analytics.categoryData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                        <Legend verticalAlign="bottom" height={36} />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '2rem' }}>
                            <MetricBox title="Avg Order Value" value={`₹${Number(analytics.avgOrderValue).toLocaleString()}`} icon={<Activity color="#8b5cf6" />} />
                            <MetricBox title="Total Unit Throughput" value={analytics.totalOrders} icon={<Package color="#f59e0b" />} />
                            <MetricBox title="Platform Conversion" value="4.2%" icon={<TrendingUp color="#10b981" />} />
                        </div>
                    </motion.div>
                )}

                {activeTab === 'inventory' && (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '4rem', alignItems: 'start' }}>
                        {/* Add Product Form */}
                        <div className="glass" style={panelStyle}>
                            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <PlusCircle color="var(--primary)" /> Global Listing Entry
                            </h2>

                            <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1.5rem' }}>
                                <div style={inputGroup}>
                                    <label style={labelStyle}>Product Identity</label>
                                    <input type="text" name="name" value={formData.name} onChange={handleChange} required placeholder="e.g. iPhone 15 Pro Titanium" style={inputStyle} />
                                </div>

                                <div style={grid2}>
                                    <div style={inputGroup}>
                                        <label style={labelStyle}>Classification</label>
                                        <select name="category" value={formData.category} onChange={handleChange} style={inputStyle}>
                                            <option>Smartphones</option><option>Laptops</option><option>Gaming</option><option>Audio</option><option>Tablets</option>
                                        </select>
                                    </div>
                                    <div style={inputGroup}>
                                        <label style={labelStyle}>Live Units</label>
                                        <input type="number" name="countInStock" value={formData.countInStock} onChange={handleChange} required placeholder="Qty" style={inputStyle} />
                                    </div>
                                </div>

                                <div style={grid2}>
                                    <div style={inputGroup}>
                                        <label style={labelStyle}>List Valuation (₹)</label>
                                        <input type="number" name="price" value={formData.price} onChange={handleChange} required placeholder="MRP" style={inputStyle} />
                                    </div>
                                    <div style={inputGroup}>
                                        <label style={labelStyle}>Deal Price (₹)</label>
                                        <input type="number" name="discountedPrice" value={formData.discountedPrice} onChange={handleChange} required placeholder="Offer Price" style={inputStyle} />
                                    </div>
                                </div>

                                <div style={grid2}>
                                    <div style={inputGroup}>
                                        <label style={labelStyle}>EMI Threshold (₹)</label>
                                        <input type="number" name="emiPerMonth" value={formData.emiPerMonth} onChange={handleChange} required placeholder="Monthly" style={inputStyle} />
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginTop: 'auto', padding: '10px' }}>
                                        <input type="checkbox" name="is49PointChecked" checked={formData.is49PointChecked} onChange={handleChange} id="badge" style={{ width: '20px', height: '20px', cursor: 'pointer' }} />
                                        <label htmlFor="badge" style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--primary)', cursor: 'pointer' }}>49-PT CERTIFIED</label>
                                    </div>
                                </div>

                                <div style={inputGroup}>
                                    <label style={labelStyle}>Specs & Meta Description</label>
                                    <textarea name="description" value={formData.description} onChange={handleChange} required placeholder="Detailed technical specifications..." style={{ ...inputStyle, minHeight: '150px', resize: 'vertical' }} />
                                </div>

                                <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '1.2rem', marginTop: '1rem', fontSize: '1.1rem', borderRadius: '18px' }}>
                                    Confirm Listing Deployment
                                </button>
                            </form>
                        </div>

                        {/* Store Snapshots (List) */}
                        <div className="glass" style={panelStyle}>
                            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <LayoutList color="var(--primary)" /> Listing Matrix
                            </h2>
                            <div style={{ display: 'grid', gap: '1.2rem' }}>
                                {products.map(p => (
                                    <div key={p._id} style={listItemStyle}>
                                        <div style={{ width: '70px', height: '70px', background: 'white', borderRadius: '15px', padding: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #f1f5f9' }}>
                                            <img src={p.images?.[0]?.url || p.images?.[0]} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800 }}>{p.name}</h4>
                                            <div style={{ display: 'flex', gap: '15px', fontSize: '0.85rem', marginTop: '6px' }}>
                                                <span style={{ fontWeight: 900, color: 'var(--primary)' }}>₹{p.price.toLocaleString()}</span>
                                                <span style={{ color: 'var(--gray)', fontWeight: 700 }}>Stock: {p.countInStock}</span>
                                                <span style={{ color: '#0ea5e9', fontWeight: 800 }}>{p.category}</span>
                                            </div>
                                        </div>
                                        <div style={{ display: 'flex', gap: '8px' }}>
                                            <button onClick={() => handleDelete(p._id)} style={deleteBtnStyle}><Trash2 size={18} /></button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}

                {activeTab === 'media' && (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="glass" style={{ ...panelStyle, maxWidth: '100%' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                            <div>
                                <h2 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: '0.5rem' }}>Media Vault</h2>
                                <p style={{ color: 'var(--gray)', fontWeight: 600 }}>Securely upload and manage industrial-grade visual assets</p>
                            </div>
                            <div style={{ position: 'relative' }}>
                                <input type="file" multiple onChange={handleUpload} style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer' }} disabled={uploading} />
                                <button className="btn btn-primary" style={{ padding: '1rem 2rem' }}>
                                    <UploadCloud size={20} /> {uploading ? "Uploading..." : "Import New Assets"}
                                </button>
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '2rem' }}>
                            <AnimatePresence>
                                {uploadedImages.map((img, i) => (
                                    <motion.div
                                        key={img.url}
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.5 }}
                                        style={{ position: 'relative', height: '220px', borderRadius: '24px', overflow: 'hidden', border: '1px solid #e2e8f0', background: '#f8fafc', padding: '15px' }}
                                    >
                                        <img src={img.url} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />

                                        <div style={{ position: 'absolute', bottom: '15px', left: '15px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(22, 163, 74, 0.9)', color: 'white', padding: '4px 10px', borderRadius: '50px', fontSize: '0.65rem', fontWeight: 900, backdropFilter: 'blur(5px)' }}>
                                                <div style={{ width: '6px', height: '6px', background: 'white', borderRadius: '50%', boxShadow: '0 0 5px white' }}></div>
                                                LIVE ON CLOUDINARY
                                            </div>
                                        </div>

                                        <div style={{ position: 'absolute', top: '10px', right: '10px', display: 'flex', gap: '5px' }}>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    navigator.clipboard.writeText(img.url);
                                                    toast.success("URL Copied!");
                                                }}
                                                style={{ background: 'rgba(59, 130, 246, 0.9)', color: 'white', border: 'none', borderRadius: '10px', padding: '8px', cursor: 'pointer', backdropFilter: 'blur(5px)' }}
                                                title="Copy URL"
                                            >
                                                <ImageIcon size={16} />
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => removeImage(img)}
                                                style={{ background: 'rgba(239, 68, 68, 0.9)', color: 'white', border: 'none', borderRadius: '10px', padding: '8px', cursor: 'pointer', backdropFilter: 'blur(5px)' }}
                                                title="Delete Asset"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                            {uploadedImages.length === 0 && (
                                <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '8rem', color: '#cbd5e1' }}>
                                    <ImageIcon size={64} style={{ marginBottom: '1.5rem', opacity: 0.5 }} />
                                    <h3 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 800 }}>Vault Empty</h3>
                                    <p style={{ fontWeight: 600 }}>Upload product photography to begin</p>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}

                {activeTab === 'orders' && (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="glass" style={{ ...panelStyle, maxWidth: '100%' }}>
                        <h2 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: '2rem' }}>Shipment Logistics</h2>
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr style={{ textAlign: 'left', borderBottom: '2px solid #f1f5f9', color: 'var(--gray)', fontSize: '0.85rem' }}>
                                        <th style={{ padding: '1.2rem' }}>GLOBAL ID</th>
                                        <th>CUSTOMER DATA</th>
                                        <th>TOTAL VALUE</th>
                                        <th>LOGISTICS STATUS</th>
                                        <th style={{ textAlign: 'right' }}>CONTROL</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orders.map(order => (
                                        <tr key={order._id} style={{ borderBottom: '1px solid #f1f5f9', fontSize: '1rem', transition: '0.3s' }}>
                                            <td style={{ padding: '1.8rem 1.2rem', fontWeight: 900, color: 'var(--primary)' }}>#{order._id.slice(-8).toUpperCase()}</td>
                                            <td>
                                                <div style={{ fontWeight: 800, color: 'var(--dark)' }}>{order.user?.name || "Premium Client"}</div>
                                                <div style={{ fontSize: '0.8rem', color: 'var(--gray)', fontWeight: 600 }}>{order.shippingAddress?.city}, IN</div>
                                            </td>
                                            <td><span style={{ fontWeight: 900, fontSize: '1.1rem' }}>₹{order.totalPrice.toLocaleString()}</span></td>
                                            <td>
                                                <select
                                                    value={order.status}
                                                    onChange={(e) => handleUpdateStatus(order._id, e.target.value)}
                                                    style={{
                                                        padding: '8px 16px', borderRadius: '50px', fontSize: '0.75rem', fontWeight: 900,
                                                        background: getStatusColor(order.status).bg,
                                                        color: getStatusColor(order.status).text,
                                                        border: `1px solid ${getStatusColor(order.status).text}`,
                                                        cursor: 'pointer', outline: 'none', textTransform: 'uppercase'
                                                    }}
                                                >
                                                    <option value="Paid">Paid</option>
                                                    <option value="Processing">Processing</option>
                                                    <option value="Packed">Packed</option>
                                                    <option value="Shipped">Shipped</option>
                                                    <option value="Out for Delivery">Out for Delivery</option>
                                                    <option value="Delivered">Delivered</option>
                                                </select>
                                            </td>
                                            <td style={{ textAlign: 'right' }}>
                                                <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                                                    <button onClick={() => toast.success("Tracking Log: " + order.status)} style={{ background: '#f1f5f9', border: 'none', padding: '10px', borderRadius: '12px', cursor: 'pointer' }}><Clock size={18} /></button>
                                                    <button onClick={() => window.open(`/orders/${order._id}`)} style={{ background: 'var(--primary)', color: 'white', border: 'none', padding: '10px', borderRadius: '12px', cursor: 'pointer' }}><Eye size={18} /></button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <style>{`
                .spin { animation: spin 1s linear infinite; }
                @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
                tr:hover { background: #f8fafc; }
            `}</style>
        </div>
    );
};

const TabButton = ({ active, onClick, icon, text }) => (
    <button
        onClick={onClick}
        style={{
            padding: '12px 24px',
            borderRadius: '18px',
            border: 'none',
            background: active ? 'var(--primary)' : 'transparent',
            color: active ? 'white' : 'var(--gray)',
            fontWeight: 800,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            transition: '0.3s',
            boxShadow: active ? '0 10px 20px rgba(13, 148, 136, 0.2)' : 'none'
        }}
    >
        {icon} {text}
    </button>
);

const StatCard = ({ icon, title, value, color }) => (
    <div className="glass" style={{ padding: '2rem', background: 'white', borderRadius: '32px', borderLeft: `8px solid ${color}`, display: 'flex', alignItems: 'center', gap: '1.5rem', boxShadow: '0 15px 35px rgba(0,0,0,0.03)' }}>
        <div style={{ background: `${color}15`, padding: '1rem', borderRadius: '18px', color }}>{icon}</div>
        <div>
            <p style={{ margin: 0, color: 'var(--gray)', fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px' }}>{title}</p>
            <h3 style={{ margin: 0, fontSize: '1.8rem', fontWeight: 900, color: 'var(--dark)' }}>{value}</h3>
        </div>
    </div>
);

const panelStyle = { padding: '3rem', borderRadius: '40px', background: 'white', border: '1px solid #f1f5f9', boxShadow: '0 20px 50px rgba(0,0,0,0.02)' };
const inputGroup = { display: 'grid', gap: '8px' };
const labelStyle = { fontSize: '0.75rem', fontWeight: 900, color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px' };
const inputStyle = { width: '100%', padding: '1.1rem 1.4rem', borderRadius: '18px', border: '1px solid #e2e8f0', outline: 'none', background: '#f8fafc', fontSize: '1rem', fontWeight: 600, color: 'var(--dark)', transition: '0.3s' };
const grid2 = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' };
const listItemStyle = { display: 'flex', alignItems: 'center', gap: '1.5rem', padding: '1.5rem', borderRadius: '24px', background: '#f8fafc', border: '1px solid #f1f5f9', transition: '0.3s' };
const deleteBtnStyle = { background: '#fee2e2', color: '#ef4444', border: 'none', padding: '12px', borderRadius: '14px', cursor: 'pointer', transition: '0.3s' };

const COLORS = ['#0d9488', '#ec4899', '#8b5cf6', '#f59e0b', '#3b82f6', '#ef4444'];

const MetricBox = ({ title, value, icon }) => (
    <div className="glass" style={{ ...panelStyle, padding: '1.5rem 2rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '15px' }}>{icon}</div>
        <div>
            <p style={{ margin: 0, color: 'var(--gray)', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase' }}>{title}</p>
            <h4 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 900 }}>{value}</h4>
        </div>
    </div>
);

const getStatusColor = (status) => {
    switch (status) {
        case 'Delivered': return { bg: '#f0fdf4', text: '#16a34a' };
        case 'Shipped': return { bg: '#eff6ff', text: '#2563eb' };
        case 'Out for Delivery': return { bg: '#faf5ff', text: '#9333ea' };
        case 'Processing': return { bg: '#fff7ed', text: '#c2410c' };
        case 'Paid': return { bg: '#f8fafc', text: '#64748b' };
        default: return { bg: '#f1f5f9', text: '#475569' };
    }
};

export default Admin;
