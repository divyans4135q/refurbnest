import { create } from 'zustand';

const useCartStore = create((set, get) => ({
    cartItems: localStorage.getItem('cartItems') ? JSON.parse(localStorage.getItem('cartItems')) : [],

    addToCart: (product, qty = 1) => {
        const item = {
            ...product,
            qty,
            image: product.image || (product.images?.[0]?.url || product.images?.[0])
        };
        const existItem = get().cartItems.find((x) => x._id === item._id);

        let newCartItems;
        if (existItem) {
            newCartItems = get().cartItems.map((x) =>
                x._id === existItem._id ? item : x
            );
        } else {
            newCartItems = [...get().cartItems, item];
        }

        localStorage.setItem('cartItems', JSON.stringify(newCartItems));
        set({ cartItems: newCartItems });
    },

    removeFromCart: (id) => {
        const newCartItems = get().cartItems.filter((x) => x._id !== id);
        localStorage.setItem('cartItems', JSON.stringify(newCartItems));
        set({ cartItems: newCartItems });
    },

    clearCart: () => {
        localStorage.removeItem('cartItems');
        set({ cartItems: [] });
    },

    getTotalPrice: () => {
        return get().cartItems.reduce((acc, item) => acc + (item.price * item.qty), 0);
    }
}));

export default useCartStore;
