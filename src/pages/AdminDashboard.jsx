import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Search, Eye, ShieldAlert, Trash2, LogOut, Landmark, User as UserIcon } from 'lucide-react';

const AdminDashboard = () => {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // --- 1. Security Check (Bina login ke koi page na dekh sakay) ---
  useEffect(() => {
    const auth = localStorage.getItem('isAdminAuthenticated');
    if (auth !== 'true') {
      navigate('/admin-login');
    } else {
      fetchAll();
    }
  }, [searchTerm]);  

  const fetchAll = async () => {
    try {
      // const res = await axios.get(`http://localhost:5000/api/admin/all-submissions?search=${searchTerm}`);
      const res = await axios.get(` https://chaintrace-backend1.vercel.app/api/admin/all-submissions?search=${searchTerm}`);
      setData(res.data);
    } catch (err) {
      console.error("Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  // --- 2. Logout Logic ---
  const handleLogout = () => {
    localStorage.removeItem('isAdminAuthenticated');
    navigate('/admin-login');
  };

  // --- 3. Delete Case Logic ---
  const deleteCase = async (caseId) => {
    if (window.confirm(`⚠️ WARNING: Are you sure you want to delete Case [${caseId}] and all its linked transactions? This cannot be undone.`)) {
      try {
        await axios.delete(`http://localhost:5000/api/admin/case/${caseId}`);
        fetchAll(); // Table refresh karne ke liye
      } catch (err) {
        alert("Error deleting case. Make sure backend is active.");
      }
    }
  };

  return (
    <div className="p-6 md:p-10 bg-gray-50 min-h-screen">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
        <div>
          <h1 className="text-4xl font-black text-gray-900 flex items-center gap-3 tracking-tighter">
            <ShieldAlert className="text-red-600" size={36} /> ADMIN PANEL
          </h1>
          <p className="text-gray-400 font-bold text-[10px] uppercase tracking-[0.3em] mt-1 ml-1">
            Transaction Investigation & Control
          </p>
        </div>

        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-80">
            <Search className="absolute left-4 top-3.5 text-gray-400" size={20} />
            <input 
              type="text" 
              placeholder="Search Bank, User or ID..." 
              className="w-full pl-12 pr-4 py-3.5 bg-white border-2 border-gray-100 rounded-2xl outline-none focus:border-red-500 shadow-sm transition-all font-medium"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button 
            onClick={handleLogout}
            className="bg-white p-3.5 rounded-2xl border-2 border-gray-100 text-gray-400 hover:text-red-600 hover:border-red-100 transition shadow-sm group"
            title="Logout"
          >
            <LogOut size={24} />
          </button>
        </div>
      </div>

      {/* Main Table Container */}
      <div className="bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-900 text-white">
                <th className="p-6 text-[10px] font-black uppercase tracking-widest">Case Reference</th>
                <th className="p-6 text-[10px] font-black uppercase tracking-widest">Account Holder</th>
                <th className="p-6 text-[10px] font-black uppercase tracking-widest">Financial Institution</th>
                <th className="p-6 text-[10px] font-black uppercase tracking-widest text-right">Amount (PKR)</th>
                <th className="p-6 text-[10px] font-black uppercase tracking-widest text-center">Identity</th>
                <th className="p-6 text-[10px] font-black uppercase tracking-widest text-center">Investigation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan="6" className="p-20 text-center text-gray-400 font-bold animate-pulse uppercase tracking-widest">
                    Loading Secure Records...
                  </td>
                </tr>
              ) : data.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-20 text-center text-gray-300 font-bold uppercase tracking-widest italic">
                    No matching records found in database
                  </td>
                </tr>
              ) : (
                data.map((row) => (
                  <tr key={row.id} className="hover:bg-red-50/30 transition-all group">
                    <td className="p-6">
                      <span className="font-mono font-black text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg text-sm tracking-tighter">
                        {row.case_id}
                      </span>
                    </td>
                    <td className="p-6">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-gray-100 rounded-full text-gray-500">
                           <UserIcon size={16} />
                        </div>
                        <span className="font-bold text-gray-800">{row.full_name}</span>
                      </div>
                    </td>
                    <td className="p-6">
                      <div className="flex items-center gap-2 text-gray-500 font-medium">
                        <Landmark size={14} className="text-gray-300" /> {row.bank_name}
                      </div>
                    </td>
                    <td className="p-6 text-right">
                      <span className="font-black text-green-600 text-lg">
                        {Number(row.amount).toLocaleString()}
                      </span>
                    </td>
                    <td className="p-6 text-center">
                      <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest shadow-sm ${
                        row.user_role === 'Originator' 
                        ? 'bg-orange-500 text-white' 
                        : 'bg-gray-800 text-white'
                      }`}>
                        {row.user_role}
                      </span>
                    </td>
                    <td className="p-6 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button 
                          onClick={() => navigate(`/chain/${row.case_id}`)}
                          className="flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-600 hover:text-white transition shadow-sm"
                        >
                          <Eye size={14} /> View
                        </button>
                        <button 
                          onClick={() => deleteCase(row.case_id)}
                          className="p-2.5 text-gray-300 hover:text-red-600 hover:bg-red-100 rounded-xl transition"
                          title="Delete Case"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer Info */}
      <div className="mt-8 flex justify-between items-center px-4">
        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
          Cloud Status: <span className="text-green-500 animate-pulse">● Connected (Aiven BLR)</span>
        </p>
        <p className="text-[10px] text-gray-300 font-medium">
          © 2025 ChainTrace Security Protocol
        </p>
      </div>
    </div>
  );
};

export default AdminDashboard;