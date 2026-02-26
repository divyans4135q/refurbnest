import smartphones from './products/smartphones.js';
import laptops from './products/laptops.js';
import misc from './products/misc.js';

const products = [
    ...smartphones,
    ...laptops,
    ...misc
];

export default products;
