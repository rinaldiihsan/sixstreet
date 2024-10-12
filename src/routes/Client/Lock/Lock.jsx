import React, { useState } from 'react';
import { LockIcon } from 'lucide-react';
import { toast } from 'react-toastify';
import axios from 'axios';

const Lock = ({ setIsUnlocked }) => {
  const [email, setEmail] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState('');
  const [isCheckingPassword, setIsCheckingPassword] = useState(false);
  const BackendURL = import.meta.env.VITE_BACKEND_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSending(true);

    try {
      const response = await axios.post(`${BackendURL}/sendEmail`, { email });

      if (response.status === 200) {
        toast.success('Email berhasil dikirim! Silakan periksa inbox Anda untuk password sementara.');
        setShowPassword(true);
      } else {
        toast.error('Gagal mengirim email: ' + response.data.message);
      }
    } catch (error) {
      toast.error('Gagal mengirim email: ' + (error.response?.data?.message || error.message));
    } finally {
      setIsSending(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setIsCheckingPassword(true);

    try {
      const response = await axios.post(`${BackendURL}/cek_password`, { password });

      if (response.status === 200) {
        setIsUnlocked(true);
        toast.success('Password benar. Halaman terbuka!');
      } else {
        toast.error('Password salah.');
      }
    } catch (error) {
      if (error.response?.status === 404) {
        toast.error('Password tidak ditemukan.');
      } else {
        toast.error('Gagal memeriksa password: ' + (error.response?.data?.message || error.message));
      }
    } finally {
      setIsCheckingPassword(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 flex justify-center">
          <img src="/logo_s.svg" alt="Logo" className="w-24 h-24" />
        </div>

        {!showPassword ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex">
              <input
                type="email"
                name="email"
                id="email"
                className="flex-grow px-3 py-2 border border-[#333333] rounded-l-md"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isSending}
              />
              <button type="submit" className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-r-md text-white font-overpass ${isSending ? 'bg-gray-400' : 'bg-[#333333]'}`} disabled={isSending}>
                {isSending ? 'Mengirim...' : 'Kirim'}
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div className="flex">
              <input
                type="password"
                name="password"
                id="password"
                className="flex-grow px-3 py-2 border border-[#333333] rounded-l-md"
                placeholder="Masukkan password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isCheckingPassword}
              />
              <button
                type="submit"
                className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-r-md text-white font-overpass ${isCheckingPassword ? 'bg-gray-400' : 'bg-[#333333]'}`}
                disabled={isCheckingPassword}
              >
                {isCheckingPassword ? 'Memeriksa...' : 'Buka'}
              </button>
            </div>
            <div className="mt-4 text-center">
              <button onClick={() => setShowPassword(false)} className="font-overpass text-[#333333] hover:underline focus:outline-none">
                Kembali ke Email
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Lock;
