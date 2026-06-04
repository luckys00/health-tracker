import React, { useState } from 'react';

export default function NutritionTracker() {
  const [meals, setMeals] = useState([
    { id: 1, name: 'Paneer Bhurji & 2 Roti', mealType: 'Breakfast', calories: 450, protein: 22, carbs: 45, fats: 18, time: 'Today, 08:30 AM' },
    { id: 2, name: 'Chicken Biryani & Raita', mealType: 'Lunch', calories: 680, protein: 35, carbs: 75, fats: 20, time: 'Today, 01:15 PM' },
    { id: 3, name: 'Dal Makhani & Jeera Rice', mealType: 'Dinner', calories: 510, protein: 14, carbs: 68, fats: 16, time: 'Yesterday, 08:45 PM' },
  ]);

  const indianMealDatabase = [
    { name: 'Paneer Bhurji & 2 Roti', calories: 450, protein: 22, carbs: 45, fats: 18 },
    { name: 'Chicken Biryani & Raita', calories: 680, protein: 35, carbs: 75, fats: 20 },
    { name: 'Dal Makhani & Jeera Rice', calories: 510, protein: 14, carbs: 68, fats: 16 },
    { name: 'Masala Dosa with Sambar', calories: 380, protein: 8, carbs: 62, fats: 10 },
    { name: 'Aloo Paratha with Curd (1 pc)', calories: 290, protein: 6, carbs: 42, fats: 11 },
    { name: 'Chana Masala & Bhatura (1 pc)', calories: 480, protein: 10, carbs: 58, fats: 22 },
  ];

  const [selectedMealIndex, setSelectedMealIndex] = useState(0);
  const [mealType, setMealType] = useState('Breakfast');
  const [customName, setCustomName] = useState('');
  const [customCalories, setCustomCalories] = useState(300);
  const [isCustom, setIsCustom] = useState(false);

  const totalCalories = meals.reduce((sum, item) => sum + item.calories, 0);
  const totalProtein = meals.reduce((sum, item) => sum + item.protein, 0);
  const totalCarbs = meals.reduce((sum, item) => sum + item.carbs, 0);
  const totalFats = meals.reduce((sum, item) => sum + item.fats, 0);

  const handleAddMeal = (e) => {
    e.preventDefault();
    let newMeal;
    if (isCustom) {
      if (!customName || !customCalories) return;
      newMeal = {
        id: Date.now(),
        name: customName,
        mealType,
        calories: Number(customCalories),
        protein: Math.round(customCalories * 0.05), // simple estimation
        carbs: Math.round(customCalories * 0.12),
        fats: Math.round(customCalories * 0.04),
        time: 'Just now',
      };
      setCustomName('');
    } else {
      const dbMeal = indianMealDatabase[selectedMealIndex];
      newMeal = {
        id: Date.now(),
        name: dbMeal.name,
        mealType,
        calories: dbMeal.calories,
        protein: dbMeal.protein,
        carbs: dbMeal.carbs,
        fats: dbMeal.fats,
        time: 'Just now',
      };
    }
    setMeals([newMeal, ...meals]);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in">
      {/* Logger Form */}
      <div className="lg:col-span-1 bg-white border border-slate-100 rounded-3xl p-6 shadow-sm h-fit">
        <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
          <span className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </span>
          Log Indian Meals
        </h3>

        <div className="flex gap-2 p-1 bg-slate-100 rounded-2xl mb-4">
          <button 
            type="button"
            onClick={() => setIsCustom(false)}
            className={`flex-1 text-center py-2 rounded-xl text-sm font-semibold transition-all ${!isCustom ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
          >
            Popular Meals
          </button>
          <button 
            type="button"
            onClick={() => setIsCustom(true)}
            className={`flex-1 text-center py-2 rounded-xl text-sm font-semibold transition-all ${isCustom ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
          >
            Custom Meal
          </button>
        </div>

        <form onSubmit={handleAddMeal} className="space-y-4">
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

          {!isCustom ? (
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Select Indian Meal</label>
              <select 
                value={selectedMealIndex} 
                onChange={(e) => setSelectedMealIndex(Number(e.target.value))}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 bg-white"
              >
                {indianMealDatabase.map((m, idx) => (
                  <option key={idx} value={idx}>{m.name} ({m.calories} kcal)</option>
                ))}
              </select>
            </div>
          ) : (
            <>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Meal Name</label>
                <input 
                  type="text" 
                  placeholder="e.g. Masala Chai & Rusk" 
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Calories (kcal)</label>
                <input 
                  type="number" 
                  min="0"
                  value={customCalories}
                  onChange={(e) => setCustomCalories(e.target.value)}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>
            </>
          )}

          <button 
            type="submit" 
            className="w-full bg-emerald-600 text-white font-semibold py-3 rounded-2xl hover:bg-emerald-700 transition-colors shadow-md shadow-emerald-100"
          >
            Add to Log
          </button>
        </form>
      </div>

      {/* Summary and Meal List */}
      <div className="lg:col-span-2 space-y-6">
        {/* Macros Breakdown */}
        <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-4">Nutritional Summary</h3>
          <div className="grid grid-cols-4 gap-4 text-center">
            <div className="bg-emerald-50/50 p-4 rounded-2xl">
              <span className="block text-xs text-slate-500 font-semibold mb-1">Calories</span>
              <span className="text-emerald-700 font-black text-xl">{totalCalories} <span className="text-xs font-normal">kcal</span></span>
            </div>
            <div className="bg-blue-50/50 p-4 rounded-2xl">
              <span className="block text-xs text-slate-500 font-semibold mb-1">Protein</span>
              <span className="text-blue-700 font-black text-xl">{totalProtein} <span className="text-xs font-normal">g</span></span>
            </div>
            <div className="bg-amber-50/50 p-4 rounded-2xl">
              <span className="block text-xs text-slate-500 font-semibold mb-1">Carbs</span>
              <span className="text-amber-700 font-black text-xl">{totalCarbs} <span className="text-xs font-normal">g</span></span>
            </div>
            <div className="bg-rose-50/50 p-4 rounded-2xl">
              <span className="block text-xs text-slate-500 font-semibold mb-1">Fats</span>
              <span className="text-rose-700 font-black text-xl">{totalFats} <span className="text-xs font-normal">g</span></span>
            </div>
          </div>
        </div>

        {/* Meal Logs */}
        <div className="space-y-4">
          <h4 className="font-bold text-slate-950 text-lg">Logged Meals</h4>
          {meals.map((m) => (
            <div key={m.id} className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">{m.mealType}</span>
                  <h4 className="text-slate-900 font-bold">{m.name}</h4>
                </div>
                <span className="text-slate-400 text-xs block mt-1">{m.time}</span>
              </div>
              <div className="flex items-center gap-4 bg-slate-50 px-4 py-2.5 rounded-2xl w-fit self-end md:self-center">
                <div className="text-center border-r border-slate-200 pr-3">
                  <span className="block text-[10px] text-slate-400">P</span>
                  <span className="text-slate-700 font-bold text-xs">{m.protein}g</span>
                </div>
                <div className="text-center border-r border-slate-200 pr-3">
                  <span className="block text-[10px] text-slate-400">C</span>
                  <span className="text-slate-700 font-bold text-xs">{m.carbs}g</span>
                </div>
                <div className="text-center border-r border-slate-200 pr-3">
                  <span className="block text-[10px] text-slate-400">F</span>
                  <span className="text-slate-700 font-bold text-xs">{m.fats}g</span>
                </div>
                <div className="text-center">
                  <span className="block text-[10px] text-emerald-600 font-semibold">Calories</span>
                  <span className="text-emerald-700 font-extrabold text-sm">{m.calories} <span className="text-[10px] font-normal">kcal</span></span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
