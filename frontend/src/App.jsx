

import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar.jsx';
import Login from './components/Login/Login.jsx';
import Register from './components/Register/Register.jsx';
import Dashboard from './components/Dashboard/Dashboard.jsx';
import ProfilePage from './components/Profile/ProfilePage';
import SearchResultsPage from './components/Search/SearchResultsPage';
import './App.css';
import axios from 'axios';


const API_URL = import.meta.env.VITE_API_URL;

function App() {
const [isAuthenticated, setIsAuthenticated] = useState(false);
const [user, setUser] = useState(null);
const [loading, setLoading] = useState(true);

useEffect(() => {
const token = localStorage.getItem('token');
const fetchUser = async () => {
if (token) {
try {

const res = await axios.get(`${API_URL}/api/auth`, {
headers: { 'x-auth-token': token },
});
setUser(res.data);
setIsAuthenticated(true);
} catch (err) {
localStorage.removeItem('token');
setIsAuthenticated(false);
setUser(null);
console.error('Failed to fetch user data with token.', err);
}
}
setLoading(false);
};

fetchUser();
}, []);

const handleLogin = (userData) => {
setIsAuthenticated(true);
setUser(userData);
};

const handleLogout = () => {
localStorage.removeItem('token');
setIsAuthenticated(false);
setUser(null);
};

if (loading) {
return <div>Loading...</div>;
}

return (
<div className="App">
<Navbar isAuthenticated={isAuthenticated} handleLogout={handleLogout} user={user} />
<Routes>
<Route path="/" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} />
<Route path="/login" element={<Login onLogin={handleLogin} />} />
<Route path="/register" element={<Register onRegister={handleLogin} />} />
<Route path="/profile/:id" element={isAuthenticated ? <ProfilePage /> : <Navigate to="/login" />} />
<Route path="/profile/:user_id" element={<ProfilePage />} />
<Route path="/search" element={<SearchResultsPage />} />
</Routes>
</div>
);
}

function AppWrapper() {
return (
<Router>
<App />
</Router>
 );
}

export default AppWrapper;