

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; 
import { FaUserCircle, FaBell, FaSearch } from 'react-icons/fa';
import './Navbar.css';

const Navbar = ({ isAuthenticated, handleLogout }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate(); 


    let myId = null;
    const token = localStorage.getItem('token');
    if (token) {
        try {
            const decoded = JSON.parse(atob(token.split('.')[1]));
            myId = decoded.user.id;
        } catch (error) {
            console.error('Failed to decode token:', error);
        }
    }


    const handleSearch = (e) => {
        if (e.key === 'Enter' && searchQuery.trim() !== '') {

            navigate(`/search?q=${searchQuery}`);
        }
    };
    
    return (
        <nav className="navbar">
            <div className="navbar-left">
                <Link to="/" className="navbar-logo">
                    CIAAN_ASSIGNMENT
                </Link>
            </div>

            {isAuthenticated && (
                <div className="navbar-center">
                    <div className="search-box">
                        <FaSearch className="search-icon" />
                        <input
                            type="text"
                            placeholder="Search"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={handleSearch} 
                        />
                    </div>
                </div>
            )}

            <div className="navbar-right">
                {isAuthenticated ? (
                    <>
                        <Link to="/notifications" className="nav-item">
                            <FaBell className="nav-item-icon" />
                            <span>Notifications</span>
                        </Link>
                        
                        {myId && (
                            <Link to={`/profile/${myId}`} className="nav-item nav-profile-link">
                                <FaUserCircle className="nav-item-icon" />
                                <span>My Profile</span>
                            </Link>
                        )}
                        
                        <button onClick={handleLogout} className="button-like">
                            Logout
                        </button>
                    </>
                ) : (
                    <>
                        <Link to="/login" className="button-like">
                            Login
                        </Link>
                        <Link to="/register" className="button-like">
                            Register
                        </Link>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;