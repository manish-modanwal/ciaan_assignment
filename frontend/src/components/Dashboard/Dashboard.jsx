import React, { useState } from 'react';
import PostsFeed from '../PostsFeed/PostsFeed';
import ProfileCard from './ProfileCard';
import CreatePostCard from './CreatePostCard';
import './Dashboard.css';

const Dashboard = () => {
  const [refreshPosts, setRefreshPosts] = useState(false);

  const handlePostCreated = () => {
    setRefreshPosts(prev => !prev);
  };

  return (
    <div className="dashboard-container">
      <div className="left-column">
        <div className="left-column-inner">
          <ProfileCard />
          <CreatePostCard onPostCreated={handlePostCreated} />
        </div>
      </div>
      <div className="right-column">
        <PostsFeed refreshSignal={refreshPosts} />
      </div>
    </div>
  );
};

export default Dashboard;