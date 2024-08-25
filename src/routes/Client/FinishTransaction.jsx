import React from 'react';
import { Link } from 'react-router-dom';

const FinishTransaction = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-4xl font-bold mb-4 font-overpass">Transaction Successful!</h1>
      <p className="text-lg font-overpass text-center">Thank you for your purchase! Your transaction has been completed successfully.</p>
      <Link to="/" className="mt-6 text-blue-500 underline font-overpass">
        Return to Home
      </Link>
    </div>
  );
};

export default FinishTransaction;
