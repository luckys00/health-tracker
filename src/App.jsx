import React, { useState } from 'react';
import Dashboard from './components/Dashboard';
import WorkoutLogger from './components/WorkoutLogger';
import NutritionTracker from './components/NutritionTracker';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderComponent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'workout':
        return <WorkoutLogger />;
      case 'nutrition':
        return <NutritionTracker />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 text-slate-800 antialiased font-sans flex flex-col justify-between">
      <div>
        {/* Top Navbar */}
        <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-slate-100/80">
          <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="p-2 bg-gradient-to-tr from-indigo-500 to-violet-500 rounded-xl text-white shadow-md shadow-indigo-200">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
                </svg>
              </span>
              <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">HealthTracker</span>
            </div>

            <div className="flex gap-1.5">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`px-4 py-2 rounded-2xl text-sm font-semibold transition-all duration-200 ${
                  activeTab === 'dashboard'
                    ? 'bg-indigo-50 text-indigo-600 shadow-sm shadow-indigo-50'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                Dashboard
              </button>
              <button
                onClick={() => setActiveTab('workout')}
                className={`px-4 py-2 rounded-2xl text-sm font-semibold transition-all duration-200 ${
                  activeTab === 'workout'
                    ? 'bg-indigo-50 text-indigo-600 shadow-sm shadow-indigo-50'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                Workout Logger
              </button>
              <button
                onClick={() => setActiveTab('nutrition')}
                className={`px-4 py-2 rounded-2xl text-sm font-semibold transition-all duration-200 ${
                  activeTab === 'nutrition'
                    ? 'bg-indigo-50 text-indigo-600 shadow-sm shadow-indigo-50'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                Nutrition Tracker
              </button>
            </div>
          </div>
        </nav>

        {/* Main Content Area */}
        <main className="max-w-6xl mx-auto px-6 py-10">
          {renderComponent()}
        </main>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-100 bg-white py-8 mt-20">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-slate-400">
          <p>© {new Date().getFullYear()} HealthTracker App. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-slate-600 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-slate-600 transition-colors">Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
