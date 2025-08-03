import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import './Login.css';

const API_URL = import.meta.env.VITE_API_URL;

const Login = ({ onLogin }) => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [error, setError] = useState(null);

    const { email, password } = formData;

    const onChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        try {
            
            const res = await axios.post(`${API_URL}/api/auth/login`, {
                email,
                password,
            });
            localStorage.setItem('token', res.data.token);
            
            
            const userRes = await axios.get(`${API_URL}/api/profile/me`, {
                headers: { 'x-auth-token': res.data.token },
            });
            
            onLogin(userRes.data);
            navigate('/');

        } catch (err) {
            const errorMessage = err.response?.data?.msg || 'Login failed. Please check your credentials.';
            setError(errorMessage);
            console.error('Login failed:', err.response?.data);
        }
    };

    return (
        <div className="form-container">
            <form onSubmit={onSubmit}>
                <h2>Log In</h2>
                {error && <p className="error-message">{error}</p>}
                <input
                    type="email"
                    placeholder="Email Address"
                    name="email"
                    value={email}
                    onChange={onChange}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    name="password"
                    value={password}
                    onChange={onChange}
                    minLength="6"
                    required
                />
                <button type="submit">Log In</button>
            </form>
        </div>
    );
};

export default Login;