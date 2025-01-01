// components/profile/UserDetails.jsx
import React from 'react';

const UserDetails = ({ userData, toggleEditUserForm }) => {
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="space-y-2">
      <li className="block text-md text-[#333333] font-overpass">
        Email Address:
        <br /> {userData.email}
      </li>
      <li className="block text-md text-[#333333] font-overpass">
        Full Name:
        <br /> {userData.fullName}
      </li>
      <li className="block text-md text-[#333333] font-overpass">
        No. Handphone:
        <br /> {userData.no_hp}
      </li>
      <li className="block text-md text-[#333333] font-overpass">
        Birthday:
        <br /> {formatDate(userData.birthday)}
      </li>
      <button className="bg-[#333] hover:bg-white font-garamond text-white hover:text-[#333] transition-colors w-full py-2 border border-[#333]" onClick={toggleEditUserForm}>
        Edit Profile
      </button>
    </div>
  );
};

export default UserDetails;
