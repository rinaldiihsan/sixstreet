import React from 'react';

const EditUserForm = ({ formUser, handleChangeUser, toggleEditUserForm, handleEditUser }) => {
  return (
    <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center bg-gray-800 bg-opacity-50 z-50">
      <div className="bg-white p-8 shadow-md md:max-w-md w-full space-y-4">
        <h2 className="text-2xl font-bold mb-6 text-center font-garamond text-[#333333]">Edit Profile</h2>
        <form onSubmit={handleEditUser} className="space-y-4">
          <div className="flex flex-col">
            <label htmlFor="email" className="font-overpass font-semibold">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formUser.email}
              onChange={handleChangeUser}
              className="border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#333333] focus:border-transparent"
              required
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="username" className="font-overpass font-semibold">
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formUser.username}
              onChange={handleChangeUser}
              className="border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#333333] focus:border-transparent"
              required
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="no_hp" className="font-overpass font-semibold">
              No. Handphone
            </label>
            <input type="text" id="no_hp" name="no_hp" value={formUser.no_hp} onChange={handleChangeUser} className="border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#333333] focus:border-transparent" required />
          </div>
          <div className="flex flex-col">
            <label htmlFor="birthday" className="font-overpass font-semibold">
              Birthday
            </label>
            <input
              type="date"
              id="birthday"
              name="birthday"
              value={formUser.birthday}
              onChange={handleChangeUser}
              className="border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#333333] focus:border-transparent"
              required
            />
          </div>
          <div className="flex justify-end">
            <button type="button" onClick={toggleEditUserForm} className="bg-white text-[#333] transition-colors py-2 px-4 font-garamond font-bold mr-2">
              Cancel
            </button>
            <button type="submit" className="bg-[#333] hover:bg-white text-white hover:text-[#333] transition-colors py-2 px-4 font-garamond font-bold">
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditUserForm;
