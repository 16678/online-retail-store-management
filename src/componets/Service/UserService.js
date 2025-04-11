
import axios from 'axios';

const API_URL = '/api/users';

export const getUserProfile = (userId) => axios.get(`${API_URL}/${userId}`);

 export const updateUserProfile = (userId, user) => axios.put(`${API_URL}/${userId}`, user);
