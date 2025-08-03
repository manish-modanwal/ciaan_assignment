import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Register.css';


const API_URL = import.meta.env.VITE_API_URL;

const Register = ({ onRegister }) => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
    });
    const [error, setError] = useState(null);

    const { name, email, password } = formData;

    const onChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        try {
            
            const res = await axios.post(`${API_URL}/api/auth/register`, { name, email, password });
            localStorage.setItem('token', res.data.token);

            
            const userRes = await axios.get(`${API_URL}/api/profile/me`, {
                headers: { 'x-auth-token': res.data.token },
            });

            onRegister(userRes.data);
            navigate('/');

        } catch (err) {
            const errorMessage = err.response?.data?.msg || 'Registration failed. Please try again.';
            setError(errorMessage);
            console.error('Registration failed:', err.response?.data);
        }
    };

    return (
        <div className="form-container">
            <form onSubmit={onSubmit}>
                <h2>Register</h2>
                {error && <p className="error-message">{error}</p>}
                <input
                    type="text"
                    placeholder="Name"
                    name="name"
                    value={name}
                    onChange={onChange}
                    required
                />
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
                <button type="submit">Register</button>
            </form>
        </div>
    );
};

export default Register;