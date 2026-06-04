import React, { useState } from 'react';

export default function WorkoutLogger() {
  const [workouts, setWorkouts] = useState([
    { id: 1, type: 'Deadlift', category: 'Heavy Lift', sets: 3, reps: 5, weight: 140, notes: 'Felt strong, working on hip drive.', time: 'Today, 08:30 AM' },
    { id: 2, type: 'Bench Press', category: 'Strength', sets: 4, reps: 8, weight: 85, notes: 'Focus on clean leg drive and bar path.', time: 'Today, 09:15 AM' },
    { id: 3, type: 'Overhead Press', category: 'Strength', sets: 3, reps: 6, weight: 55, notes: 'Core stability felt solid.', time: 'Yesterday, 07:45 AM' },
  ]);

  const [type, setType] = useState('Deadlift');
  const [sets, setSets] = useState(3);
  const [reps, setReps] = useState(5);
  const [weight, setWeight] = useState(140);
  const [notes, setNotes] = useState('');

  const handleAddWorkout = (e) => {
    e.preventDefault();
    if (!type || !sets || !reps || !weight) return;
    const newLog = {
      id: Date.now(),
      type,
      category: weight >= 100 ? 'Heavy Lift' : 'Strength',
      sets: Number(sets),
      reps: Number(reps),
      weight: Number(weight),
      notes: notes || 'No extra notes.',
      time: 'Just now',
    };
    setWorkouts([newLog, ...workouts]);
    setNotes('');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in">
      {/* Logger Form */}
      <div className="lg:col-span-1 bg-white border border-slate-100 rounded-3xl p-6 shadow-sm h-fit">
        <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
          <span className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
          </span>
          Log Exercise
        </h3>
        
        <form onSubmit={handleAddWorkout} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Exercise Name</label>
            <select 
              value={type} 
              onChange={(e) => setType(e.target.value)}
              className="w-full px-4 py-2.5 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white"
            >
              <option value="Deadlift">Deadlift (Heavy Lift)</option>
              <option value="Squat">Squat (Heavy Lift)</option>
              <option value="Bench Press">Bench Press</option>
              <option value="Overhead Press">Overhead Press</option>
              <option value="Pull-ups">Pull-ups</option>
              <option value="Barbell Row">Barbell Row</option>
            </select>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Sets</label>
              <input 
                type="number" 
                min="1" 
                value={sets} 
                onChange={(e) => setSets(e.target.value)}
                className="w-full px-3 py-2.5 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500" 
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Reps</label>
              <input 
                type="number" 
                min="1" 
                value={reps} 
                onChange={(e) => setReps(e.target.value)}
                className="w-full px-3 py-2.5 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500" 
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Wt (kg)</label>
              <input 
                type="number" 
                min="0" 
                value={weight} 
                onChange={(e) => setWeight(e.target.value)}
                className="w-full px-3 py-2.5 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500" 
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Notes / Feel</label>
            <textarea 
              rows="3"
              placeholder="How did the set feel?"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-4 py-2.5 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 resize-none"
            ></textarea>
          </div>

          <button 
            type="submit" 
            className="w-full bg-indigo-600 text-white font-semibold py-3 rounded-2xl hover:bg-indigo-700 transition-colors shadow-md shadow-indigo-100"
          >
            Record Log
          </button>
        </form>
      </div>

      {/* Workout History */}
      <div className="lg:col-span-2 space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-slate-900">Today's Lift Summary</h3>
          <span className="text-xs bg-indigo-50 text-indigo-600 font-semibold px-3 py-1 rounded-full">Strength Focus</span>
        </div>

        <div className="space-y-4">
          {workouts.map((w) => (
            <div key={w.id} className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <span className={`p-3 rounded-2xl ${w.category === 'Heavy Lift' ? 'bg-rose-50 text-rose-600' : 'bg-indigo-50 text-indigo-600'}`}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z" />
                  </svg>
                </span>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="text-slate-900 font-bold text-lg">{w.type}</h4>
                    <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold ${w.category === 'Heavy Lift' ? 'bg-rose-50 text-rose-600' : 'bg-indigo-50 text-indigo-600'}`}>
                      {w.category}
                    </span>
                  </div>
                  <p className="text-slate-500 text-sm mt-1">{w.notes}</p>
                  <span className="text-slate-400 text-xs block mt-2">{w.time}</span>
                </div>
              </div>

              <div className="flex items-center gap-4 bg-slate-50 px-5 py-3 rounded-2xl w-fit self-end md:self-center">
                <div className="text-center border-r border-slate-200 pr-4">
                  <span className="block text-xs text-slate-400 font-medium">Sets</span>
                  <span className="text-slate-800 font-extrabold text-base">{w.sets}</span>
                </div>
                <div className="text-center border-r border-slate-200 pr-4">
                  <span className="block text-xs text-slate-400 font-medium">Reps</span>
                  <span className="text-slate-800 font-extrabold text-base">{w.reps}</span>
                </div>
                <div className="text-center">
                  <span className="block text-xs text-slate-400 font-medium">Weight</span>
                  <span className="text-indigo-600 font-extrabold text-base">{w.weight}<span className="text-xs font-normal">kg</span></span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
