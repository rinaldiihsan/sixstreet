import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundAdmin = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-4xl font-bold mb-4 font-overpass">404 - Page Not Found</h1>
      <p className="text-lg font-overpass">Ups! The page you are looking for does not exist.</p>
      <Link to="/dashboard-admin" className="mt-6 text-blue-500 underline font-overpass">
        Go back to Dashboard Admin
      </Link>
    </div>
  );
};

export default NotFoundAdmin;
