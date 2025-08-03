import React, { useState } from 'react';
import axios from 'axios';
import './CreatePostCard.css';


const API_URL = import.meta.env.VITE_API_URL;

const CreatePostCard = ({ onPostCreated }) => {
    const [text, setText] = useState('');
    const [image, setImage] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const formData = new FormData();
        formData.append('text', text);
        if (image) {
            formData.append('image', image);
        }

        try {
            const token = localStorage.getItem('token');
            const res = await axios.post(`${API_URL}/api/posts`, formData, { 
                headers: {
                    'x-auth-token': token,
                    'Content-Type': 'multipart/form-data',
                }
            });
            console.log('Post created:', res.data);
            setText('');
            setImage(null);
            onPostCreated();
        } catch (err) {
            console.error('Failed to create post:', err.response ? err.response.data : err.message);
        }
    };

    const handleImageChange = (e) => {
        setImage(e.target.files[0]);
    };

    return (
        <div className="create-post-card">
            <h3>Create a new Post</h3>
            <form onSubmit={handleSubmit} className="post-form">
                <textarea
                    placeholder="What's on your mind?"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    required
                />
                <div className="form-actions">
                    <label className="file-upload-label">
                        {image ? image.name : 'Upload Image'}
                        <input type="file" onChange={handleImageChange} accept="image/*" />
                    </label>
                    <button type="submit">Post</button>
                </div>
            </form>
        </div>
    );
};

export default CreatePostCard;