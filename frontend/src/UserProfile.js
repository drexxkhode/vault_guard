import React from 'react';
import './UserProfile.css';

const UserProfile = ({ username }) => {
  return (
    <div className="userprofile-container">
      <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="User" className="userprofile-avatar" />
      <h3>{username}</h3>
    </div>
  );
};

export default UserProfile;
