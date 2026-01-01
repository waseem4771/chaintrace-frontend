// import React from 'react';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import LandingPage from './pages/LandingPage';
// import CreateCase from './pages/CreateCase';
// import JoinCase from './pages/JoinCase';
// import ChainView from './pages/ChainView'; // 1. Import ChainView

// function App() {
//   return (
//     <Router>
//       <div className="min-h-screen bg-gray-50">
//         {/* Navbar */}
//         <nav className="bg-blue-600 text-white shadow-md p-4">
//           <div className="container mx-auto flex justify-between items-center">
//             <h1 className="text-2xl font-bold tracking-tighter">🔗 ChainTrace</h1>
//             <div className="space-x-4">
//               <span className="text-sm bg-blue-700 px-3 py-1 rounded-full border border-blue-400">
//                 Secure Chain Tracking
//               </span>
//             </div>
//           </div>
//         </nav>

//         {/* Page Content */}
//         <div className="container mx-auto py-8 px-4">
//           <Routes>
//             <Route path="/" element={<LandingPage />} />
//             <Route path="/create" element={<CreateCase />} />
//             <Route path="/join" element={<JoinCase />} />
//             {/* 2. Added Route for Visual Chain */}
//             <Route path="/chain/:caseId" element={<ChainView />} /> 
//           </Routes>
//         </div>
//       </div>
//     </Router>
//   );
// }

// export default App;









import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import CreateCase from './pages/CreateCase';
import JoinCase from './pages/JoinCase';
import ChainView from './pages/ChainView'; 
import AdminDashboard from './pages/AdminDashboard'; 
import AdminLogin from './pages/AdminLogin'; // Naya Login Page import kiya

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        {/* Navbar */}
        <nav className="bg-blue-600 text-white shadow-xl p-5 sticky top-0 z-50">
          <div className="container mx-auto flex justify-between items-center">
            {/* Logo Section */}
            <Link to="/" className="text-3xl font-black tracking-tighter flex items-center gap-2 hover:scale-105 transition-transform active:scale-95">
              <span className="bg-white text-blue-600 px-2 py-1 rounded-lg">🔗</span>
              ChainTrace
            </Link>
            
            <div className="flex items-center space-x-6">
              {/* Status Indicator (Desktop Only) */}
              <div className="hidden md:flex items-center gap-2">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-80 border-l border-blue-400 pl-3">
                  Secure Protocol Active
                </span>
              </div>

              {/* Admin Panel Link */}
              <Link 
                to="/admin-login" 
                className="text-[10px] bg-blue-500 hover:bg-white hover:text-blue-600 px-4 py-2 rounded-xl transition-all font-black uppercase tracking-widest border border-blue-400 shadow-sm"
              >
                Admin Access
              </Link>
            </div>
          </div>
        </nav>

        {/* Page Content Area */}
        <div className="flex-1 container mx-auto py-10 px-4">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/create" element={<CreateCase />} />
            <Route path="/join" element={<JoinCase />} />
            
            {/* Visual Report Route */}
            <Route path="/chain/:caseId" element={<ChainView />} /> 
            
            {/* Admin Authentication Routes */}
            <Route path="/admin-login" element={<AdminLogin />} /> 
            <Route path="/admin" element={<AdminDashboard />} /> 
            
            {/* 404 Catch-all: Redirect back to home if route not found */}
            <Route path="*" element={<LandingPage />} />
          </Routes>
        </div>

        {/* Global Footer (Optional) */}
        <footer className="py-6 border-t border-gray-100 text-center bg-white">
          <p className="text-[9px] text-gray-400 font-bold uppercase tracking-[0.5em]">
            ChainTrace Documentation Platform &copy; 2025
          </p>
        </footer>
      </div>
    </Router>
  );
}

export default App;