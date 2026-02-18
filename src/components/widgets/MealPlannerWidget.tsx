'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Utensils, ShoppingCart, Calendar, Clock, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { MealPlan, Recipe, ShoppingItem } from '@/lib/meal-planner';
import { generateWeeklyMealPlan, getWeatherForecast, generateShoppingList } from '@/lib/meal-planner';

export function MealPlannerWidget() {
  const [todayMeal, setTodayMeal] = useState<Recipe | null>(null);
  const [nextDays, setNextDays] = useState<MealPlan[]>([]);
  const [shoppingNeeded, setShoppingNeeded] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMealData();
  }, []);

  async function loadMealData() {
    try {
      const weather = await getWeatherForecast(4);
      const plan = generateWeeklyMealPlan(weather);
      
      // Oggi
      const today = new Date().toISOString().split('T')[0];
      const todayPlan = plan.find(p => p.date === today);
      setTodayMeal(todayPlan?.dinner || null);
      
      // Prossimi 3 giorni
      setNextDays(plan.slice(1, 4));
      
      // Verifica se serve fare spesa
      const shoppingList = generateShoppingList(plan.slice(0, 3));
      setShoppingNeeded(shoppingList.length > 5);
      
      setLoading(false);
    } catch (error) {
      console.error('Error loading meal data:', error);
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <Card className="h-full bg-gradient-to-br from-orange-500/10 via-background to-red-500/5 border-orange-500/20">
        <CardContent className="p-6 flex items-center justify-center h-full">
          <p className="text-muted-foreground">Caricamento...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full bg-gradient-to-br from-orange-500/10 via-background to-red-500/5 border-orange-500/20">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-orange-500/20">
              <Utensils className="h-5 w-5 text-orange-500" />
            </div>
            <CardTitle className="text-lg">Meal Planner</CardTitle>
          </div>
          <Link href="/meal-planner">
            <Button variant="ghost" size="sm" className="gap-1">
              Vedi tutto
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Pasto di oggi */}
        <div className="p-3 rounded-xl bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-500/30">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm font-medium text-orange-600 dark:text-orange-400">Oggi a cena</span>
            {todayMeal && (
              <Badge variant="outline" className="text-xs">
                <Clock className="h-3 w-3 mr-1" />
                {todayMeal.prepTime} min
              </Badge>
            )}
          </div>
          <p className="font-semibold text-lg">
            {todayMeal?.name || 'Nessun pasto pianificato'}
          </p>
          {todayMeal && (
            <div className="flex gap-1 mt-2 flex-wrap">
              {todayMeal.tags.slice(0, 3).map(tag => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* Prossimi giorni */}
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Prossimi giorni
          </p>
          <div className="space-y-1">
            {nextDays.map((day, idx) => {
              const date = new Date(day.date);
              const dayName = date.toLocaleDateString('it-IT', { weekday: 'short' });
              return (
                <div key={day.date} className="flex items-center justify-between p-2 rounded-lg bg-secondary/50">
                  <span className="text-sm font-medium capitalize">{dayName}</span>
                  <span className="text-sm text-muted-foreground truncate max-w-[150px]">
                    {day.dinner?.name || 'Non pianificato'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Reminder spesa */}
        {shoppingNeeded && (
          <div className="flex items-center gap-2 p-3 rounded-lg bg-amber-500/10 border border-amber-500/30">
            <ShoppingCart className="h-4 w-4 text-amber-500" />
            <span className="text-sm text-amber-600 dark:text-amber-400">
              Serve fare la spesa!
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
