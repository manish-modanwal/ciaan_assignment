import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaEdit } from 'react-icons/fa';
import './ProfilePage.css';


const API_URL = import.meta.env.VITE_API_URL;

const ProfilePage = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        bio: '',
    });

    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
               
                const res = await axios.get(`${API_URL}/api/profile/me`, {
                    headers: { 'x-auth-token': token },
                });
                setUser(res.data);
                setFormData({ name: res.data.name, bio: res.data.bio || '' });
                setLoading(false);
            } catch (err) {
                console.error('Failed to fetch profile:', err);
                setLoading(false);
            }
        };
        fetchUserProfile();
    }, [token]);

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            
            const res = await axios.put(`${API_URL}/api/profile/me`, formData, {
                headers: { 'x-auth-token': token },
            });
            setUser(res.data);
            setIsEditing(false);
            alert('Profile updated successfully!');
        } catch (err) {
            console.error('Failed to update profile:', err);
            alert('Failed to update profile.');
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    if (loading) {
        return <div>Loading profile...</div>;
    }

    if (!user) {
        return <div>Profile not found.</div>;
    }

    return (
        <div className="profile-container">
            <div className="profile-card">
                <div className="profile-header">
                    <img src={user.avatar} alt="User Avatar" className="profile-avatar" />
                    {!isEditing && (
                        <button onClick={handleEdit} className="edit-button">
                            <FaEdit />
                        </button>
                    )}
                </div>
                
                {isEditing ? (
                    <form onSubmit={handleSave} className="profile-edit-form">
                        <div className="form-group">
                            <label>Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="form-group">
                            <label>Bio</label>
                            <textarea
                                name="bio"
                                value={formData.bio}
                                onChange={handleChange}
                            />
                        </div>
                        <button type="submit" className="save-button">Save</button>
                    </form>
                ) : (
                    <div className="profile-details">
                        <h2>{user.name}</h2>
                        <p className="profile-email">{user.email}</p>
                        <p className="profile-bio">{user.bio || 'Add a bio to your profile.'}</p>
                        
                        <div className="profile-stats">
                            <div className="stat-item">
                                <span className="stat-number">{user.followers.length}</span>
                                <span className="stat-label">Followers</span>
                            </div>
                            <div className="stat-item">
                                <span className="stat-number">{user.following.length}</span>
                                <span className="stat-label">Following</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProfilePage;