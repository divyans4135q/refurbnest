const smartphones = [
    {
        name: 'Apple iPhone 15 Pro (128GB) - Blue Titanium',
        images: [
            { url: 'https://images.unsplash.com/photo-1696446701796-da61225697cc?q=80&w=1200' },
            { url: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?q=80&w=1200' }
        ],
        description: 'Titanium design, A17 Pro chip, customizable Action button. Condition: Like New.',
        category: 'Smartphones',
        price: 119900,
        discountedPrice: 105000,
        emiPerMonth: Math.round(105000 / 12),
        countInStock: 8,
        rating: 4.9,
        numReviews: 24,
        is49PointChecked: true
    },
    {
        name: 'Apple iPhone 14 (128GB) - Midnight',
        images: [{ url: 'https://images.unsplash.com/photo-1663499482523-1c0c1bae4ce1?q=80&w=1200' }],
        description: 'Super Retina XDR display, advanced camera system. Condition: Excellent.',
        category: 'Smartphones',
        price: 69900,
        discountedPrice: 52000,
        emiPerMonth: Math.round(52000 / 12),
        countInStock: 15,
        rating: 4.7,
        numReviews: 45,
        is49PointChecked: true
    },
    {
        name: 'Samsung Galaxy S23 Ultra (256GB) - Phantom Black',
        images: [{ url: 'https://images.unsplash.com/photo-1678911820864-e2c567c655d7?q=80&w=1200' }],
        description: '200MP camera, built-in S Pen, and the fastest chip. Condition: Mint.',
        category: 'Smartphones',
        price: 124999,
        discountedPrice: 89999,
        emiPerMonth: Math.round(89999 / 12),
        countInStock: 6,
        rating: 4.8,
        numReviews: 32,
        is49PointChecked: true
    },
    {
        name: 'Google Pixel 7 Pro (128GB) - Hazel',
        images: [{ url: 'https://images.unsplash.com/photo-1667489022797-ab608913feeb?q=80&w=1200' }],
        description: 'The best of Google, powered by Tensor G2. Condition: Grade A.',
        category: 'Smartphones',
        price: 84999,
        discountedPrice: 54999,
        emiPerMonth: Math.round(54999 / 12),
        countInStock: 4,
        rating: 4.6,
        numReviews: 18,
        is49PointChecked: true
    },
    {
        name: 'OnePlus 11 5G (128GB) - Eternal Green',
        images: [{ url: 'https://images.unsplash.com/photo-1675154092378-1ca4978ec6a5?q=80&w=1200' }],
        description: 'Hasselblad Camera, Snapdragon 8 Gen 2, 100W SUPERVOOC. Condition: Premium.',
        category: 'Smartphones',
        price: 56999,
        discountedPrice: 42999,
        emiPerMonth: Math.round(42999 / 12),
        countInStock: 9,
        rating: 4.5,
        numReviews: 27,
        is49PointChecked: true
    },
];

export default smartphones;
