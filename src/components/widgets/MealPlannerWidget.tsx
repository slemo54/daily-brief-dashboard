'use client';

import { useState, useEffect } from 'react';
import { Utensils, ShoppingCart, Calendar, Clock, ArrowRight, Flame, Leaf, ChefHat, Wallet } from 'lucide-react';
import Link from 'next/link';
import { MealPlan, Recipe } from '@/lib/meal-planner';
import { generateWeeklyMealPlan, getWeatherForecast, generateShoppingList, calculateWeeklyBudget, getWeeklyMenuPlan } from '@/lib/meal-planner';

export function MealPlannerWidget() {
  const [todayMeal, setTodayMeal] = useState<Recipe | null>(null);
  const [nextDays, setNextDays] = useState<MealPlan[]>([]);
  const [shoppingNeeded, setShoppingNeeded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [weeklyBudget] = useState(() => calculateWeeklyBudget());

  useEffect(() => {
    loadMealData();
  }, []);

  async function loadMealData() {
    try {
      const weather = await getWeatherForecast(4);
      const plan = generateWeeklyMealPlan(weather);
      
      const today = new Date().toISOString().split('T')[0];
      const todayPlan = plan.find(p => p.date === today);
      setTodayMeal(todayPlan?.dinner || null);
      
      setNextDays(plan.slice(1, 4));
      
      const shoppingList = generateShoppingList(plan.slice(0, 3));
      setShoppingNeeded(shoppingList.length > 5);
      
      setLoading(false);
    } catch (error) {
      console.error('Error loading meal data:', error);
      setLoading(false);
    }
  }

  const getTagIcon = (tag: string) => {
    if (tag.toLowerCase().includes('spicy') || tag.toLowerCase().includes('piccante')) return <Flame className="w-3 h-3" />;
    if (tag.toLowerCase().includes('veg')) return <Leaf className="w-3 h-3" />;
    return <ChefHat className="w-3 h-3" />;
  };

  const getDayName = (dateStr: string) => {
    const date = new Date(dateStr);
    const dayNames = ['Dom', 'Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab'];
    return dayNames[date.getDay()];
  };

  if (loading) {
    return (
      <div className="glass-card p-5 shimmer">
        <div className="h-48 flex items-center justify-center">
          <span className="text-[#9ca3af]">Caricamento...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card p-5">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-[#f59e0b]/10">
            <Utensils className="w-4 h-4 text-[#f59e0b]" />
          </div>
          <span className="text-sm font-medium text-[#9ca3af]">Meal Planner</span>
        </div>
        <Link 
          href="/meal-planner"
          className="flex items-center gap-1 text-xs text-[#ff6b4a] hover:text-[#ff8566] transition-colors"
        >
          Vedi tutto
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      <div className="space-y-4">
        {/* Budget Info */}
        <div className="flex items-center gap-2 p-2 rounded-lg bg-[#22c55e]/10 border border-[#22c55e]/20">
          <Wallet className="w-4 h-4 text-[#22c55e]" />
          <span className="text-xs text-[#22c55e]">Budget: ~{weeklyBudget}€/settimana</span>
        </div>

        {/* Today's Meal */}
        <div className="p-4 rounded-2xl bg-[#1a1a1a] border border-[#f59e0b]/20">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs font-medium text-[#f59e0b] uppercase tracking-wider">Oggi a cena</span>
            {todayMeal && (
              <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#1a1a1a] border border-[#2a2a2a]">
                <Clock className="w-3 h-3 text-[#6b7280]" />
                <span className="text-xs text-[#6b7280]">{todayMeal.prepTime} min</span>
              </div>
            )}
          </div>
          
          <p className="text-lg font-semibold text-[#ebebeb] mb-3">
            {todayMeal?.name || 'Nessun pasto pianificato'}
          </p>
          
          {todayMeal && (
            <div className="flex gap-2 flex-wrap">
              {todayMeal.tags.slice(0, 3).map(tag => (
                <span 
                  key={tag} 
                  className="flex items-center gap-1 px-2 py-1 rounded-lg bg-[#1a1a1a] border border-[#2a2a2a] text-xs text-[#9ca3af]"
                >
                  {getTagIcon(tag)}
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Next Days */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Calendar className="w-4 h-4 text-[#6b7280]" />
            <span className="text-xs font-medium text-[#6b7280]">Prossimi giorni</span>
          </div>
          
          <div className="space-y-2">
            {nextDays.map((day) => (
              <div 
                key={day.date} 
                className="flex items-center justify-between p-3 rounded-xl bg-[#1a1a1a] border border-[#2a2a2a] hover:border-[#3a3a3a] transition-colors"
              >
                <span className="text-sm font-medium text-[#9ca3af]">{getDayName(day.date)}</span>
                <span className="text-sm text-[#6b7280] truncate max-w-[180px]" title={day.dinner?.name}>
                  {day.dinner?.name || 'Non pianificato'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Shopping Reminder */}
        {shoppingNeeded && (
          <div className="flex items-center gap-3 p-3 rounded-xl bg-[#f59e0b]/10 border border-[#f59e0b]/30">
            <ShoppingCart className="w-4 h-4 text-[#f59e0b]" />
            <span className="text-sm text-[#f59e0b]">Serve fare la spesa!</span>
          </div>
        )}
      </div>
    </div>
  );
}
