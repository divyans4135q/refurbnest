import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/common/Navbar';
import { AuthProvider } from './context/AuthContext';
import { Toaster } from 'react-hot-toast';
import Footer from './components/common/Footer';

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

// Simple placeholder pages for now
const About = () => (
  <div className="about-page" style={{ paddingTop: '100px', background: '#f8fafc' }}>
    <section className="section" style={{ padding: '6rem 5%', textAlign: 'center' }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <span style={{ color: 'var(--primary)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '2px' }}>Our Mission</span>
        <h1 style={{ fontSize: '4rem', fontWeight: 900, marginTop: '1rem', color: 'var(--dark)' }}>Giving Gadgets <br /><span style={{ color: 'var(--primary)' }}>A Second Life.</span></h1>
        <p style={{ maxWidth: '800px', margin: '2rem auto', fontSize: '1.25rem', color: '#64748b', lineHeight: 1.8 }}>
          RefurbNest was born from a simple idea: premium tech shouldn't cost the earth. We're on a mission to reduce e-waste while making flagship gadgets accessible to everyone through our rigorous 49-point certification process.
        </p>
      </motion.div>
    </section>

    <section className="section" style={{ background: 'white', padding: '8rem 5%' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem' }}>
        <AboutCard
          title="Certified Quality"
          desc="Every device undergoes a 49-point diagnostic test by our expert engineers."
        />
        <AboutCard
          title="Eco Friendly"
          desc="By choosing refurbished, you save up to 80% of the carbon footprint of a new device."
        />
        <AboutCard
          title="6-Month Warranty"
          desc="We stand by our work. Every purchase includes a comprehensive doorstep warranty."
        />
      </div>
    </section>
  </div>
);

const AboutCard = ({ title, desc }) => (
  <div style={{ padding: '3rem', borderRadius: '32px', background: '#f1f5f9', transition: '0.3s' }}>
    <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1rem' }}>{title}</h3>
    <p style={{ color: '#64748b', fontSize: '1.1rem', lineHeight: 1.6 }}>{desc}</p>
  </div>
);

const PageLoader = () => (
  <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc' }}>
    <div className="loader"></div>
  </div>
);

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Toaster position="top-center" reverseOrder={false} />
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
