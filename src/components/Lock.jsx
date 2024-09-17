import React, { useState } from 'react';
import { LockIcon } from 'lucide-react';

const Lock = () => {
  const [email, setEmail] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [sendStatus, setSendStatus] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSending(true);
    setSendStatus('');

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));

      setSendStatus('success');
    } catch (error) {
      setSendStatus('error');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 flex justify-center">
          <img src="/logo_s.svg" alt="Logo" className="w-24 h-24" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex">
            <input type="email" name="email" id="email" className="flex-grow px-3 border border-[#333333] rounded-l-md" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required disabled={isSending} />
            <button type="submit" className={`inline-flex items-center p-4 border border-transparent text-sm font-medium rounded-r-md text-white font-overpass ${isSending ? 'bg-gray-400' : 'bg-[#333333]'}`} disabled={isSending}>
              Send
            </button>
          </div>
        </form>

        {/* Status pengiriman */}
        {isSending && <p className="mt-2 text-sm text-gray-600">Mengirim email...</p>}
        {sendStatus === 'success' && <p className="mt-2 text-sm text-green-600">Email berhasil dikirim!</p>}
        {sendStatus === 'error' && <p className="mt-2 text-sm text-red-600">Gagal mengirim email. Silakan coba lagi.</p>}

        {/* Link ke halaman password */}
        <div className="mt-9 text-center">
          <a href="/password" className=" font-overpass">
            <LockIcon size={16} className="inline-block mr-1" /> Password
          </a>
        </div>
      </div>
    </div>
  );
};

export default Lock;
