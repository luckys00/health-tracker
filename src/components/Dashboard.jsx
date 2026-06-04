import React from 'react';

export default function Dashboard() {
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 rounded-3xl p-8 text-white shadow-xl shadow-indigo-100">
        <h2 className="text-3xl font-extrabold mb-2">Hello, Champion! 👋</h2>
        <p className="text-indigo-100 max-w-xl">
          Your health journey is on track. You've hit 85% of your fitness goals for this week. Keep up the amazing momentum!
        </p>
      </div>

      {/* Summary Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Stat Card 1: Activity */}
        <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <span className="p-3 bg-violet-50 text-violet-600 rounded-2xl">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
              </svg>
            </span>
            <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">+12% vs yesterday</span>
          </div>
          <h3 className="text-slate-500 text-sm font-medium">Daily Energy</h3>
          <p className="text-slate-900 text-3xl font-bold mt-1">2,450 <span className="text-lg font-normal text-slate-400">kcal</span></p>
          <div className="mt-4 h-2 bg-slate-100 rounded-full overflow-hidden">
            <div className="bg-gradient-to-r from-violet-500 to-indigo-500 h-full rounded-full" style={{ width: '75%' }}></div>
          </div>
          <div className="flex justify-between text-xs text-slate-400 mt-2">
            <span>Goal: 3,000 kcal</span>
            <span>75%</span>
          </div>
        </div>

        {/* Stat Card 2: Sleep */}
        <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <span className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
              </svg>
            </span>
            <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">Optimal</span>
          </div>
          <h3 className="text-slate-500 text-sm font-medium">Sleep Duration</h3>
          <p className="text-slate-900 text-3xl font-bold mt-1">7h 45m <span className="text-lg font-normal text-slate-400">/ 8h</span></p>
          <div className="mt-4 h-2 bg-slate-100 rounded-full overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-500 to-cyan-500 h-full rounded-full" style={{ width: '96%' }}></div>
          </div>
          <div className="flex justify-between text-xs text-slate-400 mt-2">
            <span>Goal: 8h 00m</span>
            <span>96%</span>
          </div>
        </div>

        {/* Stat Card 3: Water Intake */}
        <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <span className="p-3 bg-cyan-50 text-cyan-600 rounded-2xl">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 13.5a3 3 0 100-6 3 3 0 000 6z" />
              </svg>
            </span>
            <span className="text-xs font-semibold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full">Need 2 cups more</span>
          </div>
          <h3 className="text-slate-500 text-sm font-medium">Hydration</h3>
          <p className="text-slate-900 text-3xl font-bold mt-1">2.4 <span className="text-lg font-normal text-slate-400">Liters</span></p>
          <div className="mt-4 h-2 bg-slate-100 rounded-full overflow-hidden">
            <div className="bg-gradient-to-r from-cyan-500 to-blue-500 h-full rounded-full" style={{ width: '68%' }}></div>
          </div>
          <div className="flex justify-between text-xs text-slate-400 mt-2">
            <span>Goal: 3.5 Liters</span>
            <span>68%</span>
          </div>
        </div>
      </div>

      {/* Quick Insights Banner */}
      <div className="bg-slate-50 border border-slate-100 rounded-3xl p-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <span className="p-3 bg-white rounded-2xl shadow-sm text-indigo-600">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a3 3 0 100-6 3 3 0 000 6zm0 0v5.25m0 0h4.5m-4.5 0H7.5" />
            </svg>
          </span>
          <div>
            <h4 className="text-slate-900 font-semibold">Weekly Habit Tip</h4>
            <p className="text-slate-500 text-sm">Consistent sleep schedules improve morning energy by up to 25%. Try sleeping by 10:30 PM tonight.</p>
          </div>
        </div>
        <button className="bg-white border border-slate-200 text-slate-700 px-6 py-2.5 rounded-2xl font-medium hover:bg-slate-100 transition-colors shadow-sm text-sm">
          Read Guide
        </button>
      </div>
    </div>
  );
}
