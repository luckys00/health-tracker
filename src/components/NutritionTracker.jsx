import React, { useState, useEffect } from 'react';
import { db } from '../firebase.js';
import { collection, addDoc, onSnapshot, query, orderBy, doc, deleteDoc } from 'firebase/firestore';

export default function NutritionTracker() {
  const [meals, setMeals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Controlled form inputs
  const [foodName, setFoodName] = useState('');
  const [calories, setCalories] = useState('');
  const [protein, setProtein] = useState('');
  const [mealType, setMealType] = useState('Breakfast');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const indianMealPresets = [
    { name: 'Paneer Bhurji & 2 Roti', calories: 450, protein: 22 },
    { name: 'Chicken Biryani & Raita', calories: 680, protein: 35 },
    { name: 'Dal Makhani & Jeera Rice', calories: 510, protein: 14 },
    { name: 'Masala Dosa with Sambar', calories: 380, protein: 8 },
    { name: 'Aloo Paratha with Curd', calories: 290, protein: 6 },
    { name: 'Egg Bhurji with Toast (2 eggs)', calories: 320, protein: 18 },
  ];

  // Listen to 'nutrition' collection in real-time
  useEffect(() => {
    const nutritionCollection = collection(db, 'nutrition');
    const q = query(nutritionCollection, orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const logs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setMeals(logs);
      setIsLoading(false);
    }, (err) => {
      console.error("Error listening to nutrition logs:", err);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleAddMeal = async (e) => {
    e.preventDefault();

    // Form validation
    if (!foodName || calories === '' || calories === null || protein === '' || protein === null) {
      setError('Error: Food item name, calories, and protein are required.');
      setSuccess(false);
      return;
    }

    setError('');

    try {
      const newMeal = {
        name: foodName,
        calories: Number(calories),
        protein: Number(protein),
        mealType: mealType,
        createdAt: new Date().toISOString()
      };

      await addDoc(collection(db, 'nutrition'), newMeal);

      // Clear the form and error state
      setFoodName('');
      setCalories('');
      setProtein('');
      setMealType('Breakfast');
      setError('');

      // Show success message
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error("Error saving meal to Firestore:", err);
      setError('Error: Failed to save meal log to the cloud.');
    }
  };

  const handleDeleteMeal = async (id) => {
    try {
      await deleteDoc(doc(db, 'nutrition', id));
    } catch (err) {
      console.error("Error deleting meal from Firestore:", err);
    }
  };

  const handlePresetClick = (preset) => {
    setFoodName(preset.name);
    setCalories(preset.calories);
    setProtein(preset.protein);
    setError('');
  };

  // Calculations for total nutrition logs
  const totalCalories = meals.reduce((sum, item) => sum + (item.calories || 0), 0);
  const totalProtein = meals.reduce((sum, item) => sum + (item.protein || 0), 0);

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
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in">
      {/* Logger Form */}
      <div className="lg:col-span-1 space-y-6">
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-3xl p-6 shadow-sm h-fit transition-colors">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
            <span className="p-2 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 rounded-xl">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </span>
            Log Indian Meals
          </h3>

          {/* Error Banner */}
          {error && (
            <div className="bg-rose-50 dark:bg-rose-950/30 border border-rose-100 dark:border-rose-900/50 text-rose-700 dark:text-rose-400 px-4 py-3 rounded-2xl text-sm font-semibold mb-4">
              {error}
            </div>
          )}

          {/* Success Banner */}
          {success && (
            <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/50 text-emerald-700 dark:text-emerald-400 px-4 py-3 rounded-2xl text-sm font-semibold flex items-center gap-2 mb-4 animate-bounce">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.748-5.25z" clipRule="evenodd" />
              </svg>
              Meal Saved!
            </div>
          )}

          <form onSubmit={handleAddMeal} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Food Item Name</label>
              <input 
                type="text" 
                placeholder="e.g. Masala Dosa" 
                value={foodName}
                onChange={(e) => setFoodName(e.target.value)}
                className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Calories (kcal)</label>
                <input 
                  type="number" 
                  min="0"
                  placeholder="kcal"
                  value={calories}
                  onChange={(e) => setCalories(e.target.value)}
                  className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Protein (g)</label>
                <input 
                  type="number" 
                  min="0"
                  placeholder="grams"
                  value={protein}
                  onChange={(e) => setProtein(e.target.value)}
                  className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Meal Timing</label>
              <select 
                value={mealType} 
                onChange={(e) => setMealType(e.target.value)}
                className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors"
              >
                <option value="Breakfast">Breakfast</option>
                <option value="Lunch">Lunch</option>
                <option value="Snack">Snack</option>
                <option value="Dinner">Dinner</option>
              </select>
            </div>

            <button 
              type="submit" 
              className="w-full bg-emerald-600 text-white font-semibold py-3 rounded-2xl hover:bg-emerald-700 transition-colors shadow-md shadow-emerald-100 dark:shadow-none"
            >
              Add to Log
            </button>
          </form>
        </div>

        {/* Quick Indian Presets Helper */}
        <div className="bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-3xl p-5 shadow-sm transition-colors">
          <h4 className="text-sm font-bold text-slate-800 dark:text-slate-300 mb-3">Popular Presets (Click to autofill)</h4>
          <div className="flex flex-wrap gap-2">
            {indianMealPresets.map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handlePresetClick(p)}
                className="text-xs bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 transition-colors"
              >
                {p.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Summary and Meal List */}
      <div className="lg:col-span-2 space-y-6">
        {/* Macros Breakdown */}
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-3xl p-6 shadow-sm transition-colors">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Nutritional Summary (Today)</h3>
          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="bg-emerald-50/50 dark:bg-emerald-950/30 p-4 rounded-2xl">
              <span className="block text-xs text-slate-500 dark:text-slate-400 font-semibold mb-1">Calories Intake</span>
              <span className="text-emerald-700 dark:text-emerald-400 font-black text-2xl">{totalCalories} <span className="text-xs font-normal">kcal</span></span>
            </div>
            <div className="bg-blue-50/50 dark:bg-blue-950/30 p-4 rounded-2xl">
              <span className="block text-xs text-slate-500 dark:text-slate-400 font-semibold mb-1">Protein Intake</span>
              <span className="text-blue-700 dark:text-blue-400 font-black text-2xl">{totalProtein} <span className="text-xs font-normal">g</span></span>
            </div>
          </div>
        </div>

        {/* Meal Logs */}
        <div className="space-y-4">
          <h4 className="font-bold text-slate-950 dark:text-white text-lg">Logged Meals History</h4>

          {isLoading ? (
            <div className="text-center py-10 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-3xl shadow-sm">
              <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
              <p className="text-slate-400 dark:text-slate-500 text-sm">Loading logs from Firestore...</p>
            </div>
          ) : meals.length === 0 ? (
            <div className="bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-3xl p-10 text-center transition-colors">
              <span className="p-3 bg-white dark:bg-slate-800 rounded-2xl shadow-sm text-slate-400 inline-block mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-6 h-6 mx-auto">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </span>
              <p className="text-slate-500 dark:text-slate-300 font-semibold text-lg">No data logged yet</p>
              <p className="text-slate-400 dark:text-slate-500 text-xs mt-1">Select a preset or log your food to sync it with your cloud account.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {meals.map((m) => (
                <div key={m.id} className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-3xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30 px-2 py-0.5 rounded-full">{m.mealType}</span>
                      <h4 className="text-slate-900 dark:text-white font-bold">{m.name}</h4>
                    </div>
                    <span className="text-slate-400 dark:text-slate-500 text-xs block mt-1">{formatTime(m.createdAt)}</span>
                  </div>
                  <div className="flex items-center justify-between md:justify-end gap-4 w-full md:w-auto">
                    <div className="flex items-center gap-6 bg-slate-50 dark:bg-slate-800/40 px-5 py-3 rounded-2xl w-fit">
                      <div className="text-center border-r border-slate-200 dark:border-slate-700 pr-5">
                        <span className="block text-[10px] text-slate-400 dark:text-slate-500 uppercase font-bold tracking-wider">Protein</span>
                        <span className="text-slate-700 dark:text-slate-200 font-extrabold text-sm">{m.protein}g</span>
                      </div>
                      <div className="text-center">
                        <span className="block text-[10px] text-emerald-600 dark:text-emerald-400 uppercase font-bold tracking-wider">Calories</span>
                        <span className="text-emerald-700 dark:text-emerald-400 font-extrabold text-sm">{m.calories} <span className="text-[10px] font-normal">kcal</span></span>
                      </div>
                    </div>

                    {/* Delete Button */}
                    <button
                      onClick={() => handleDeleteMeal(m.id)}
                      className="p-2.5 text-slate-400 dark:text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-xl transition-all"
                      aria-label="Delete meal log"
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
    </div>
  );
}
