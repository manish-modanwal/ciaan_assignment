import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaHeart, FaComment } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import './PostItem.css';

const API_URL = import.meta.env.VITE_API_URL;

const PostItem = ({ post: initialPost }) => {
    const [post, setPost] = useState(initialPost);
    const [commentText, setCommentText] = useState('');
    const [showComments, setShowComments] = useState(false);
    const [isFollowing, setIsFollowing] = useState(false); 
    const [myProfile, setMyProfile] = useState(null); 
    
    const token = localStorage.getItem('token');
    const myId = token ? JSON.parse(atob(token.split('.')[1])).user.id : null;

    useEffect(() => {
        const fetchMyProfile = async () => {
            if (myId) {
                try {
                    
                    const res = await axios.get(`${API_URL}/api/profile/me`, {
                        headers: { 'x-auth-token': token }
                    });
                    if (res.data?.profile) {
                        setMyProfile(res.data.profile);
                    }
                } catch (err) {
                    console.error('Failed to fetch my profile:', err);
                }
            }
        };
        fetchMyProfile();
    }, [myId, token]);

    useEffect(() => {
        if (
            myProfile?.following &&
            Array.isArray(myProfile.following) &&
            post?.user &&
            post.user._id
        ) {
            const isUserFollowing = myProfile.following.some((follow) => {
                const followUserId = follow?.user?._id;
                const postUserId = post.user._id;
                if (!followUserId || !postUserId) return false;
                return followUserId.toString() === postUserId.toString();
            });
            setIsFollowing(isUserFollowing);
        }
    }, [myProfile, post, myId]);

    if (!post || !post.user) {
        return null; 
    }

    const isLiked = (post.likes ?? []).some(like => like.user === myId);
    const isOwner = post.user._id === myId;

    const handleLike = async () => {
        try {
           
            await axios.put(`${API_URL}/api/posts/like/${post._id}`, {}, {
                headers: { 'x-auth-token': token }
            });
            setPost(prevPost => {
                const newLikes = isLiked
                    ? prevPost.likes.filter(like => like.user !== myId)
                    : [...(prevPost.likes || []), { user: myId }];
                return { ...prevPost, likes: newLikes };
            });
        } catch (err) {
            console.error('Failed to like post:', err);
        }
    };

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        if (!commentText.trim()) return;

        try {
         
            const res = await axios.post(
                `${API_URL}/api/posts/comment/${post._id}`,
                { text: commentText },
                {
                    headers: {
                        'x-auth-token': token
                    }
                }
            );
            setPost(prevPost => ({ ...prevPost, comments: res.data }));
            setCommentText('');
        } catch (err) {
            console.error('Failed to add comment:', err);
        }
    };
    
   
    const handleDeletePost = async () => {
        if (window.confirm('Are you sure you want to delete this post?')) {
            try {
                // Fix 4: API_URL use kiya
                await axios.delete(`${API_URL}/api/posts/${post._id}`, {
                    headers: { 'x-auth-token': token }
                });
                
                window.location.reload();
            } catch (err) {
                console.error('Failed to delete post:', err);
            }
        }
    };

   
    const handleDeleteComment = async (commentId) => {
        if (window.confirm('Are you sure you want to delete this comment?')) {
            try {
                
                const res = await axios.delete(
                    `${API_URL}/api/posts/comment/${post._id}/${commentId}`,
                    { headers: { 'x-auth-token': token } }
                );
                setPost(prevPost => ({ ...prevPost, comments: res.data }));
            } catch (err) {
                console.error('Failed to delete comment:', err);
            }
        }
    };
    
   
    const handleFollow = async () => {
        try {
            const endpoint = isFollowing ? 'unfollow' : 'follow';
           
            await axios.put(`${API_URL}/api/profile/${endpoint}/${post.user._id}`, {}, {
                headers: { 'x-auth-token': token }
            });
            
            window.location.reload();
        } catch (err) {
            console.error('Failed to follow/unfollow user:', err);
        }
    };

    return (
   <div className="post-card">
      <div className="post-header-top">
         <img 
            src={post.user?.avatar} 
            alt="User Avatar" 
            className="post-avatar" 
         />
         <div className="user-info">
            <Link to={`/profile/${post.user._id}`} className="post-username">
               {post.user.name}
            </Link>
            {!isOwner && (
               <button onClick={handleFollow} className="follow-btn">
                  {isFollowing ? 'Following' : 'Follow'}
               </button>
            )}
            <span className="post-timestamp">
               {new Date(post.createdAt).toLocaleDateString()}
            </span>
         </div>
         {isOwner && (
            <button onClick={handleDeletePost} className="delete-post-btn">
               Delete
            </button>
         )}
      </div>
      <div className="post-content">
         <p>{post.text}</p>
        
         {post.image && post.image.url && (
            <img 
               src={post.image.url.startsWith('http') ? post.image.url : `${API_URL}${post.image.url}`} 
               alt="Post" 
               className="post-image" 
            />
         )}
         {post.video && post.video.url && (
            <video 
               src={post.video.url.startsWith('http') ? post.video.url : `${API_URL}${post.video.url}`} 
               controls 
               className="post-video" 
            />
         )}
      </div>
      <div className="post-actions">
         <button 
            className={`like-button ${isLiked ? 'liked' : ''}`} 
            onClick={handleLike}
         >
            <FaHeart /> Like ({post.likes?.length || 0})
         </button>
         <button 
            className="comment-button" 
            onClick={() => setShowComments(!showComments)}
         >
            <FaComment /> Comment ({post.comments?.length || 0})
         </button>
      </div>
      {showComments && (
         <div className="comments-section">
            <div className="comments-list">
               {post.comments?.map((comment) => (
                  <div key={comment._id} className="comment-item">
                     <span className="comment-user">{comment.name}</span>
                     <span className="comment-text">{comment.text}</span>
                     {comment.user === myId && (
                        <button onClick={() => handleDeleteComment(comment._id)} className="delete-comment-btn">
                           Delete
                        </button>
                     )}
                  </div>
               ))}
            </div>
            <form onSubmit={handleCommentSubmit} className="comment-form">
               <input
                  type="text"
                  placeholder="Write a comment..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
               />
               <button type="submit">Post</button>
            </form>
         </div>
      )}
   </div>
);
};

export default PostItem;