import './Profile.css';
const Profile = ({ user }) => {
  return (
    <div className="userprofile-container">
      <img
        src="https://randomuser.me/api/portraits/men/32.jpg"
        alt="User"
        className="userprofile-avatar"
      />
      <h3>{user?.username}</h3>
    </div>
  );
};
export default Profile;