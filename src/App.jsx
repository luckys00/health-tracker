import React, { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard';
import WorkoutLogger from './components/WorkoutLogger';
import NutritionTracker from './components/NutritionTracker';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') || 'light';
    }
    return 'light';
  });

  // Apply dark mode class on theme state change
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

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
    <div className="min-h-screen bg-slate-50 text-slate-800 dark:bg-slate-950 dark:text-slate-100 antialiased font-sans flex flex-col justify-between transition-colors duration-300">
      <div>
        {/* Top Navbar */}
        <nav className="bg-white/80 dark:bg-slate-900/85 backdrop-blur-md sticky top-0 z-50 border-b border-slate-100 dark:border-slate-800/80 transition-colors duration-300">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 sm:py-0 sm:h-16 flex flex-col sm:flex-row items-center justify-between gap-4">
            
            {/* Logo */}
            <div className="flex items-center gap-2">
              <span className="p-2 bg-gradient-to-tr from-indigo-500 to-violet-500 rounded-xl text-white shadow-md shadow-indigo-200 dark:shadow-none">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
                </svg>
              </span>
              <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                HealthTracker
              </span>
            </div>

            {/* Navigation and Actions */}
            <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
              {/* Tab Navigation */}
              <div className="flex gap-1 bg-slate-100/80 dark:bg-slate-800 p-1 rounded-2xl">
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 ${
                    activeTab === 'dashboard'
                      ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Dashboard
                </button>
                <button
                  onClick={() => setActiveTab('workout')}
                  className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 ${
                    activeTab === 'workout'
                      ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Workouts
                </button>
                <button
                  onClick={() => setActiveTab('nutrition')}
                  className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 ${
                    activeTab === 'nutrition'
                      ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Nutrition
                </button>
              </div>

              {/* Theme Toggle Button */}
              <button
                onClick={toggleTheme}
                className="p-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-2xl transition-all duration-200"
                aria-label="Toggle theme"
              >
                {theme === 'light' ? (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
                  </svg>
                )}
              </button>
            </div>

          </div>
        </nav>

        {/* Main Content Area */}
        <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
          {renderComponent()}
        </main>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 py-8 transition-colors duration-300">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-slate-400 dark:text-slate-500">
          <p>© {new Date().getFullYear()} HealthTracker App. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-slate-600 dark:hover:text-slate-300 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-slate-600 dark:hover:text-slate-300 transition-colors">Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
