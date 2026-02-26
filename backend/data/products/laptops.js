const laptops = [
    {
        name: 'Apple MacBook Pro 14" (M2 Pro, 16GB, 512GB) - Space Grey',
        images: [{ url: 'https://images.unsplash.com/photo-1517336712412-f53578b9fe1b?q=80&w=1200' }, { url: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?q=80&w=1200' }],
        description: 'Unbelievable power of M2 Pro. Up to 18 hours battery. Condition: Open Box.',
        category: 'Laptops',
        price: 199900,
        discountedPrice: 165000,
        emiPerMonth: Math.round(165000 / 12),
        countInStock: 3,
        rating: 5.0,
        numReviews: 12,
        is49PointChecked: true
    },
    {
        name: 'Apple MacBook Air M1 (8GB, 256GB) - Silver',
        images: [{ url: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?q=80&w=1200' }],
        description: 'Macbook Air M1 - World\'s most popular laptop. Condition: Certified.',
        category: 'Laptops',
        price: 92900,
        discountedPrice: 59999,
        emiPerMonth: Math.round(59999 / 12),
        countInStock: 12,
        rating: 4.9,
        numReviews: 156,
        is49PointChecked: true
    },
    {
        name: 'Dell XPS 13 9315 (i7 12th Gen, 16GB, 512GB)',
        images: [{ url: 'https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?q=80&w=1200' }],
        description: 'Sleek, lightweight, and powerful Dell XPS. Condition: Like New.',
        category: 'Laptops',
        price: 135000,
        discountedPrice: 85000,
        emiPerMonth: Math.round(85000 / 12),
        countInStock: 5,
        rating: 4.6,
        numReviews: 21,
        is49PointChecked: true
    },
];

export default laptops;
