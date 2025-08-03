

import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import axios from 'axios';
import PostItem from '../PostsFeed/PostItem';
import './SearchResultsPage.css';


const API_URL = import.meta.env.VITE_API_URL;

const SearchResultsPage = () => {
    const [searchParams] = useSearchParams();
    const [results, setResults] = useState({ users: [], posts: [] });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const searchQuery = searchParams.get('q');
    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchResults = async () => {
            if (!searchQuery) {
                setLoading(false);
                return;
            }
            setLoading(true);
            setError(null);

            try {
                
                const res = await axios.get(`${API_URL}/api/posts/search?q=${searchQuery}`, {
                    headers: { 'x-auth-token': token }
                });
                setResults(res.data);
            } catch (err) {
                console.error(err);
                setError('Failed to fetch search results.');
            } finally {
                setLoading(false);
            }
        };

        fetchResults();
    }, [searchQuery, token]);

    if (loading) {
        return <div className="search-page-container">Loading search results...</div>;
    }

    if (error) {
        return <div className="search-page-container error-message">{error}</div>;
    }

    return (
        <div className="search-page-container">
            <h1 className="search-title">Search Results for "{searchQuery}"</h1>
            
            <div className="search-results-section">
                <h2>Users ({results.users.length})</h2>
                <div className="users-list">
                    {results.users.length > 0 ? (
                        results.users.map(profile => (
                            <Link to={`/profile/${profile.user._id}`} key={profile._id} className="user-result-card-link">
                                <div className="user-result-card">
                                    <img 
                                        src={profile.avatar}
                                        alt={profile.user.name} 
                                        className="user-card-avatar"
                                    />
                                    <span className="user-card-name">{profile.user.name}</span>
                                </div>
                            </Link>
                        ))
                    ) : (
                        <p>No users found.</p>
                    )}
                </div>
            </div>
            
        </div>
    );
};

export default SearchResultsPage;