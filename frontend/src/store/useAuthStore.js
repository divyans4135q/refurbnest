import { create } from 'zustand';
import api from '../services/api';

const useAuthStore = create((set) => ({
    user: localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : null,
    loading: false,
    error: null,

    login: async (email, password) => {
        set({ loading: true, error: null });
        try {
            const { data } = await api.post('/users/login', { email, password });
            localStorage.setItem('userInfo', JSON.stringify(data));
            set({ user: data, loading: false });
        } catch (error) {
            set({
                error: error.response?.data?.message || error.message,
                loading: false,
            });
            throw error;
        }
    },

    register: async (name, email, password) => {
        set({ loading: true, error: null });
        try {
            const { data } = await api.post('/users', { name, email, password });
            localStorage.setItem('userInfo', JSON.stringify(data));
            set({ user: data, loading: false });
        } catch (error) {
            set({
                error: error.response?.data?.message || error.message,
                loading: false,
            });
            throw error;
        }
    },

    logout: async () => {
        try {
            await api.post('/users/logout');
            localStorage.removeItem('userInfo');
            set({ user: null });
        } catch (error) {
            console.error('Logout failed', error);
        }
    },
}));

export default useAuthStore;
