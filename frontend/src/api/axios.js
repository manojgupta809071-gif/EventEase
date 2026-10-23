import axios from 'axios';

const api = axios.create({
    baseURL: 'https://eventease-3-4a8w.onrender.com/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

export default api;