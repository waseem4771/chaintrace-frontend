import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, Link as LinkIcon } from 'lucide-react';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="text-center py-16">
      <h1 className="text-5xl font-black text-gray-900 mb-6">
        Trace & Link Your <span className="text-blue-600">Disputed Transactions</span>
      </h1>
      <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-12">
        A professional tool to document fund flow between multiple bank accounts 
        to help banks resolve your frozen or disputed funds.
      </p>

      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 hover:scale-105 transition">
          <PlusCircle className="w-16 h-16 text-blue-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-4">Start New Dispute</h2>
          <p className="text-gray-500 mb-6">If you are the first person (User A) who sent the money by mistake.</p>
          <button onClick={() => navigate('/create')} className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold text-lg">
            Create Case ID
          </button>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 hover:scale-105 transition">
          <LinkIcon className="w-16 h-16 text-green-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-4">Join Existing Case</h2>
          <p className="text-gray-500 mb-6">If someone shared a Case ID with you to document your part of the chain.</p>
          <button onClick={() => navigate('/join')} className="w-full bg-green-600 text-white py-4 rounded-2xl font-bold text-lg">
            Enter Case ID
          </button>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;