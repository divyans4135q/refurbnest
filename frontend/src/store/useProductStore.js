import { create } from 'zustand';
import api from '../services/api';

const useProductStore = create((set) => ({
    products: [],
    loading: false,
    error: null,
    fetchProducts: async (keyword = '') => {
        set({ loading: true, error: null });
        try {
            const { data } = await api.get(`/products?keyword=${keyword}`);
            set({ products: data, loading: false });
        } catch (error) {
            set({
                error: error.response?.data?.message || error.message,
                loading: false,
            });
        }
    },
}));

export default useProductStore;
