import API from './axios';

const authService = {
    login: async (credentials) => {
        const response = await API.post('/users/login', credentials);
        return response.data;
    },
    register: async (userData) => {
        const response = await API.post('/users/register', userData);
        return response.data;
    },
    updateProfile: async (profileData) => {
        const response = await API.post('/users/update-profile', profileData);
        return response.data;
    }
};

export default authService;
