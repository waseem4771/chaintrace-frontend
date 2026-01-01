// import React, { useEffect, useState } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import { ArrowDown, Banknote, Calendar, User, ShieldCheck } from 'lucide-react';

// const ChainView = () => {
//   const { caseId } = useParams();
//   const navigate = useNavigate();
//   const [chain, setChain] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchChain = async () => {
//       try {
//         const res = await axios.get(`http://localhost:5000/api/cases/flow/${caseId}`);
//         setChain(res.data);
//       } catch (err) {
//         console.error("Fetch Error:", err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchChain();
//   }, [caseId]);

//   if (loading) return <div className="text-center mt-20 text-2xl animate-pulse">Scanning Chain Trace...</div>;

//   return (
//     <div className="max-w-4xl mx-auto py-10">
//       <div className="bg-white p-8 rounded-3xl shadow-md border mb-8 flex flex-col md:flex-row justify-between items-center gap-4">
//         <div>
//           <h2 className="text-3xl font-black text-gray-800 flex items-center gap-2">
//             <ShieldCheck className="text-blue-600" /> Evidence Report
//           </h2>
//           <p className="text-blue-600 font-mono font-bold text-xl mt-1 tracking-widest">{caseId}</p>
//         </div>
//         <div className="flex gap-2">
//             <button onClick={() => window.print()} className="bg-black text-white px-4 py-2 rounded-lg font-bold text-sm">Print Report</button>
//             <button onClick={() => navigate('/')} className="bg-gray-100 px-4 py-2 rounded-lg font-bold text-sm">Back</button>
//         </div>
//       </div>

//       <div className="flex flex-col items-center">
//         {chain.length === 0 ? (
//           <div className="bg-red-50 p-10 rounded-3xl text-center">
//               <p className="text-red-500 font-bold text-xl">Invalid Case ID or No Data Found.</p>
//           </div>
//         ) : (
//           chain.map((item, index) => (
//             <React.Fragment key={item.id}>
//               <div className="w-full bg-white p-6 rounded-2xl shadow-xl border-l-[12px] border-blue-600 flex justify-between items-center hover:bg-blue-50 transition-all cursor-default">
//                 <div className="flex items-start gap-4">
//                   <div className={`p-3 rounded-full ${item.user_role === 'Originator' ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600'}`}>
//                     <User size={28} />
//                   </div>
//                   <div>
//                     <h3 className="text-xl font-bold text-gray-900">{item.full_name}</h3>
//                     <p className="text-xs font-bold text-blue-600 uppercase tracking-widest">{item.bank_name}</p>
//                     <p className="text-xs text-gray-400 mt-1">Acc: {item.account_details}</p>
//                   </div>
//                 </div>

//                 <div className="text-right">
//                   <div className="text-green-600 font-black text-2xl flex items-center gap-1 justify-end">
//                     <Banknote size={20} /> {Number(item.amount).toLocaleString()}
//                   </div>
//                   <div className="text-gray-400 text-[10px] mt-1 flex items-center gap-1 justify-end uppercase font-bold">
//                     <Calendar size={10} /> {new Date(item.tx_datetime).toLocaleString()}
//                   </div>
//                   <div className={`mt-2 inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${item.user_role === 'Originator' ? 'bg-orange-500 text-white' : 'bg-gray-800 text-white'}`}>
//                     {item.user_role}
//                   </div>
//                 </div>
//               </div>
//               {index !== chain.length - 1 && <div className="h-12 w-1 bg-gray-200 my-2 shadow-sm rounded-full"></div>}
//             </React.Fragment>
//           ))
//         )}
//       </div>
//     </div>
//   );
// };

// export default ChainView;
















import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  ArrowDown, Banknote, Calendar, User, ShieldCheck, 
  Download, ArrowLeft, Info, Landmark, History 
} from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const ChainView = () => {
  const { caseId } = useParams();
  const navigate = useNavigate();
  const [chain, setChain] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const reportRef = useRef();

  useEffect(() => {   
    const fetchChain = async () => {
      try {
        // const res = await axios.get(`http://localhost:5000/api/cases/flow/${caseId}`);
          const res = await axios.get(`https://chaintrace-backend1.vercel.app/api/cases/flow/${caseId}`);
        setChain(res.data);
      } catch (err) {
        console.error("Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchChain();
  }, [caseId]);

  // --- PDF Export Logic ---
  const handleDownloadPDF = async () => {
    setIsExporting(true);
    const element = reportRef.current;
    const canvas = await html2canvas(element, { scale: 2 });
    const imgData = canvas.toDataURL('image/png');
    
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(`ChainTrace_Report_${caseId}.pdf`);
    setIsExporting(false);
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center mt-40">
      <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      <p className="mt-4 text-gray-600 font-bold animate-pulse">Scanning Transaction Chain...</p>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto py-10 px-4">
      {/* Header / Actions */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border mb-8 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/')} className="p-2 hover:bg-gray-100 rounded-full transition">
            <ArrowLeft size={24} className="text-gray-600" />
          </button>
          <div>
            <h2 className="text-2xl font-black text-gray-800 flex items-center gap-2">
              <ShieldCheck className="text-blue-600" /> Evidence Report
            </h2>
            <p className="text-blue-600 font-mono font-bold text-lg tracking-widest uppercase">{caseId}</p>
          </div>
        </div>
        <div className="flex gap-3">
            <button 
              onClick={handleDownloadPDF} 
              disabled={isExporting}
              className="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-blue-700 shadow-lg transition-all active:scale-95 disabled:bg-blue-300"
            >
              <Download size={18} /> {isExporting ? "Generating..." : "Download PDF Report"}
            </button>
        </div>
      </div>

      {/* Report Area (Isi ka PDF banega) */}
      <div ref={reportRef} className="bg-gray-50 p-6 md:p-10 rounded-3xl border border-gray-200 shadow-inner">
        
        {/* Report Official Branding (Visible only in PDF/View) */}
        <div className="mb-10 border-b pb-6 flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-black text-blue-900 tracking-tighter italic">CHAINTRACE</h1>
            <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">Transaction Linkage Documentation</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-gray-400 font-bold uppercase">Status</p>
            <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-[10px] font-black uppercase ring-1 ring-red-200">
              Funds Disputed / Frozen
            </span>
          </div>
        </div>

        {chain.length === 0 ? (
          <div className="bg-white p-20 rounded-3xl text-center border-2 border-dashed border-gray-200">
              <p className="text-gray-400 font-bold text-xl">Invalid Case ID or No Data Found.</p>
          </div>
        ) : (
          <div className="relative flex flex-col items-center">
            {/* The Vertical Line */}
            <div className="absolute left-8 md:left-1/2 h-full w-1 bg-blue-100 -translate-x-1/2"></div>

            {chain.map((item, index) => (
              <div key={item.id} className="relative w-full mb-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-8 group">
                
                {/* Timeline Dot */}
                <div className="absolute left-8 md:left-1/2 w-4 h-4 bg-blue-600 rounded-full -translate-x-1/2 z-10 ring-4 ring-white shadow-md"></div>

                {/* Left Side (Meta Info) */}
                <div className={`w-full md:w-[45%] flex flex-col ${index % 2 === 0 ? 'md:items-end md:text-right' : 'md:items-start md:text-left order-last'}`}>
                   <div className="flex items-center gap-2 text-gray-400 font-bold text-[10px] uppercase mb-1">
                      <Calendar size={12} /> {new Date(item.tx_datetime).toLocaleString()}
                   </div>
                   <div className={`inline-block px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider ${item.user_role === 'Originator' ? 'bg-orange-500 text-white' : 'bg-gray-800 text-white'}`}>
                      {item.user_role}
                   </div>
                </div>

                {/* Right Side (Card Details) */}
                <div className={`w-full md:w-[45%] bg-white p-6 rounded-2xl shadow-xl border border-gray-100 group-hover:border-blue-400 transition-all ${index % 2 === 0 ? '' : ''}`}>
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className="bg-blue-50 p-2 rounded-lg text-blue-600">
                        <User size={20} />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 leading-tight">{item.full_name}</h3>
                        <p className="text-[10px] font-bold text-blue-500 flex items-center gap-1">
                          <Landmark size={10} /> {item.bank_name}
                        </p>
                      </div>
                    </div>
                    <div className="text-green-600 font-black text-xl">
                      Rs. {Number(item.amount).toLocaleString()}
                    </div>
                  </div>

                  {/* Account Details */}
                  <div className="bg-gray-50 p-2.5 rounded-xl mb-4 text-[11px] font-mono text-gray-500 border border-gray-100 flex items-center gap-2">
                    <span className="font-bold text-gray-400 uppercase text-[9px]">Acc:</span> {item.account_details}
                  </div>

                  {/* Linking Info (Sender/Receiver) */}
                  <div className="grid grid-cols-2 gap-3 pt-4 border-t border-gray-100">
                    <div>
                      <p className="text-[9px] font-black text-red-400 uppercase mb-1">Received From</p>
                      <p className="text-[11px] font-bold text-gray-700 truncate">{item.sender_info || 'Self / Direct'}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[9px] font-black text-green-400 uppercase mb-1">Sent To</p>
                      <p className="text-[11px] font-bold text-gray-700 truncate">{item.receiver_info || 'Current Holder'}</p>
                    </div>
                  </div>

                  {/* Description / Evidence Text */}
                  {item.description && (
                    <div className="mt-4 p-3 bg-blue-50/50 rounded-xl border border-blue-100 text-[11px] text-gray-500 italic flex gap-2">
                      <Info size={14} className="text-blue-400 shrink-0" />
                      "{item.description}"
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Footer Disclaimer */}
        <div className="mt-16 pt-8 border-t text-center">
            <p className="text-[10px] text-gray-400 font-medium max-w-lg mx-auto leading-relaxed uppercase tracking-widest">
              Generated via ChainTrace Investigation Platform. This document is a user-submitted digital record and should be cross-verified with official bank statements.
            </p>
        </div>
      </div>
    </div>
  );
};

export default ChainView;