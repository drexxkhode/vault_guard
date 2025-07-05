import React from 'react';
import './UserProfile.css';

const UserProfile = () => {
  return (
    <div className="userprofile-container">
      <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="User" className="userprofile-avatar" />
      <h3>PHILIP ESSIEN</h3>
    </div>
  );
};

export default UserProfile;
