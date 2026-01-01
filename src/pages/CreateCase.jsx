import React, { useState } from 'react';
import axios from 'axios';
import { Upload, Image as ImageIcon, XCircle, CheckCircle } from 'lucide-react';

const CreateCase = () => {
  const [formData, setFormData] = useState({
    originatorName: '',
    bankName: '',
    accountDetails: '',
    amount: '',
    txDatetime: new Date().toISOString().slice(0, 16), 
    description: '',
    proofImage: '' 
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [caseId, setCaseId] = useState('');
  const [loading, setLoading] = useState(false);

  // --- OPTIMIZED IMAGE HANDLING (WITH COMPRESSION) ---
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const img = new Image();
        img.src = reader.result;
        img.onload = () => {
          // --- Compression Logic ---
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 800; // Image width 800px se bari nahi hogi
          const scaleSize = MAX_WIDTH / img.width;
          canvas.width = MAX_WIDTH;
          canvas.height = img.height * scaleSize;

          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

          // Quality ko 0.6 (60%) rakha hai taake size bohat chota ho jaye
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

    const mysqlFormattedDate = formData.txDatetime.replace('T', ' ') + ':00';
    const finalData = { ...formData, txDatetime: mysqlFormattedDate };

    try {  
      // const response = await axios.post('http://localhost:5000/api/cases/create', finalData);
      const response = await axios.post('https://chaintrace-backend1.vercel.app/api/cases/create', finalData);
      setCaseId(response.data.caseId);
    } catch (err) {
      console.error(err);
      alert("Error creating case. Check if Backend is running.");
    } finally {
      setLoading(false);
    }
  };

  if (caseId) {
    return (
      <div className="max-w-md mx-auto mt-10 bg-green-50 p-8 rounded-3xl border-2 border-green-200 text-center shadow-2xl animate-in fade-in zoom-in duration-300">
        <div className="flex justify-center mb-4 text-green-500">
          <CheckCircle size={64} />
        </div>
        <h2 className="text-3xl font-black text-green-700 mb-2">Case Activated!</h2>
        <p className="text-gray-600 mb-6 font-medium">Share this ID with the next receiver in the chain:</p>
        <div className="text-4xl font-mono font-black tracking-[0.2em] bg-white p-6 rounded-2xl border-2 border-dashed border-green-400 shadow-inner text-green-800">
          {caseId}
        </div>
        <p className="mt-6 text-xs text-gray-400 uppercase font-bold tracking-widest text-center">Documentation Saved Securely</p>
        <button onClick={() => window.location.href='/'} className="mt-8 w-full bg-green-600 text-white py-4 rounded-2xl font-bold hover:bg-green-700 transition shadow-lg">
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto bg-white p-8 rounded-[2.5rem] shadow-2xl border border-gray-100 mb-10">
      <div className="mb-8">
        <h2 className="text-4xl font-black text-gray-900 tracking-tight">New Dispute <span className="text-blue-600">(User A)</span></h2>
        <p className="text-gray-400 font-bold uppercase text-xs tracking-widest mt-2 font-mono">Step 1: Originator Documentation</p>
      </div>
      
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-xs font-black text-gray-400 uppercase mb-2 ml-1 tracking-widest">Full Name</label>
          <input type="text" className="w-full p-4 bg-gray-50 border-2 border-gray-50 rounded-2xl focus:border-blue-500 focus:bg-white outline-none transition-all font-bold" 
            placeholder="Account Holder Name" required
            onChange={(e) => setFormData({...formData, originatorName: e.target.value})} />
        </div>

        <div>
          <label className="block text-xs font-black text-gray-400 uppercase mb-2 ml-1 tracking-widest">Bank Name</label>
          <input type="text" className="w-full p-4 bg-gray-50 border-2 border-gray-50 rounded-2xl focus:border-blue-500 focus:bg-white outline-none transition-all font-bold" 
            placeholder="e.g. HBL, Meezan" required
            onChange={(e) => setFormData({...formData, bankName: e.target.value})} />
        </div>

        <div>
          <label className="block text-xs font-black text-gray-400 uppercase mb-2 ml-1 tracking-widest">Account No / IBAN</label>
          <input type="text" className="w-full p-4 bg-gray-50 border-2 border-gray-50 rounded-2xl focus:border-blue-500 focus:bg-white outline-none transition-all font-bold" 
            placeholder="Enter Details" required
            onChange={(e) => setFormData({...formData, accountDetails: e.target.value})} />
        </div>

        <div>
          <label className="block text-xs font-black text-gray-400 uppercase mb-2 ml-1 tracking-widest">Amount (PKR)</label>
          <input type="number" className="w-full p-4 bg-gray-50 border-2 border-gray-50 rounded-2xl focus:border-blue-500 focus:bg-white outline-none transition-all font-bold text-blue-600" 
            placeholder="0.00" required
            onChange={(e) => setFormData({...formData, amount: e.target.value})} />
        </div>

        <div className="md:col-span-2">
          <label className="block text-xs font-black text-gray-400 uppercase mb-2 ml-1 tracking-widest">Transaction Date & Time</label>
          <input type="datetime-local" className="w-full p-4 bg-gray-50 border-2 border-gray-50 rounded-2xl focus:border-blue-500 focus:bg-white outline-none transition-all font-bold" 
            value={formData.txDatetime} required
            onChange={(e) => setFormData({...formData, txDatetime: e.target.value})} />
        </div>

        {/* IMAGE UPLOAD SECTION WITH PREVIEW */}
        <div className="md:col-span-2">
          <label className="block text-xs font-black text-gray-400 uppercase mb-2 ml-1 tracking-widest">Transaction Proof (Receipt Screenshot)</label>
          <div className={`relative border-2 border-dashed rounded-3xl p-6 transition-all flex flex-col items-center justify-center min-h-[150px] ${imagePreview ? 'border-green-400 bg-green-50' : 'border-gray-200 bg-gray-50 hover:border-blue-400'}`}>
            {!imagePreview ? (
              <>
                <Upload className="text-gray-300 mb-2" size={32} />
                <p className="text-sm text-gray-400 font-bold tracking-tight text-center px-4">Click to upload screenshot (Auto-compressed for speed)</p>
                <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleImageChange} />
              </>
            ) : (
              <div className="relative group">
                <img src={imagePreview} alt="Preview" className="h-32 w-full object-contain rounded-xl shadow-lg border-2 border-white" />
                <button type="button" onClick={removeImage} className="absolute -top-3 -right-3 text-red-500 bg-white rounded-full shadow-md hover:text-red-700 transition">
                  <XCircle size={28} />
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="md:col-span-2">
          <label className="block text-xs font-black text-gray-400 uppercase mb-2 ml-1 tracking-widest">Issue Description</label>
          <textarea className="w-full p-4 bg-gray-50 border-2 border-gray-50 rounded-2xl focus:border-blue-500 focus:bg-white outline-none transition-all font-medium" 
            rows="3" placeholder="Briefly explain the issue..."
            onChange={(e) => setFormData({...formData, description: e.target.value})}></textarea>
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className={`md:col-span-2 py-5 rounded-3xl font-black text-xl text-white tracking-widest uppercase transition-all shadow-xl shadow-blue-100 ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 active:scale-95'}`}
        >
          {loading ? "Processing Securely..." : "Generate Case & Get ID"}
        </button>
      </form>
    </div>
  );
};

export default CreateCase;