

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import PostItem from '../PostsFeed/PostItem';
import './ProfilePage.css';


const API_URL = import.meta.env.VITE_API_URL;

const ProfilePage = () => {
    const { id } = useParams();
    
    const [profile, setProfile] = useState(null);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({ name: '', bio: '' });
    const [profilePicture, setProfilePicture] = useState(null);
    const [error, setError] = useState(null);

    const token = localStorage.getItem('token');
    const myId = token ? JSON.parse(atob(token.split('.')[1])).user.id : null;

    useEffect(() => {
        const fetchProfile = async () => {
            setLoading(true);
            setError(null);
            
            if (!id) {
                setLoading(false);
                return;
            }

            try {
               
                const res = await axios.get(`${API_URL}/api/profile/${id}`, {
                    headers: { 'x-auth-token': token }
                });
                setProfile(res.data.profile);
                setPosts(res.data.posts);
                setFormData({
                    name: res.data.profile.user.name, 
                    bio: res.data.profile.bio || ''
                });
            } catch (err) {
                console.error(err);
                setError('Profile not found or an error occurred.');
                setProfile(null); 
            } finally {
                setLoading(false);
            }
        };
        
        fetchProfile();
    }, [id, token]); 

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });
    
    const onFileChange = e => {
        setProfilePicture(e.target.files[0]);
    };

    const onSubmit = async e => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        
        try {
            const formDataToSubmit = new FormData();
            formDataToSubmit.append('name', formData.name);
            formDataToSubmit.append('bio', formData.bio);
            if (profilePicture) {
                formDataToSubmit.append('profilePicture', profilePicture);
            }
            
           
            const res = await axios.put(`${API_URL}/api/profile/me`, formDataToSubmit, {
                headers: { 'x-auth-token': token }
            });
            
            setProfile(res.data);
            setFormData({
                name: res.data.user.name,
                bio: res.data.bio || ''
            });
            
            setProfilePicture(null); 
            setIsEditing(false);

        } catch (err) {
            console.error(err);
            setError('Profile update failed.');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="loading">Loading...</div>;
    }

    if (error) {
        return <div className="error">{error}</div>;
    }

    if (!profile) {
        return <div className="error">Profile not found.</div>;
    }
    
    if (isEditing) {
        return (
            <div className="edit-profile-container">
                <form onSubmit={onSubmit} className="edit-profile-form">
                    <h2>Edit Your Profile</h2>
                    {error && <p className="error-message">{error}</p>}
                    
                    <div className="form-group">
                        <label>Name</label>
                        <input type="text" name="name" value={formData.name} onChange={onChange} required/>
                    </div>

                    <div className="form-group">
                        <label>Bio</label>
                        <textarea name="bio" value={formData.bio} onChange={onChange}></textarea>
                    </div>

                    <div className="form-group">
                        <label>Profile Picture</label>
                        <input type="file" accept="image/*" onChange={onFileChange}/>
                    </div>
                    
                    <div className="button-group">
                        <button type="submit" disabled={loading}>{loading ? 'Saving...' : 'Save Changes'}</button>
                        <button type="button" className="cancel-btn" onClick={() => setIsEditing(false)}>Cancel</button>
                    </div>
                </form>
            </div>
        );
    }

    return (
        <div className="profile-page-container">
            <div className="profile-header">
                <img src={profile.avatar} alt="User Avatar" className="profile-avatar-lg" />
                <h1 className="profile-name">{profile.user.name}</h1>
                <p className="profile-bio">{profile.bio || 'No bio available.'}</p>
                {myId === id && (
                    <button onClick={() => setIsEditing(true)} className="edit-profile-btn">
                        Edit Profile
                    </button>
                )}
            </div>
            <div className="profile-stats">
                <div className="stat-item">
                    <span className="stat-number">{profile.followers.length}</span>
                    <span className="stat-label">Followers</span>
                </div>
                <div className="stat-item">
                    <span className="stat-number">{profile.following.length}</span>
                    <span className="stat-label">Following</span>
                </div>
            </div>
            
            <div className="profile-posts">
                {posts.length > 0 ? (
                    posts.map(post => <PostItem key={post._id} post={post} />)
                ) : (
                    <p className="no-posts-message">{profile.user.name} has not made any posts yet.</p>
                )}
            </div>
        </div>
    );
};

export default ProfilePage;