import API from './axios';

const landService = {
    getAllLands: async () => {
        const response = await API.get('/lands');
        return response.data;
    },
    getLandById: async (id) => {
        const response = await API.get(`/lands/${id}`);
        return response.data;
    },
    getApprovedLands: async () => {
        const response = await API.get('/lands/approved');
        return response.data;
    },
    // Add more methods as needed (create, update, delete, stats)
};

export default landService;
