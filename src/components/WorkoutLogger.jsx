import React, { useState, useEffect } from 'react';
import { db } from '../firebase.js';
import { collection, addDoc, query, orderBy, onSnapshot, doc, deleteDoc } from 'firebase/firestore';

export default function WorkoutLogger() {
  const [workouts, setWorkouts] = useState([]);
  const [type, setType] = useState('Deadlift');
  const [sets, setSets] = useState(3);
  const [reps, setReps] = useState(5);
  const [weight, setWeight] = useState(140);
  const [notes, setNotes] = useState('');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Sync workouts from Firestore in real-time
  useEffect(() => {
    const workoutsCollection = collection(db, 'workouts');
    const q = query(workoutsCollection, orderBy('createdAt', 'desc'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const logs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setWorkouts(logs);
      setIsLoading(false);
    }, (err) => {
      console.error("Error fetching workouts from Firestore:", err);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleAddWorkout = async (e) => {
    e.preventDefault();
    
    // Form validation
    if (!type || !sets || !reps || weight === '' || weight === null || weight === undefined) {
      setError('Error: Exercise name, sets, reps, and weight are required.');
      setSuccess(false);
      return;
    }

    setError('');

    try {
      const newLog = {
        type,
        category: Number(weight) >= 100 ? 'Heavy Lift' : 'Strength',
        sets: Number(sets),
        reps: Number(reps),
        weight: Number(weight),
        notes: notes || 'No extra notes.',
        createdAt: new Date().toISOString(),
      };

      await addDoc(collection(db, 'workouts'), newLog);
      
      // Clear form & errors
      setNotes('');
      setError('');
      // Show success message
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error("Error saving workout to Firestore:", err);
      setError('Error: Failed to save workout to the cloud.');
    }
  };

  const handleDeleteWorkout = async (id) => {
    try {
      await deleteDoc(doc(db, 'workouts', id));
    } catch (err) {
      console.error("Error deleting workout from Firestore:", err);
    }
  };

  // Helper to format timestamps nicely
  const formatTime = (isoString) => {
    if (!isoString) return 'Just now';
    try {
      const date = new Date(isoString);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ', ' + date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    } catch (e) {
      return 'Just now';
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 sm:gap-12 animate-fade-in">
      {/* Logger Form */}
      <div className="lg:col-span-1 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-[2rem] p-8 shadow-lg h-fit transition-all duration-300">
        <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-8 flex items-center gap-3">
          <span className="p-2.5 bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 rounded-2xl shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
          </span>
          Log Exercise
        </h3>

        {/* Error Alert Banner */}
        {error && (
          <div className="bg-rose-50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/40 text-rose-700 dark:text-rose-400 px-5 py-3.5 rounded-2xl text-sm font-semibold mb-6 transition-all duration-300">
            {error}
          </div>
        )}

        {/* Success Alert Banner */}
        {success && (
          <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/40 text-emerald-700 dark:text-emerald-400 px-5 py-3.5 rounded-2xl text-sm font-semibold flex items-center gap-2.5 mb-6 animate-bounce">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
              <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.748-5.25z" clipRule="evenodd" />
            </svg>
            Workout Saved!
          </div>
        )}
        
        <form onSubmit={handleAddWorkout} className="space-y-6">
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Exercise Name</label>
            <select 
              value={type} 
              onChange={(e) => setType(e.target.value)}
              className="w-full px-4 py-3 border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 text-slate-900 dark:text-white rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-300"
            >
              <option value="Deadlift">Deadlift (Heavy Lift)</option>
              <option value="Squat">Squat (Heavy Lift)</option>
              <option value="Bench Press">Bench Press</option>
              <option value="Overhead Press">Overhead Press</option>
              <option value="Pull-ups">Pull-ups</option>
              <option value="Barbell Row">Barbell Row</option>
            </select>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Sets</label>
              <input 
                type="number" 
                min="1" 
                value={sets} 
                onChange={(e) => setSets(e.target.value)}
                className="w-full px-4 py-3 border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 text-slate-900 dark:text-white rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-300" 
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Reps</label>
              <input 
                type="number" 
                min="1" 
                value={reps} 
                onChange={(e) => setReps(e.target.value)}
                className="w-full px-4 py-3 border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 text-slate-900 dark:text-white rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-300" 
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Wt (kg)</label>
              <input 
                type="number" 
                min="0" 
                value={weight} 
                onChange={(e) => setWeight(e.target.value)}
                className="w-full px-4 py-3 border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 text-slate-900 dark:text-white rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-300" 
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Notes / Feel</label>
            <textarea 
              rows="3"
              placeholder="How did the set feel?"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-4 py-3 border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 text-slate-900 dark:text-white rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 hover:border-slate-300 dark:hover:border-slate-700 resize-none transition-all duration-300 placeholder-slate-400"
            ></textarea>
          </div>

          <button 
            type="submit" 
            className="w-full bg-gradient-to-r from-indigo-600 via-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-extrabold py-4 rounded-2xl shadow-xl shadow-indigo-150/50 dark:shadow-none hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300"
          >
            Record Log
          </button>
        </form>
      </div>

      {/* Workout History */}
      <div className="lg:col-span-2 space-y-8">
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-black text-slate-900 dark:text-white">Logged Lifts History</h3>
          <span className="text-xs bg-indigo-50 dark:bg-indigo-950/35 text-indigo-600 dark:text-indigo-400 font-extrabold px-3 py-1.5 rounded-full border border-indigo-100/10">Sync Active (Cloud)</span>
        </div>

        {isLoading ? (
          <div className="text-center py-20 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-[2rem] shadow-lg">
            <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-400 dark:text-slate-500 text-sm font-bold tracking-wider uppercase">Loading cloud logs...</p>
          </div>
        ) : workouts.length === 0 ? (
          <div className="bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800/80 rounded-[2rem] p-12 text-center transition-colors">
            <span className="p-4 bg-white dark:bg-slate-900 rounded-2xl shadow-md text-slate-400 inline-block mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-6 h-6 mx-auto">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z" />
              </svg>
            </span>
            <p className="text-slate-500 dark:text-slate-300 font-bold text-xl">No data logged yet</p>
            <p className="text-slate-400 dark:text-slate-500 text-sm mt-2 max-w-sm mx-auto leading-relaxed">Log your heavy deadlifts or workouts using the builder form to your left.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {workouts.map((w) => (
              <div key={w.id} className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-[2rem] p-6 shadow-md hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-start gap-4">
                  <span className={`p-4 rounded-2xl shadow-sm ${w.category === 'Heavy Lift' ? 'bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400' : 'bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400'}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z" />
                    </svg>
                  </span>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-slate-900 dark:text-white font-extrabold text-xl">{w.type}</h4>
                      <span className={`text-xs px-3 py-1 rounded-full font-bold ${w.category === 'Heavy Lift' ? 'bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400' : 'bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400'}`}>
                        {w.category}
                      </span>
                    </div>
                    <p className="text-slate-500 dark:text-slate-400 text-sm mt-2 font-medium">{w.notes}</p>
                    <span className="text-slate-400 dark:text-slate-500 text-xs block mt-3 font-semibold">{formatTime(w.createdAt)}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between md:justify-end gap-6 w-full md:w-auto border-t md:border-t-0 pt-4 md:pt-0 border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-5 bg-slate-50 dark:bg-slate-800/40 px-6 py-4 rounded-2xl w-fit border border-slate-100/10">
                    <div className="text-center border-r border-slate-200 dark:border-slate-700 pr-5">
                      <span className="block text-xs text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">Sets</span>
                      <span className="text-slate-800 dark:text-slate-200 font-black text-lg">{w.sets}</span>
                    </div>
                    <div className="text-center border-r border-slate-200 dark:border-slate-700 pr-5">
                      <span className="block text-xs text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">Reps</span>
                      <span className="text-slate-800 dark:text-slate-200 font-black text-lg">{w.reps}</span>
                    </div>
                    <div className="text-center">
                      <span className="block text-xs text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">Weight</span>
                      <span className="text-indigo-600 dark:text-indigo-400 font-black text-lg">{w.weight}<span className="text-xs font-normal">kg</span></span>
                    </div>
                  </div>

                  {/* Delete Button */}
                  <button
                    onClick={() => handleDeleteWorkout(w.id)}
                    className="p-3 text-slate-400 dark:text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-2xl transition-all duration-300 hover:scale-105 active:scale-95"
                    aria-label="Delete workout log"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
