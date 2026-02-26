import products from '../data/products.js';
import axios from 'axios';

async function verifyImages() {
    console.log('🚀 Starting Dynamic Analysis of Product Images...\n');
    let brokenCount = 0;

    for (const product of products) {
        console.log(`Checking: ${product.name}`);
        for (const img of product.images) {
            try {
                const response = await axios.head(img.url, { timeout: 5000 });
                if (response.status === 200) {
                    console.log(`  ✅ ${img.url}`);
                } else {
                    console.log(`  ❌ ${img.url} (Status: ${response.status})`);
                    brokenCount++;
                }
            } catch (error) {
                console.log(`  ❌ ${img.url} (Error: ${error.message})`);
                brokenCount++;
            }
        }
    }

    console.log(`\n📊 Analysis Complete. Broken Images: ${brokenCount}`);
}

verifyImages();
