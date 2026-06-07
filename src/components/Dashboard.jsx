import React, { useState, useEffect } from 'react';
import { db } from '../firebase.js';
import { collection, onSnapshot } from 'firebase/firestore';

export default function Dashboard() {
  const [workouts, setWorkouts] = useState([]);
  const [nutrition, setNutrition] = useState([]);
  const [loading, setLoading] = useState(true);

  // Sync data from Firestore in real-time
  useEffect(() => {
    const workoutsCollection = collection(db, 'workouts');
    const nutritionCollection = collection(db, 'nutrition');

    const unsubscribeWorkouts = onSnapshot(workoutsCollection, (snapshot) => {
      const logs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setWorkouts(logs);
    }, (error) => {
      console.error("Error loading workouts: ", error);
    });

    const unsubscribeNutrition = onSnapshot(nutritionCollection, (snapshot) => {
      const logs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setNutrition(logs);
      setLoading(false);
    }, (error) => {
      console.error("Error loading nutrition: ", error);
      setLoading(false);
    });

    return () => {
      unsubscribeWorkouts();
      unsubscribeNutrition();
    };
  }, []);

  // Filter for today's logs on client-side
  const isToday = (isoString) => {
    if (!isoString) return false;
    const date = new Date(isoString);
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  };

  const todaysWorkouts = workouts.filter(w => isToday(w.createdAt));
  const todaysNutrition = nutrition.filter(n => isToday(n.createdAt));

  // Calculations
  const totalCalories = todaysNutrition.reduce((sum, item) => sum + (item.calories || 0), 0);
  const totalProtein = todaysNutrition.reduce((sum, item) => sum + (item.protein || 0), 0);
  const totalWorkouts = todaysWorkouts.length;

  // Goals
  const CALORIE_GOAL = 2500;
  const PROTEIN_GOAL = 120;
  const WORKOUT_GOAL = 1; // 1 session a day

  // Percentages for UI progress bars
  const caloriePercent = Math.min(Math.round((totalCalories / CALORIE_GOAL) * 100), 100);
  const proteinPercent = Math.min(Math.round((totalProtein / PROTEIN_GOAL) * 100), 100);
  const workoutPercent = Math.min(Math.round((totalWorkouts / WORKOUT_GOAL) * 100), 100);

  return (
    <div className="space-y-10 sm:space-y-12 animate-fade-in">
      {/* Welcome Header Banner */}
      <div className="bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 rounded-[2rem] p-8 sm:p-12 text-white shadow-2xl shadow-indigo-150/40 dark:shadow-none flex flex-col md:flex-row md:items-center justify-between gap-8 transition-all duration-300">
        <div className="space-y-3">
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight">Hello, Champion! 👋</h2>
          <p className="text-indigo-100 max-w-xl text-sm sm:text-base font-semibold leading-relaxed">
            Your real-time fitness cloud sync is active. Check out your summary below to see how close you are to smashing today's targets!
          </p>
        </div>
        <div className="bg-white/10 backdrop-blur-md border border-white/20 px-6 py-4.5 rounded-2xl text-center self-start md:self-center">
          <span className="block text-xs uppercase tracking-widest font-extrabold text-indigo-100">Live Status</span>
          <span className="text-white font-extrabold text-sm flex items-center gap-2.5 justify-center mt-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
            Cloud Synced
          </span>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-24 bg-white/70 dark:bg-slate-900/60 backdrop-blur-md border border-slate-100 dark:border-slate-800/60 rounded-[2.5rem] shadow-xl">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-400 dark:text-slate-500 text-sm font-bold tracking-wider uppercase">Loading daily summaries...</p>
        </div>
      ) : (
        <>
          {/* Summary Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1: Calories Consumed */}
            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-[2rem] p-8 shadow-lg hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <span className="p-3.5 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 rounded-2xl shadow-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </span>
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 px-3 py-1 rounded-full">
                    {caloriePercent}% of goal
                  </span>
                </div>
                <div>
                  <h3 className="text-slate-400 dark:text-slate-500 text-xs font-extrabold uppercase tracking-widest">Calories Today</h3>
                  <p className="text-slate-900 dark:text-white text-3xl font-black mt-2">
                    {totalCalories.toLocaleString()} <span className="text-lg font-bold text-slate-400 dark:text-slate-500">/ {CALORIE_GOAL} kcal</span>
                  </p>
                </div>
              </div>
              <div className="mt-8">
                <div className="h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div className="bg-gradient-to-r from-emerald-500 to-teal-500 h-full rounded-full transition-all duration-500" style={{ width: `${caloriePercent}%` }}></div>
                </div>
              </div>
            </div>

            {/* Card 2: Protein Consumed */}
            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-[2rem] p-8 shadow-lg hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <span className="p-3.5 bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 rounded-2xl shadow-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 13.5a3 3 0 100-6 3 3 0 000 6z" />
                    </svg>
                  </span>
                  <span className="text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/30 px-3 py-1 rounded-full">
                    {proteinPercent}% of goal
                  </span>
                </div>
                <div>
                  <h3 className="text-slate-400 dark:text-slate-500 text-xs font-extrabold uppercase tracking-widest">Protein Intake</h3>
                  <p className="text-slate-900 dark:text-white text-3xl font-black mt-2">
                    {totalProtein} <span className="text-lg font-bold text-slate-400 dark:text-slate-500">/ {PROTEIN_GOAL} g</span>
                  </p>
                </div>
              </div>
              <div className="mt-8">
                <div className="h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div className="bg-gradient-to-r from-blue-500 to-indigo-500 h-full rounded-full transition-all duration-500" style={{ width: `${proteinPercent}%` }}></div>
                </div>
              </div>
            </div>

            {/* Card 3: Workouts Logged */}
            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-[2rem] p-8 shadow-lg hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <span className="p-3.5 bg-violet-50 dark:bg-violet-950/30 text-violet-600 dark:text-violet-400 rounded-2xl shadow-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z" />
                    </svg>
                  </span>
                  <span className={`text-xs font-bold px-3 py-1 rounded-full ${totalWorkouts > 0 ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600' : 'bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400'}`}>
                    {totalWorkouts > 0 ? 'Active Today' : 'Rest Day'}
                  </span>
                </div>
                <div>
                  <h3 className="text-slate-400 dark:text-slate-500 text-xs font-extrabold uppercase tracking-widest">Workouts Logged</h3>
                  <p className="text-slate-900 dark:text-white text-3xl font-black mt-2">
                    {totalWorkouts} <span className="text-lg font-bold text-slate-400 dark:text-slate-500">/{WORKOUT_GOAL} logged</span>
                  </p>
                </div>
              </div>
              <div className="mt-8">
                <div className="h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div className="bg-gradient-to-r from-violet-500 to-fuchsia-500 h-full rounded-full transition-all duration-500" style={{ width: `${workoutPercent}%` }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Insights Banner */}
          <div className="bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 transition-all duration-300">
            <div className="flex items-center gap-5">
              <span className="p-4 bg-white dark:bg-slate-800 rounded-2xl shadow-sm text-indigo-600 dark:text-indigo-400">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.375c1.88 0 3.43-1.087 3.5-2.5.07-1.412-1.48-2.5-3.375-2.5H9v5z" />
                </svg>
              </span>
              <div>
                <h4 className="text-slate-900 dark:text-white font-extrabold text-lg">Today's Health Status</h4>
                {totalWorkouts > 0 || totalCalories > 0 ? (
                  <p className="text-slate-500 dark:text-slate-400 text-sm mt-1 font-semibold leading-relaxed">
                    Nice! You've logged {totalWorkouts} lift(s) and consumed {totalCalories} kcal. You're fueling your heavy reps with clean proteins.
                  </p>
                ) : (
                  <p className="text-slate-500 dark:text-slate-400 text-sm mt-1 font-semibold leading-relaxed">
                    No logs recorded yet today. Jump into the Workout Logger or Nutrition Tracker tab to start logging!
                  </p>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
