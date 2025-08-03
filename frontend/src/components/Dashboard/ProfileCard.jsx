import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ProfileCard.css';

const API_URL = import.meta.env.VITE_API_URL;

const ProfileCard = () => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const token = localStorage.getItem('token');
               
                const res = await axios.get(`${API_URL}/api/profile/me`, { 
                    headers: {
                        'x-auth-token': token
                    }
                });
                
                setProfile(res.data.profile);
                setLoading(false);
            } catch (err) {
                console.error('Failed to fetch user profile', err);
                setLoading(false);
            }
        };
        fetchUserProfile();
    }, []);
    
    if (loading) {
        return <div className="profile-card-placeholder">Loading profile...</div>;
    }
    
    if (!profile || !profile.user) {
        return <div className="profile-card-placeholder">Could not load user profile.</div>;
    }
    
    return (
        <div className="profile-card">
            <div className="profile-header">
                <img 
                    src={profile.avatar} 
                    alt="Profile" 
                    className="profile-pic" 
                />
                <h7 className="profile-name">{profile.user.name}</h7>
            </div>
            <p className="profile-bio">{profile.bio || 'No bio provided.'}</p>
            <div className="profile-stats">
                <div className="stat-item">
                    <span className="stat-number">{profile.followers ? profile.followers.length : 0}</span>
                    <span className="stat-label">Followers</span>
                </div>
                <div className="stat-item">
                    <span className="stat-number">{profile.following ? profile.following.length : 0}</span>
                    <span className="stat-label">Following</span>
                </div>
            </div>
        </div>
    );
};

export default ProfileCard;