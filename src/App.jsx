import React, { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard';
import WorkoutLogger from './components/WorkoutLogger';
import NutritionTracker from './components/NutritionTracker';
import Auth from './components/Auth';
import { auth } from './firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') || 'light';
    }
    return 'light';
  });

  // Apply dark mode class to window.document.documentElement on theme change
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Firebase auth state listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error('Logout error:', err);
    }
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

  // Auth Loading State (Sleek pulse layout)
  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-800 dark:bg-slate-950 dark:text-slate-100 flex flex-col items-center justify-center transition-colors duration-500">
        <div className="w-16 h-16 bg-gradient-to-tr from-indigo-500 via-violet-500 to-fuchsia-500 rounded-3xl shadow-xl shadow-indigo-200/50 dark:shadow-none animate-pulse flex items-center justify-center mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-8 h-8 text-white">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
          </svg>
        </div>
        <p className="text-sm font-bold tracking-widest uppercase text-slate-400 dark:text-slate-500">Initializing HealthTracker...</p>
      </div>
    );
  }

  // Not Authenticated State
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-tr from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900 text-slate-800 dark:text-slate-100 flex flex-col justify-between transition-colors duration-500">
        <header className="max-w-6xl w-full mx-auto px-6 py-6 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="p-2.5 bg-gradient-to-tr from-indigo-500 via-violet-500 to-fuchsia-500 rounded-2xl text-white shadow-xl shadow-indigo-200/50 dark:shadow-none">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
              </svg>
            </span>
            <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">HealthTracker</span>
          </div>
          <button
            onClick={toggleTheme}
            className="p-3 bg-white hover:bg-slate-50 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300"
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
        </header>

        <main className="flex-grow flex items-center justify-center">
          <Auth />
        </main>

        <footer className="border-t border-slate-100 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 py-8 text-center text-xs font-semibold text-slate-400 dark:text-slate-500">
          <p>© {new Date().getFullYear()} HealthTracker App. All rights reserved.</p>
        </footer>
      </div>
    );
  }

  // Authenticated Main Application State (Overhauled, Premium theme styles)
  return (
    <div className="min-h-screen bg-slate-50/50 text-slate-800 dark:bg-slate-950 dark:text-slate-100 antialiased font-sans flex flex-col justify-between transition-colors duration-500">
      <div>
        {/* Top Navbar */}
        <nav className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg sticky top-0 z-50 border-b border-slate-100 dark:border-slate-900 transition-colors duration-500 py-2 sm:py-0">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 sm:py-0 sm:h-20 flex flex-col sm:flex-row items-center justify-between gap-4">
            
            {/* Logo Home Button */}
            <button
              onClick={() => setActiveTab('dashboard')}
              className="flex items-center gap-2.5 focus:outline-none hover:opacity-90 active:scale-95 hover:-translate-y-0.5 transition-all text-left group"
            >
              <span className="p-3 bg-gradient-to-tr from-indigo-500 via-violet-500 to-fuchsia-500 rounded-2xl text-white shadow-lg shadow-indigo-200/50 dark:shadow-none transition-transform group-hover:scale-105">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
                </svg>
              </span>
              <span className="font-black text-xl sm:text-2xl tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-200 bg-clip-text text-transparent">
                HealthTracker
              </span>
            </button>

            {/* Navigation and Actions */}
            <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
              {/* Tab Navigation */}
              <div className="flex gap-1.5 bg-slate-100 dark:bg-slate-900 p-1.5 rounded-[1.25rem] w-full sm:w-auto justify-center border border-slate-200/20 dark:border-slate-800/20">
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className={`flex-1 sm:flex-none px-4 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all duration-300 ${
                    activeTab === 'dashboard'
                      ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-white shadow-sm'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white'
                  }`}
                >
                  Dashboard
                </button>
                <button
                  onClick={() => setActiveTab('workout')}
                  className={`flex-1 sm:flex-none px-4 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all duration-300 ${
                    activeTab === 'workout'
                      ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-white shadow-sm'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white'
                  }`}
                >
                  Workouts
                </button>
                <button
                  onClick={() => setActiveTab('nutrition')}
                  className={`flex-1 sm:flex-none px-4 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all duration-300 ${
                    activeTab === 'nutrition'
                      ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-white shadow-sm'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white'
                  }`}
                >
                  Nutrition
                </button>
              </div>

              {/* Utility buttons */}
              <div className="flex items-center gap-2.5 self-end sm:self-auto">
                {/* Theme Toggle */}
                <button
                  onClick={toggleTheme}
                  className="p-3 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300"
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

                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className="p-3 text-slate-500 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-400 bg-white dark:bg-slate-900 hover:bg-rose-50 dark:hover:bg-rose-950/20 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 flex items-center justify-center"
                  title="Sign Out"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
                  </svg>
                </button>
              </div>
            </div>

          </div>
        </nav>

        {/* Main Content Area */}
        <main className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
          {renderComponent()}
        </main>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-100 dark:border-slate-900 bg-white dark:bg-slate-900 py-10 transition-colors duration-500">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-sm font-semibold text-slate-400 dark:text-slate-500">
          <p>© {new Date().getFullYear()} HealthTracker App. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-slate-600 dark:hover:text-slate-300 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-slate-600 dark:hover:text-slate-300 transition-colors">Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
