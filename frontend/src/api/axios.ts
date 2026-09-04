import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Future me yahan hum Token (Authorization header) automatically add karne ka logic bhi laga sakte hain
export default api;
