import React, { useState, useEffect } from 'react';
import { db } from '../firebase.js';
import { collection, addDoc, onSnapshot, query, orderBy } from 'firebase/firestore';

export default function NutritionTracker() {
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);

  // Controlled form inputs
  const [foodName, setFoodName] = useState('');
  const [calories, setCalories] = useState('');
  const [protein, setProtein] = useState('');
  const [mealType, setMealType] = useState('Breakfast');
  const [success, setSuccess] = useState(false);

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
      setLoading(false);
    }, (error) => {
      console.error("Error listening to nutrition logs:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleAddMeal = async (e) => {
    e.preventDefault();
    if (!foodName || !calories || !protein) return;

    try {
      const newMeal = {
        name: foodName,
        calories: Number(calories),
        protein: Number(protein),
        mealType: mealType,
        createdAt: new Date().toISOString()
      };

      await addDoc(collection(db, 'nutrition'), newMeal);

      // Clear the form
      setFoodName('');
      setCalories('');
      setProtein('');
      setMealType('Breakfast');

      // Show success message
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error("Error saving meal to Firestore:", error);
    }
  };

  const handlePresetClick = (preset) => {
    setFoodName(preset.name);
    setCalories(preset.calories);
    setProtein(preset.protein);
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
        <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm h-fit">
          <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
            <span className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </span>
            Log Indian Meals
          </h3>

          {/* Success Banner */}
          {success && (
            <div className="bg-emerald-50 border border-emerald-100 text-emerald-700 px-4 py-3 rounded-2xl text-sm font-semibold flex items-center gap-2 mb-4 animate-bounce">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.748-5.25z" clipRule="evenodd" />
              </svg>
              Meal Saved!
            </div>
          )}

          <form onSubmit={handleAddMeal} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Food Item Name</label>
              <input 
                type="text" 
                placeholder="e.g. Masala Dosa" 
                value={foodName}
                onChange={(e) => setFoodName(e.target.value)}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Calories (kcal)</label>
                <input 
                  type="number" 
                  min="0"
                  placeholder="kcal"
                  value={calories}
                  onChange={(e) => setCalories(e.target.value)}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Protein (g)</label>
                <input 
                  type="number" 
                  min="0"
                  placeholder="grams"
                  value={protein}
                  onChange={(e) => setProtein(e.target.value)}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Meal Timing</label>
              <select 
                value={mealType} 
                onChange={(e) => setMealType(e.target.value)}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 bg-white"
              >
                <option value="Breakfast">Breakfast</option>
                <option value="Lunch">Lunch</option>
                <option value="Snack">Snack</option>
                <option value="Dinner">Dinner</option>
              </select>
            </div>

            <button 
              type="submit" 
              className="w-full bg-emerald-600 text-white font-semibold py-3 rounded-2xl hover:bg-emerald-700 transition-colors shadow-md shadow-emerald-100"
            >
              Add to Log
            </button>
          </form>
        </div>

        {/* Quick Indian Presets Helper */}
        <div className="bg-slate-50 border border-slate-100 rounded-3xl p-5 shadow-sm">
          <h4 className="text-sm font-bold text-slate-800 mb-3">Popular Presets (Click to autofill)</h4>
          <div className="flex flex-wrap gap-2">
            {indianMealPresets.map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handlePresetClick(p)}
                className="text-xs bg-white hover:bg-slate-100 text-slate-700 font-semibold px-3 py-2 rounded-xl border border-slate-200 transition-colors"
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
        <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-4">Nutritional Summary (Today)</h3>
          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="bg-emerald-50/50 p-4 rounded-2xl">
              <span className="block text-xs text-slate-500 font-semibold mb-1">Calories Intake</span>
              <span className="text-emerald-700 font-black text-2xl">{totalCalories} <span className="text-xs font-normal">kcal</span></span>
            </div>
            <div className="bg-blue-50/50 p-4 rounded-2xl">
              <span className="block text-xs text-slate-500 font-semibold mb-1">Protein Intake</span>
              <span className="text-blue-700 font-black text-2xl">{totalProtein} <span className="text-xs font-normal">g</span></span>
            </div>
          </div>
        </div>

        {/* Meal Logs */}
        <div className="space-y-4">
          <h4 className="font-bold text-slate-950 text-lg">Logged Meals History</h4>

          {loading ? (
            <div className="text-center py-10">
              <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
              <p className="text-slate-400 text-sm">Loading logs from Firestore...</p>
            </div>
          ) : meals.length === 0 ? (
            <div className="bg-slate-50 border border-slate-100 rounded-3xl p-10 text-center">
              <span className="p-3 bg-white rounded-2xl shadow-sm text-slate-400 inline-block mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-6 h-6 mx-auto">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </span>
              <p className="text-slate-500 font-medium">No meals logged yet</p>
              <p className="text-slate-400 text-xs mt-1">Select a preset or log your food to sync it with your cloud account.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {meals.map((m) => (
                <div key={m.id} className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">{m.mealType}</span>
                      <h4 className="text-slate-900 font-bold">{m.name}</h4>
                    </div>
                    <span className="text-slate-400 text-xs block mt-1">{formatTime(m.createdAt)}</span>
                  </div>
                  <div className="flex items-center gap-6 bg-slate-50 px-5 py-3 rounded-2xl w-fit self-end md:self-center">
                    <div className="text-center border-r border-slate-200 pr-5">
                      <span className="block text-[10px] text-slate-400 uppercase font-bold tracking-wider">Protein</span>
                      <span className="text-slate-700 font-extrabold text-sm">{m.protein}g</span>
                    </div>
                    <div className="text-center">
                      <span className="block text-[10px] text-emerald-600 uppercase font-bold tracking-wider">Calories</span>
                      <span className="text-emerald-700 font-extrabold text-sm">{m.calories} <span className="text-[10px] font-normal">kcal</span></span>
                    </div>
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
