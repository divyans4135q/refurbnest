/**
 * Global Feature Tokens
 * Use these to dynamically toggle features across the app without changing logic code.
 */
export const TOKENS = {
    SHOW_PROMO_BANNER: true,
    ENABLE_EMI_CALCULATOR: true,
    MAINTENANCE_MODE: false,
    THEME: 'premium-teal', // options: 'premium-teal', 'midnight-gold'
    DISCOUNT_CODE: 'NESTFIRST',
    DISCOUNT_VALUE: '₹2,000',
    FREE_SHIPPING_LIMIT: 50000,
    API_RETRY_LIMIT: 3,
};

export const getFeatureToken = (key) => TOKENS[key];
