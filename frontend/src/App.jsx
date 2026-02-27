import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/common/Navbar';
import { AuthProvider } from './context/AuthContext';
import { Toaster } from 'react-hot-toast';
import Footer from './components/common/Footer';
import { motion } from 'framer-motion';
import { TOKENS } from './config/tokens';

// Lazy load pages for better performance
const Home = lazy(() => import('./pages/Home'));
const Products = lazy(() => import('./pages/Products'));
const ProductDetail = lazy(() => import('./pages/ProductDetail'));
const Cart = lazy(() => import('./pages/Cart'));
const Checkout = lazy(() => import('./pages/Checkout'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const OrderDetails = lazy(() => import('./pages/OrderDetails'));
const EMI = lazy(() => import('./pages/EMI'));
const Login = lazy(() => import('./pages/Login'));
const Admin = lazy(() => import('./pages/Admin'));
const About = lazy(() => import('./pages/About'));

const PageLoader = () => (
  <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc' }}>
    <div className="loader"></div>
  </div>
);

const PromoBanner = () => {
  if (!TOKENS.SHOW_PROMO_BANNER) return null;

  return (
    <motion.div
      initial={{ y: -50 }}
      animate={{ y: 0 }}
      style={{
        background: 'var(--primary-dark)',
        color: 'white',
        padding: '0.6rem',
        textAlign: 'center',
        fontSize: '0.85rem',
        fontWeight: 700,
        position: 'relative',
        zIndex: 2000
      }}
    >
      🎉 <span style={{ opacity: 0.8 }}>Special Launch:</span> Use code <span style={{ color: 'var(--secondary)', background: 'rgba(0,0,0,0.2)', padding: '2px 8px', borderRadius: '4px', margin: '0 5px' }}>NESTFIRST</span> for ₹2,000 off!
    </motion.div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Toaster position="top-center" reverseOrder={false} />
          <PromoBanner />
          <Navbar />
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/products" element={<Products />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/order/:id" element={<OrderDetails />} />
              <Route path="/emi" element={<EMI />} />
              <Route path="/about" element={<About />} />
              <Route path="/login" element={<Login />} />
              <Route path="/admin" element={<Admin />} />
            </Routes>
          </Suspense>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
