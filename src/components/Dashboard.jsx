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
    <div className="space-y-8 animate-fade-in">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 rounded-3xl p-8 text-white shadow-xl shadow-indigo-100 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-extrabold mb-2">Hello, Champion! 👋</h2>
          <p className="text-indigo-100 max-w-xl text-sm">
            Your real-time fitness cloud sync is active. Check out your summary below to see how close you are to smashing today's targets!
          </p>
        </div>
        <div className="bg-white/10 backdrop-blur-md border border-white/20 px-5 py-3.5 rounded-2xl text-center">
          <span className="block text-xs uppercase tracking-wider font-semibold text-indigo-100">Live Status</span>
          <span className="text-white font-extrabold text-sm flex items-center gap-1.5 justify-center mt-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            Cloud Synced
          </span>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-20 bg-white border border-slate-100 rounded-3xl shadow-sm">
          <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-slate-400 text-sm">Loading daily summaries from cloud...</p>
        </div>
      ) : (
        <>
          {/* Summary Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1: Calories Consumed */}
            <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <span className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </span>
                <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
                  {caloriePercent}% of goal
                </span>
              </div>
              <h3 className="text-slate-500 text-sm font-medium">Calories Consumed Today</h3>
              <p className="text-slate-900 text-3xl font-extrabold mt-1">
                {totalCalories.toLocaleString()} <span className="text-lg font-normal text-slate-400">/ {CALORIE_GOAL} kcal</span>
              </p>
              <div className="mt-4 h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="bg-gradient-to-r from-emerald-500 to-teal-500 h-full rounded-full transition-all duration-500" style={{ width: `${caloriePercent}%` }}></div>
              </div>
            </div>

            {/* Card 2: Protein Consumed */}
            <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <span className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 13.5a3 3 0 100-6 3 3 0 000 6z" />
                  </svg>
                </span>
                <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">
                  {proteinPercent}% of goal
                </span>
              </div>
              <h3 className="text-slate-500 text-sm font-medium">Total Protein Today</h3>
              <p className="text-slate-900 text-3xl font-extrabold mt-1">
                {totalProtein} <span className="text-lg font-normal text-slate-400">/ {PROTEIN_GOAL} g</span>
              </p>
              <div className="mt-4 h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="bg-gradient-to-r from-blue-500 to-indigo-500 h-full rounded-full transition-all duration-500" style={{ width: `${proteinPercent}%` }}></div>
              </div>
            </div>

            {/* Card 3: Workouts Logged */}
            <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <span className="p-3 bg-violet-50 text-violet-600 rounded-2xl">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z" />
                  </svg>
                </span>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${totalWorkouts > 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                  {totalWorkouts > 0 ? 'Active Today' : 'Rest Day'}
                </span>
              </div>
              <h3 className="text-slate-500 text-sm font-medium">Workouts Logged Today</h3>
              <p className="text-slate-900 text-3xl font-extrabold mt-1">
                {totalWorkouts} <span className="text-lg font-normal text-slate-400">/{WORKOUT_GOAL} logged</span>
              </p>
              <div className="mt-4 h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="bg-gradient-to-r from-violet-500 to-fuchsia-500 h-full rounded-full transition-all duration-500" style={{ width: `${workoutPercent}%` }}></div>
              </div>
            </div>
          </div>

          {/* Quick Insights Banner */}
          <div className="bg-slate-50 border border-slate-100 rounded-3xl p-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <span className="p-3 bg-white rounded-2xl shadow-sm text-indigo-600">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.375c1.88 0 3.43-1.087 3.5-2.5.07-1.412-1.48-2.5-3.375-2.5H9v5z" />
                </svg>
              </span>
              <div>
                <h4 className="text-slate-900 font-semibold">Today's Health Status</h4>
                {totalWorkouts > 0 || totalCalories > 0 ? (
                  <p className="text-slate-500 text-sm">
                    Nice! You've logged {totalWorkouts} lift(s) and consumed {totalCalories} kcal. You're fueling your heavy reps with clean proteins.
                  </p>
                ) : (
                  <p className="text-slate-500 text-sm">
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
