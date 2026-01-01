import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Upload, XCircle, CheckCircle, Link as LinkIcon, Image as ImageIcon } from 'lucide-react';

const JoinCase = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    caseId: '',
    fullName: '',
    bankName: '',
    accountDetails: '',
    amount: '',
    txDatetime: new Date().toISOString().slice(0, 16),
    senderInfo: '',
    receiverInfo: '',
    description: '',
    proofImage: '' 
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // --- OPTIMIZED IMAGE HANDLING (WITH COMPRESSION) ---
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const img = new Image();
        img.src = reader.result;
        img.onload = () => {
          // --- Canvas Compression Logic ---
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 800; // Resize to 800px width
          const scaleSize = MAX_WIDTH / img.width;
          canvas.width = MAX_WIDTH;
          canvas.height = img.height * scaleSize;

          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

          // Quality 0.6 (60%) for fast transfers
          const compressedBase64 = canvas.toDataURL('image/jpeg', 0.6);
          
          setFormData({ ...formData, proofImage: compressedBase64 });
          setImagePreview(compressedBase64);
        };
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setFormData({ ...formData, proofImage: '' });
    setImagePreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const mysqlDate = formData.txDatetime.replace('T', ' ') + ':00';
    const finalData = { ...formData, txDatetime: mysqlDate };

    try {  
      // const response = await axios.post('http://localhost:5000/api/cases/join', finalData);
         const response = await axios.post('https://chaintrace-backend1.vercel.app/api/cases/join', finalData);
      if (response.data.success) {
        setSubmitted(true);
      }
    } catch (err) {
      alert(err.response?.data?.error || "Error joining case. Check Case ID.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="max-w-md mx-auto mt-10 bg-blue-50 p-10 rounded-[2.5rem] border-2 border-blue-200 text-center shadow-2xl animate-in zoom-in duration-300">
        <div className="flex justify-center mb-4 text-blue-500">
          <CheckCircle size={64} />
        </div>
        <h2 className="text-3xl font-black text-blue-800 mb-2 font-mono uppercase tracking-tighter">Linked Successfully!</h2>
        <p className="text-gray-600 mb-8 font-medium">Your documentation has been added to the transaction chain.</p>
        <div className="flex flex-col gap-4">
            <button 
              onClick={() => navigate(`/chain/${formData.caseId}`)} 
              className="bg-blue-600 text-white py-4 rounded-2xl font-black uppercase tracking-widest shadow-lg hover:bg-blue-700 transition active:scale-95"
            >
              View Chain Trace
            </button>
            <button 
              onClick={() => navigate('/')} 
              className="text-blue-600 font-bold hover:underline"
            >
              Back to Home
            </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto bg-white p-8 md:p-12 rounded-[2.5rem] shadow-2xl border border-gray-100 mb-10">
      <div className="mb-10 border-b pb-6">
        <h2 className="text-4xl font-black text-gray-900 tracking-tight flex items-center gap-3 italic">
          JOIN DISPUTE <span className="text-green-600 flex items-center gap-1 not-italic"><LinkIcon size={32}/> CHAIN</span>
        </h2>
        <p className="text-gray-400 font-bold uppercase text-[10px] tracking-[0.2em] mt-2">Documentation Member (User B/C/D)</p>
      </div>
      
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* CASE ID SECTION (High Visibility) */}
        <div className="md:col-span-2 bg-yellow-50 p-6 rounded-3xl border-2 border-yellow-200 shadow-inner">
          <label className="block text-[10px] font-black text-yellow-700 uppercase mb-2 tracking-widest">Case Reference ID (Mandatory)</label>
          <input 
            type="text" 
            className="w-full p-4 bg-white border-2 border-yellow-300 rounded-2xl font-mono text-2xl uppercase tracking-[0.4em] outline-none focus:border-yellow-500 text-yellow-900 placeholder:text-yellow-100 shadow-sm" 
            placeholder="CT-XXXXXXX" 
            required
            onChange={(e) => setFormData({...formData, caseId: e.target.value.toUpperCase()})} 
          />
        </div>

        <div>
          <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 ml-1 tracking-widest">Full Name</label>
          <input type="text" className="w-full p-4 bg-gray-50 border-2 border-gray-50 rounded-2xl focus:border-green-500 focus:bg-white transition-all font-bold" required
            onChange={(e) => setFormData({...formData, fullName: e.target.value})} />
        </div>

        <div>
          <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 ml-1 tracking-widest">Bank Name</label>
          <input type="text" className="w-full p-4 bg-gray-50 border-2 border-gray-50 rounded-2xl focus:border-green-500 focus:bg-white transition-all font-bold" required
            onChange={(e) => setFormData({...formData, bankName: e.target.value})} />
        </div>

        <div>
          <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 ml-1 tracking-widest">Account / IBAN</label>
          <input type="text" className="w-full p-4 bg-gray-50 border-2 border-gray-50 rounded-2xl focus:border-green-500 focus:bg-white transition-all font-bold" required
            onChange={(e) => setFormData({...formData, accountDetails: e.target.value})} />
        </div>

        <div>
          <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 ml-1 tracking-widest">Amount</label>
          <input type="number" className="w-full p-4 bg-gray-50 border-2 border-gray-50 rounded-2xl focus:border-green-500 focus:bg-white transition-all font-bold text-green-600" required
            onChange={(e) => setFormData({...formData, amount: e.target.value})} />
        </div>

        <div>
          <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 ml-1 tracking-widest text-red-400 font-mono italic">Received From</label>
          <input type="text" className="w-full p-4 bg-gray-50 border-2 border-gray-50 rounded-2xl focus:border-green-500 focus:bg-white transition-all font-bold" placeholder="Sender Details" required
            onChange={(e) => setFormData({...formData, senderInfo: e.target.value})} />
        </div>

        <div>
          <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 ml-1 tracking-widest text-green-400 font-mono italic">Forwarded To</label>
          <input type="text" className="w-full p-4 bg-gray-50 border-2 border-gray-50 rounded-2xl focus:border-green-500 focus:bg-white transition-all font-bold" placeholder="Receiver Details" required
            onChange={(e) => setFormData({...formData, receiverInfo: e.target.value})} />
        </div>

        <div className="md:col-span-2">
          <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 ml-1 tracking-widest">Date & Time of Transaction</label>
          <input type="datetime-local" className="w-full p-4 bg-gray-50 border-2 border-gray-50 rounded-2xl focus:border-green-500 focus:bg-white transition-all font-bold" 
            value={formData.txDatetime} required
            onChange={(e) => setFormData({...formData, txDatetime: e.target.value})} />
        </div>

        {/* COMPRESSED IMAGE UPLOAD */}
        <div className="md:col-span-2">
          <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 ml-1 tracking-widest">Proof of Transfer (Receipt)</label>
          <div className={`relative border-2 border-dashed rounded-3xl p-6 transition-all flex flex-col items-center justify-center min-h-[140px] ${imagePreview ? 'border-green-400 bg-green-50' : 'border-gray-200 bg-gray-50 hover:border-green-400'}`}>
            {!imagePreview ? (
              <>
                <Upload className="text-gray-300 mb-2" size={32} />
                <p className="text-[10px] text-gray-400 font-black uppercase tracking-tighter">Click to upload (Auto-Compressed for speed)</p>
                <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleImageChange} />
              </>
            ) : (
              <div className="relative group">
                <img src={imagePreview} alt="Preview" className="h-32 w-full object-contain rounded-xl shadow-lg border-2 border-white bg-white" />
                <button type="button" onClick={removeImage} className="absolute -top-3 -right-3 text-red-500 bg-white rounded-full shadow-md hover:text-red-700 transition">
                  <XCircle size={28} />
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="md:col-span-2 text-center pt-4">
          <button 
            type="submit" 
            disabled={loading} 
            className={`w-full py-5 rounded-3xl font-black text-xl text-white tracking-[0.3em] uppercase transition-all shadow-xl shadow-green-100 ${loading ? 'bg-gray-400 cursor-wait' : 'bg-green-600 hover:bg-green-700 active:scale-95'}`}
          >
            {loading ? "LINKING TO CHAIN..." : "LINK TO CHAIN"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default JoinCase;