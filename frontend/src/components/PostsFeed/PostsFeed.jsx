import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PostItem from './PostItem';
import './PostsFeed.css';

const API_URL = import.meta.env.VITE_API_URL;

const PostsFeed = ({ refreshSignal }) => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchAllPosts = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setLoading(false);
                return;
            }

           
            const res = await axios.get(`${API_URL}/api/posts`, {
                headers: {
                    'x-auth-token': token
                }
            });

            setPosts(res.data);
            setLoading(false);
        } catch (error) {
            console.error('Failed to fetch posts:', error.response ? error.response.data : error.message);
            setLoading(false);
        }
    };

    
    useEffect(() => {
        fetchAllPosts();
    }, [refreshSignal]);

    return (
        <div className="posts-feed-container">
            <h1>Posts Feed</h1>
            {loading ? (
                <p>Loading posts...</p>
            ) : (
                <div className="posts-list">
                    {posts.length > 0 ? (
                        posts.map(post => (
                            <PostItem key={post._id} post={post} />
                        ))
                    ) : (
                        <p>No posts found. Be the first to create one!</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default PostsFeed;