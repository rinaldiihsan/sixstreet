import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Register = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [birthday, setBirthday] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Registration submitted:', firstName, lastName, email);
  };

  return (
    <>
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <form onSubmit={handleSubmit} className="bg-white p-8 shadow-md mx-3 md:max-w-md w-full">
          <h2 className="text-2xl font-bold mb-6 text-center font-garamond text-[#333333]">Sign - Up</h2>
          <div className="mb-4">
            <label className="block text-[#333333] text-lg font-bold mb-2 font-garamond" htmlFor="firstName">
              First Name
            </label>
            <input
              type="text"
              id="firstName"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="appearance-none border border-gray-300 w-full py-2 px-3 text-[#333333] leading-tight focus:outline-none focus:shadow-outline focus:border-[#333333] focus:ring-0"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-[#333333] text-lg font-bold mb-2 font-garamond" htmlFor="lastName">
              Last Name
            </label>
            <input
              type="text"
              id="lastName"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="appearance-none border border-gray-300 w-full py-2 px-3 text-[#333333] leading-tight focus:outline-none focus:shadow-outline focus:border-[#333333] focus:ring-0"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-[#333333] text-lg font-bold mb-2 font-garamond" htmlFor="birthday">
              Birthday
            </label>
            <input
              type="date"
              id="birthday"
              value={birthday}
              onChange={(e) => setBirthday(e.target.value)}
              className="appearance-none border border-gray-300 w-full py-2 px-3 text-[#333333] leading-tight focus:outline-none focus:shadow-outline focus:border-[#333333] focus:ring-0"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-[#333333] text-lg font-bold mb-2 font-garamond" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="appearance-none border border-gray-300 w-full py-2 px-3 text-[#333333] leading-tight focus:outline-none focus:shadow-outline focus:border-[#333333] focus:ring-0"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-[#333333] text-lg font-bold mb-2 font-garamond" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className=" appearance-none border border-gray-300 w-full py-2 px-3 text-[#333333] leading-tight focus:outline-none focus:shadow-outline focus:border-[#333333] focus:ring-0"
              required
            />
          </div>
          <div className="flex items-center justify-center">
            <button type="submit" className="bg-[#333333] hover:bg-[#ffffff] text-white hover:text-[#333333] font-bold py-2 px-8 focus:outline-none focus:shadow-outline font-garamond w-full transition-colors duration-300 focus:ring-0">
              Sign Up
            </button>
          </div>
          {/* Already Have Account? */}
          <div className="flex items-center justify-center mt-4 gap-x-2">
            <p className="text-[#333333] text-lg font-garamond">Already have an account?</p>
            <Link to="/login" className="text-[#333333] text-lg font-garamond font-bold hover:underline focus:outline-none focus:ring-0">
              Sign In
            </Link>
          </div>
        </form>
      </div>
    </>
  );
};

export default Register;
