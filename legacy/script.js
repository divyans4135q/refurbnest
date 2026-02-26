// Mock Data - Prices referenced from Cashify & ControlZ (Feb 2026)
const products = [
    {
        id: 1,
        name: "iPhone 13 (128GB) - Midnight",
        category: "Mobile Phones",
        price: 34999,
        originalPrice: 59900,
        image: "https://images.unsplash.com/photo-1632661674596-df8be070a5c5?auto=format&fit=crop&q=80&w=500",
        rating: 4.8
    },
    {
        id: 2,
        name: "MacBook Air M1 (2020)",
        category: "Laptops",
        price: 41999,
        originalPrice: 92900,
        image: "product_laptop_mockup.png",
        rating: 4.9
    },
    {
        id: 3,
        name: "Apple Watch Series 7",
        category: "Smartwatches",
        price: 21999,
        originalPrice: 41900,
        image: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&q=80&w=500",
        rating: 4.7
    },
    {
        id: 4,
        name: "Sony PlayStation 5",
        category: "Gaming",
        price: 39999,
        originalPrice: 54990,
        image: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&q=80&w=500",
        rating: 4.9
    },
    {
        id: 5,
        name: "Samsung Galaxy S21 FE 5G",
        category: "Mobile Phones",
        price: 17499,
        originalPrice: 39999,
        image: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?auto=format&fit=crop&q=80&w=500",
        rating: 4.6
    },
    {
        id: 6,
        name: "iPad Air 4th Gen",
        category: "Tablets",
        price: 31999,
        originalPrice: 54900,
        image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&q=80&w=500",
        rating: 4.8
    },
    {
        id: 7,
        name: "Sony WH-1000XM4",
        category: "TVs & Audio",
        price: 14999,
        originalPrice: 22990,
        image: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&q=80&w=500",
        rating: 4.7
    },
    {
        id: 8,
        name: "Dell Latitude 7490",
        category: "Laptops",
        price: 22500,
        originalPrice: 85000,
        image: "https://images.unsplash.com/photo-1588872657578-a83f132e460b?auto=format&fit=crop&q=80&w=500",
        rating: 4.4
    }
];

// State Management
let cart = [];
let currentUser = JSON.parse(localStorage.getItem('refurbnest_user')) || null;
let currentCategory = 'All';

// DOM Elements
const pages = {
    home: document.getElementById('home-page'),
    products: document.getElementById('products-page'),
    emi: document.getElementById('emi-page'),
    login: document.getElementById('login-page'),
    dashboard: document.getElementById('dashboard-page'),
    about: document.getElementById('about-page'),
    contact: document.getElementById('contact-page')
};

// Navbar Update Logic
function updateAuthNav() {
    const authLink = document.getElementById('nav-auth');
    if (!authLink) return;

    if (currentUser) {
        authLink.innerHTML = '<i class="fas fa-user-circle"></i> Dashboard';
        authLink.setAttribute('data-page', 'dashboard');

        // Update dashboard name
        const dashboardTitle = document.querySelector('#dashboard-page h2 span');
        if (dashboardTitle) dashboardTitle.textContent = currentUser.name;
    } else {
        authLink.innerHTML = 'Login';
        authLink.setAttribute('data-page', 'login');
    }
}

// Slider Logic
let currentSlide = 0;
const slides = document.querySelectorAll('.slide');
const dots = document.querySelectorAll('.dot');

function showSlide(index) {
    slides.forEach(s => s.classList.remove('active'));
    dots.forEach(d => d.classList.remove('active'));

    if (index >= slides.length) currentSlide = 0;
    if (index < 0) currentSlide = slides.length - 1;

    slides[currentSlide].classList.add('active');
    dots[currentSlide].classList.add('active');
}

function nextSlide() {
    currentSlide++;
    showSlide(currentSlide);
}

function prevSlide() {
    currentSlide--;
    showSlide(currentSlide);
}

// Auto Slide every 5 seconds
let slideInterval = setInterval(nextSlide, 5000);

// Slider Event Listeners
document.querySelector('.slider-next')?.addEventListener('click', () => {
    nextSlide();
    clearInterval(slideInterval);
    slideInterval = setInterval(nextSlide, 5000);
});

document.querySelector('.slider-prev')?.addEventListener('click', () => {
    prevSlide();
    clearInterval(slideInterval);
    slideInterval = setInterval(nextSlide, 5000);
});

dots.forEach((dot, idx) => {
    dot.addEventListener('click', () => {
        currentSlide = idx;
        showSlide(currentSlide);
        clearInterval(slideInterval);
        slideInterval = setInterval(nextSlide, 5000);
    });
});

// Navigation Logic
function showPage(pageName) {
    // Auth Check: Redirect to login if trying to access dashboard while logged out
    if (pageName === 'dashboard' && !currentUser) {
        pageName = 'login';
    }

    // Hide all pages with animation
    Object.values(pages).forEach(page => {
        if (page) {
            page.style.opacity = '0';
            setTimeout(() => page.classList.add('hidden'), 300);
        }
    });

    // Show requested page with animation
    setTimeout(() => {
        if (pages[pageName]) {
            pages[pageName].classList.remove('hidden');
            setTimeout(() => pages[pageName].style.opacity = '1', 50);

            // Re-trigger reveal animations
            initReveal();

            // Refresh products if navigating to products page
            if (pageName === 'products') {
                filterProducts();
            }
        }
    }, 350);

    // Update Active Nav
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('data-page') === pageName) {
            link.classList.add('active');
        }
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Event Listeners for Nav
document.querySelectorAll('a[data-page]').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const page = e.currentTarget.getAttribute('data-page');
        showPage(page);
    });
});

// Auth Handlers
function logout() {
    currentUser = null;
    localStorage.removeItem('refurbnest_user');
    updateAuthNav();
    showToast('Logged out successfully', 'info');
    showPage('home');
}

function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = 'toast';
    const icon = type === 'success' ? 'fa-check-circle' : 'fa-info-circle';
    toast.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: ${type === 'success' ? 'var(--primary)' : 'var(--dark)'};
        color: white;
        padding: 1rem 2rem;
        border-radius: 50px;
        box-shadow: var(--shadow-lg);
        z-index: 2000;
        animation: fadeInUp 0.3s ease-out;
    `;
    toast.innerHTML = `<i class="fas ${icon}"></i> ${message}`;
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(20px)';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

const loginForm = document.getElementById('login-form');
if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = loginForm.querySelector('input[type="email"]').value;
        const name = email.split('@')[0]; // Simple name extraction

        currentUser = { email, name: name.charAt(0).toUpperCase() + name.slice(1) };
        localStorage.setItem('refurbnest_user', JSON.stringify(currentUser));

        updateAuthNav();
        showToast(`Welcome back, ${currentUser.name}!`, 'success');

        setTimeout(() => {
            showPage('dashboard');
        }, 800);
    });
}

// Add 'Coming Soon' for Create Account
document.querySelector('#login-form a')?.addEventListener('click', (e) => {
    e.preventDefault();
    showToast('Registration is coming soon! For now, please use the demo login.', 'info');
});

// Render Products
function renderProducts(productsToRender) {
    const grid = document.getElementById('products-grid');
    const featuredGrid = document.getElementById('featured-grid');

    if (grid) {
        grid.innerHTML = productsToRender.map((product, index) => createProductCard(product, index)).join('');
    }

    if (featuredGrid && productsToRender.length > 0) {
        // Show first 3 as featured
        featuredGrid.innerHTML = productsToRender.slice(0, 3).map((product, index) => createProductCard(product, index)).join('');
    }

    // Initialize reveal for newly added cards
    initReveal();
}

function createProductCard(product, index) {
    const emi = Math.round(product.price / 12);
    const hasBadge = index % 3 === 0; // Randomly assign badges for visual interest
    return `
        <div class="product-card reveal" style="transition-delay: ${index * 0.1}s">
            ${hasBadge ? '<div class="product-badge">Best Seller</div>' : ''}
            <img src="${product.image}" alt="${product.name}" class="product-image">
            <div class="product-details">
                <span class="category-tag">${product.category}</span>
                <h3 class="product-name">${product.name}</h3>
                <div class="price-container">
                    <span class="refurb-price">₹${product.price.toLocaleString()}</span>
                    <span class="original-price">₹${product.originalPrice.toLocaleString()}</span>
                </div>
                <span class="emi-tag">EMIs starting ₹${emi}/mo</span>
                <div class="card-actions">
                    <button class="btn btn-primary" onclick="addToCart(${product.id})" style="width: 100%">Add to Cart</button>
                </div>
            </div>
        </div>
    `;
}

// Filter Logic
function filterProducts() {
    const searchInput = document.getElementById('search-input');
    const categorySelect = document.getElementById('category-filter');

    const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
    const category = categorySelect ? categorySelect.value : 'All';

    const filtered = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm);
        const matchesCategory = category === 'All' || product.category === category;
        return matchesSearch && matchesCategory;
    });

    renderProducts(filtered);
}

// EMI Calculator Logic with Animation
function animateValue(id, start, end, duration) {
    const obj = document.getElementById(id);
    if (!obj) return;

    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const current = Math.floor(progress * (end - start) + start);

        if (id === 'emi-output') {
            obj.innerHTML = `₹${current.toLocaleString()}`;
        } else {
            obj.innerHTML = `Total Payment: ₹${current.toLocaleString()}`;
        }

        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}

let lastEmi = 0;
function calculateEMI() {
    const amount = parseFloat(document.getElementById('loan-amount').value);
    const months = parseFloat(document.getElementById('loan-term').value);
    const rate = parseFloat(document.getElementById('interest-rate').value) / 12 / 100;

    if (amount && months && rate) {
        const emi = Math.round((amount * rate * Math.pow(1 + rate, months)) / (Math.pow(1 + rate, months) - 1));
        const total = Math.round(emi * months);

        animateValue('emi-output', lastEmi, emi, 500);
        document.getElementById('total-output').textContent = `Total Payment: ₹${total.toLocaleString()}`;
        lastEmi = emi;
    }
}

// Scroll Reveal Initialization
function initReveal() {
    const reveals = document.querySelectorAll('.reveal, .category-card, .section h2');
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    reveals.forEach(el => {
        if (!el.classList.contains('reveal')) el.classList.add('reveal');
        observer.observe(el);
    });
}

// Navbar Scroll Effect
window.addEventListener('scroll', () => {
    const nav = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        nav.classList.add('scrolled');
    } else {
        nav.classList.remove('scrolled');
    }
});

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    updateAuthNav();
    renderProducts(products);

    // If user is already logged in, you can choose to show dashboard or stay on home
    // For this demo, let's just stay on home but ensure nav is correct

    // Smooth initial reveal
    setTimeout(initReveal, 100);

    // Filter listeners
    const searchInput = document.getElementById('search-input');
    const categoryFilter = document.getElementById('category-filter');
    if (searchInput) searchInput.addEventListener('input', filterProducts);
    if (categoryFilter) categoryFilter.addEventListener('change', filterProducts);

    // EMI inputs
    const emiInputs = ['loan-amount', 'loan-term', 'interest-rate'];
    emiInputs.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.addEventListener('input', calculateEMI);
    });

    // Default EMI values
    if (document.getElementById('loan-amount')) {
        calculateEMI();
    }
});

// Cart Functionality
function addToCart(id) {
    const product = products.find(p => p.id === id);
    cart.push(product);

    // Custom toast instead of alert
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: var(--primary);
        color: white;
        padding: 1rem 2rem;
        border-radius: 50px;
        box-shadow: var(--shadow-lg);
        z-index: 2000;
        animation: fadeInUp 0.3s ease-out;
    `;
    toast.innerHTML = `<i class="fas fa-check-circle"></i> ${product.name} added to cart!`;
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(20px)';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}
