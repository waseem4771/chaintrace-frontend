import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Lock, User, ShieldAlert } from 'lucide-react';

const AdminLogin = () => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');    

    try {
      // const res = await axios.post('http://localhost:5000/api/admin/login', credentials);
       const res = await axios.post('https://chaintrace-backend1.vercel.app/api/admin/login', credentials);
      if (res.data.success) {
        // Login session save karna (Simple way)
        localStorage.setItem('isAdminAuthenticated', 'true');
        navigate('/admin');
      }
    } catch (err) {
      setError("Invalid Username or Password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 bg-white p-10 rounded-[2.5rem] shadow-2xl border border-gray-100">
      <div className="text-center mb-8">
        <div className="bg-red-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
          <ShieldAlert className="text-red-600" size={32} />
        </div>
        <h2 className="text-3xl font-black text-gray-800 tracking-tighter">ADMIN ACCESS</h2>
        <p className="text-gray-400 text-[10px] font-bold uppercase tracking-[0.2em] mt-2">Authorized Personnel Only</p>
      </div>

      <form onSubmit={handleLogin} className="space-y-6">
        <div>
          <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 ml-1">Username</label>
          <div className="relative">
            <User className="absolute left-4 top-4 text-gray-300" size={20} />
            <input 
              type="text" 
              className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-gray-50 rounded-2xl focus:border-red-500 focus:bg-white outline-none transition-all font-bold"
              placeholder="Enter Username"
              onChange={(e) => setCredentials({...credentials, username: e.target.value})}
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 ml-1">Password</label>
          <div className="relative">
            <Lock className="absolute left-4 top-4 text-gray-300" size={20} />
            <input 
              type="password" 
              className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-gray-50 rounded-2xl focus:border-red-500 focus:bg-white outline-none transition-all font-bold"
              placeholder="••••••••"
              onChange={(e) => setCredentials({...credentials, password: e.target.value})}
              required
            />
          </div>
        </div>

        {error && <p className="text-red-500 text-xs font-bold text-center italic">{error}</p>}

        <button 
          type="submit" 
          disabled={loading}
          className={`w-full py-5 rounded-3xl font-black text-lg text-white tracking-widest uppercase transition-all shadow-xl ${loading ? 'bg-gray-400' : 'bg-red-600 hover:bg-red-700 active:scale-95'}`}
        >
          {loading ? "Verifying..." : "Secure Login"}
        </button>
      </form>
    </div>
  );
};

export default AdminLogin;