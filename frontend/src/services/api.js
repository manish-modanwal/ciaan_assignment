import axios from 'axios';


const API_URL = import.meta.env.VITE_API_URL;

const API = axios.create({
 baseURL: `${API_URL}/api`,
 headers: {
  'Content-Type': 'application/json',
  },
});


API.interceptors.request.use((req) => {
 if (localStorage.getItem('token')) {
   req.headers['x-auth-token'] = localStorage.getItem('token');
  }
 return req;
});


export const register = (formData) => API.post('/auth/register', formData);

export const login = (formData) => API.post('/auth/login', formData);


export const createPost = (postData) => API.post('/posts', postData);


export const getAllPosts = () => API.get('/posts');



export default API;