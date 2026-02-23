'use client';

import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Utensils, 
  ShoppingCart, 
  Calendar, 
  Clock, 
  Flame,
  ArrowLeft,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Lock,
  Unlock,
  Shuffle,
  List,
  Sun,
  Cloud,
  CloudRain,
  Snowflake,
  ChevronDown,
  ChevronUp,
  Info
} from 'lucide-react';
import Link from 'next/link';
import { 
  Recipe, 
  MealPlan, 
  ShoppingItem, 
  WeatherForecast,
  generateWeeklyMealPlan,
  getRecipes,
  getRecipesByMealType,
  getWeatherForecast,
  generateShoppingList,
  groupShoppingListByAisle,
  saveMealPlan,
  loadMealPlan,
  saveShoppingListState,
  loadShoppingListState,
  getWeeklyMenuPlan
} from '@/lib/meal-planner';

// Storage keys
const MEAL_PLAN_KEY = 'meal-planner-current';
const MEAL_PLAN_PREFERENCES_KEY = 'meal-planner-preferences';
const SHOPPING_LIST_KEY = 'meal-planner-shopping';
const LOCKED_MEALS_KEY = 'meal-planner-locked';

interface MealPlanPreferences {
  defaultView: 'day' | 'week' | 'month';
  futureDays: 7 | 14 | 30;
  showMacros: boolean;
}

interface LockedMeals {
  [date: string]: {
    breakfast?: boolean;
    lunch?: boolean;
    dinner?: boolean;
  };
}

interface DayPlan {
  date: string;
  breakfast?: Recipe;
  lunch?: Recipe;
  dinner?: Recipe;
  locked?: {
    breakfast?: boolean;
    lunch?: boolean;
    dinner?: boolean;
  };
}

export default function MealPlannerPage() {
  // View state
  const [activeTab, setActiveTab] = useState<'planner' | 'recipes' | 'shopping'>('planner');
  const [viewMode, setViewMode] = useState<'day' | 'week' | 'month'>('week');
  const [futureDays, setFutureDays] = useState<7 | 14 | 30>(7);
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [showMacros, setShowMacros] = useState(true);

  // Data state
  const [mealPlan, setMealPlan] = useState<DayPlan[]>([]);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [shoppingItems, setShoppingItems] = useState<ShoppingItem[]>([]);
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());
  const [weather, setWeather] = useState<WeatherForecast[]>([]);
  const [lockedMeals, setLockedMeals] = useState<LockedMeals>({});

  // UI state
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [selectedDay, setSelectedDay] = useState<DayPlan | null>(null);
  const [swapModalOpen, setSwapModalOpen] = useState(false);
  const [swapMealType, setSwapMealType] = useState<'breakfast' | 'lunch' | 'dinner' | null>(null);
  const [expandedDays, setExpandedDays] = useState<Set<string>>(new Set());
  const [tagFilter, setTagFilter] = useState<string>('all');
  const [mealTypeFilter, setMealTypeFilter] = useState<'all' | 'breakfast' | 'lunch' | 'dinner'>('all');

  // Initialize data
  useEffect(() => {
    initializeData();
  }, []);

  // Save meal plan when it changes
  useEffect(() => {
    if (mealPlan.length > 0) {
      saveMealPlanToStorage(mealPlan);
    }
  }, [mealPlan]);

  // Save locked meals when they change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(LOCKED_MEALS_KEY, JSON.stringify(lockedMeals));
    }
  }, [lockedMeals]);

  // Save preferences
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const prefs: MealPlanPreferences = {
        defaultView: viewMode,
        futureDays,
        showMacros
      };
      localStorage.setItem(MEAL_PLAN_PREFERENCES_KEY, JSON.stringify(prefs));
    }
  }, [viewMode, futureDays, showMacros]);

  async function initializeData() {
    const allRecipes = getRecipes();
    setRecipes(allRecipes);
    
    // Load preferences
    const savedPrefs = typeof window !== 'undefined' ? localStorage.getItem(MEAL_PLAN_PREFERENCES_KEY) : null;
    if (savedPrefs) {
      const prefs: MealPlanPreferences = JSON.parse(savedPrefs);
      setViewMode(prefs.defaultView);
      setFutureDays(prefs.futureDays);
      setShowMacros(prefs.showMacros);
    }

    // Load locked meals
    const savedLocks = typeof window !== 'undefined' ? localStorage.getItem(LOCKED_MEALS_KEY) : null;
    if (savedLocks) {
      setLockedMeals(JSON.parse(savedLocks));
    }
    
    // Get weather forecast
    const weatherData = await getWeatherForecast(futureDays);
    setWeather(weatherData);
    
    // Load saved meal plan or generate new
    const savedPlan = loadMealPlan();
    const recipeIds = new Set(allRecipes.map(r => r.id));
    
    const isValidPlan = savedPlan && savedPlan.length > 0 && 
      savedPlan.every((day: MealPlan) => 
        (!day.breakfast || recipeIds.has(day.breakfast.id)) &&
        (!day.lunch || recipeIds.has(day.lunch.id)) &&
        (!day.dinner || recipeIds.has(day.dinner.id))
      );
    
    if (isValidPlan && savedPlan.length >= futureDays) {
      // Convert to DayPlan format with locked status
      const dayPlans: DayPlan[] = savedPlan.slice(0, futureDays).map((day: MealPlan) => ({
        ...day,
        locked: lockedMeals[day.date] || {}
      }));
      setMealPlan(dayPlans);
    } else {
      generateNewPlan(weatherData);
    }
    
    // Load shopping list state
    const savedShopping = loadShoppingListState();
    if (savedShopping) {
      setCheckedItems(new Set(savedShopping.checkedItems));
    }
  }

  function saveMealPlanToStorage(plan: DayPlan[]) {
    if (typeof window !== 'undefined') {
      // Strip locked status before saving (stored separately)
      const cleanPlan = plan.map(({ locked, ...rest }) => rest);
      localStorage.setItem(MEAL_PLAN_KEY, JSON.stringify(cleanPlan));
    }
  }

  function generateNewPlan(weatherData: WeatherForecast[] = weather) {
    const newPlan: DayPlan[] = [];
    const today = new Date();
    const weeklyMenu = getWeeklyMenuPlan();
    const allRecipes = getRecipes();
    const getRecipeById = (id: string) => allRecipes.find(r => r.id === id);
    
    for (let i = 0; i < futureDays; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      const dateStr = date.toISOString().split('T')[0];
      
      // Get day of week (0 = Sunday, 1 = Monday, ...)
      const dayOfWeek = date.getDay();
      const dayIndex = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Convert to 0 = Monday
      const dayPlan = weeklyMenu[dayIndex];
      
      // Check if meals are locked
      const dayLocks = lockedMeals[dateStr] || {};
      
      // Find existing day to preserve locked meals
      const existingDay = mealPlan.find(d => d.date === dateStr);
      
      newPlan.push({
        date: dateStr,
        breakfast: dayLocks.breakfast && existingDay?.breakfast 
          ? existingDay.breakfast 
          : (getRecipeById(dayPlan.breakfast) || allRecipes[0]),
        lunch: dayLocks.lunch && existingDay?.lunch 
          ? existingDay.lunch 
          : (getRecipeById(dayPlan.lunch) || allRecipes[2]),
        dinner: dayLocks.dinner && existingDay?.dinner 
          ? existingDay.dinner 
          : (getRecipeById(dayPlan.dinner) || allRecipes[3]),
        locked: dayLocks
      });
    }
    
    setMealPlan(newPlan);
  }

  function regeneratePlan() {
    // Clear non-locked meals and regenerate based on weekly menu
    const weeklyMenu = getWeeklyMenuPlan();
    const allRecipes = getRecipes();
    const getRecipeById = (id: string) => allRecipes.find(r => r.id === id);
    
    const newPlan = mealPlan.map(day => {
      const date = new Date(day.date);
      const dayOfWeek = date.getDay();
      const dayIndex = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
      const dayPlan = weeklyMenu[dayIndex];
      
      return {
        ...day,
        breakfast: day.locked?.breakfast ? day.breakfast : (getRecipeById(dayPlan.breakfast) || allRecipes[0]),
        lunch: day.locked?.lunch ? day.lunch : (getRecipeById(dayPlan.lunch) || allRecipes[2]),
        dinner: day.locked?.dinner ? day.dinner : (getRecipeById(dayPlan.dinner) || allRecipes[3]),
      };
    });
    
    setMealPlan(newPlan);
  }

  function toggleLock(date: string, mealType: 'breakfast' | 'lunch' | 'dinner') {
    setLockedMeals(prev => {
      const current = prev[date] || {};
      return {
        ...prev,
        [date]: {
          ...current,
          [mealType]: !current[mealType]
        }
      };
    });
    
    // Update meal plan locked status
    setMealPlan(prev => prev.map(day => {
      if (day.date === date) {
        return {
          ...day,
          locked: {
            ...day.locked,
            [mealType]: !day.locked?.[mealType]
          }
        };
      }
      return day;
    }));
  }

  function openSwapModal(day: DayPlan, mealType: 'breakfast' | 'lunch' | 'dinner') {
    setSelectedDay(day);
    setSwapMealType(mealType);
    setSwapModalOpen(true);
  }

  function swapRecipe(newRecipe: Recipe) {
    if (!selectedDay || !swapMealType) return;
    
    setMealPlan(prev => prev.map(day => {
      if (day.date === selectedDay.date) {
        return {
          ...day,
          [swapMealType]: newRecipe
        };
      }
      return day;
    }));
    
    setSwapModalOpen(false);
    setSelectedDay(null);
    setSwapMealType(null);
  }

  function generateShoppingListForRange(days: number = 7) {
    const rangePlan = mealPlan.slice(0, days);
    const validPlan = rangePlan.map(day => ({
      date: day.date,
      breakfast: day.breakfast,
      lunch: day.lunch,
      dinner: day.dinner! // dinner è sempre presente nel nostro piano
    }));
    const items = generateShoppingList(validPlan);
    setShoppingItems(items);
    setActiveTab('shopping');
  }

  function toggleShoppingItem(itemId: string) {
    const newChecked = new Set(checkedItems);
    if (newChecked.has(itemId)) {
      newChecked.delete(itemId);
    } else {
      newChecked.add(itemId);
    }
    setCheckedItems(newChecked);
    saveShoppingListState({
      checkedItems: Array.from(newChecked),
      lastUpdated: new Date().toISOString(),
    });
  }

  function toggleDayExpanded(date: string) {
    const newExpanded = new Set(expandedDays);
    if (newExpanded.has(date)) {
      newExpanded.delete(date);
    } else {
      newExpanded.add(date);
    }
    setExpandedDays(newExpanded);
  }

  function getWeatherIcon(condition: string) {
    switch (condition) {
      case 'sunny': return <Sun className="h-5 w-5 text-yellow-500" />;
      case 'cloudy': return <Cloud className="h-5 w-5 text-gray-400" />;
      case 'rainy': return <CloudRain className="h-5 w-5 text-blue-400" />;
      case 'snowy': return <Snowflake className="h-5 w-5 text-blue-300" />;
      default: return <Sun className="h-5 w-5 text-yellow-500" />;
    }
  }

  function calculateDayMacros(day: DayPlan) {
    const meals = [day.breakfast, day.lunch, day.dinner].filter(Boolean);
    return meals.reduce((acc, meal) => ({
      protein: acc.protein + (meal?.macros?.protein || 0),
      carbs: acc.carbs + (meal?.macros?.carbs || 0),
      fats: acc.fats + (meal?.macros?.fats || 0),
      calories: acc.calories + (meal?.macros?.calories || 0),
    }), { protein: 0, carbs: 0, fats: 0, calories: 0 });
  }

  function calculateWeekMacros() {
    return mealPlan.slice(0, 7).reduce((acc, day) => {
      const dayMacros = calculateDayMacros(day);
      return {
        protein: acc.protein + dayMacros.protein,
        carbs: acc.carbs + dayMacros.carbs,
        fats: acc.fats + dayMacros.fats,
        calories: acc.calories + dayMacros.calories,
      };
    }, { protein: 0, carbs: 0, fats: 0, calories: 0 });
  }

  function getMealTime(mealType: 'breakfast' | 'lunch' | 'dinner') {
    switch (mealType) {
      case 'breakfast': return '08:00';
      case 'lunch': return '13:00';
      case 'dinner': return '20:00';
    }
  }

  function getMealLabel(mealType: 'breakfast' | 'lunch' | 'dinner') {
    switch (mealType) {
      case 'breakfast': return 'Colazione';
      case 'lunch': return 'Pranzo';
      case 'dinner': return 'Cena';
    }
  }

  function getMealColor(mealType: 'breakfast' | 'lunch' | 'dinner') {
    switch (mealType) {
      case 'breakfast': return 'bg-amber-500/10 text-amber-600 border-amber-500/20';
      case 'lunch': return 'bg-green-500/10 text-green-600 border-green-500/20';
      case 'dinner': return 'bg-indigo-500/10 text-indigo-600 border-indigo-500/20';
    }
  }

  // Filtered recipes for catalog
  const filteredRecipes = useMemo(() => {
    return recipes.filter(recipe => {
      if (tagFilter !== 'all' && !recipe.tags.includes(tagFilter)) return false;
      if (mealTypeFilter !== 'all' && recipe.mealType !== mealTypeFilter) return false;
      return true;
    });
  }, [recipes, tagFilter, mealTypeFilter]);

  const allTags = useMemo(() => 
    Array.from(new Set(recipes.flatMap(r => r.tags))).sort(),
    [recipes]
  );

  // Get available recipes for swapping
  const swapRecipeOptions = useMemo(() => {
    if (!swapMealType) return [];
    return getRecipesByMealType(swapMealType);
  }, [swapMealType]);

  // Recipe detail view
  if (selectedRecipe) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20 p-4">
        <div className="max-w-4xl mx-auto">
          <Button 
            variant="ghost" 
            className="mb-4"
            onClick={() => setSelectedRecipe(null)}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Torna indietro
          </Button>
          
          <Card className="overflow-hidden">
            <div className={`h-48 flex items-center justify-center ${
              selectedRecipe.mealType === 'breakfast' ? 'bg-gradient-to-r from-amber-500/20 to-orange-500/20' :
              selectedRecipe.mealType === 'lunch' ? 'bg-gradient-to-r from-green-500/20 to-emerald-500/20' :
              'bg-gradient-to-r from-indigo-500/20 to-purple-500/20'
            }`}>
              <Utensils className={`h-16 w-16 ${
                selectedRecipe.mealType === 'breakfast' ? 'text-amber-500/50' :
                selectedRecipe.mealType === 'lunch' ? 'text-green-500/50' :
                'text-indigo-500/50'
              }`} />
            </div>
            
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className={getMealColor(selectedRecipe.mealType || 'dinner')}>
                      {getMealLabel(selectedRecipe.mealType || 'dinner')}
                    </Badge>
                    {selectedRecipe.tags.includes('protein') && (
                      <Badge variant="outline" className="text-blue-500">Proteica</Badge>
                    )}
                  </div>
                  <h1 className="text-3xl font-bold mb-2">{selectedRecipe.name}</h1>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">
                      <Clock className="h-3 w-3 mr-1" />
                      {selectedRecipe.prepTime} min
                    </Badge>
                    
                    <Badge variant="outline" className={
                      selectedRecipe.difficulty === 'easy' ? 'text-green-500' :
                      selectedRecipe.difficulty === 'medium' ? 'text-yellow-500' : 'text-red-500'
                    }>
                      <Flame className="h-3 w-3 mr-1" />
                      {selectedRecipe.difficulty === 'easy' ? 'Facile' :
                       selectedRecipe.difficulty === 'medium' ? 'Media' : 'Difficile'}
                    </Badge>
                  </div>
                </div>
              </div>

              {selectedRecipe.macros && (
                <div className="grid grid-cols-4 gap-4 mb-6 p-4 bg-secondary/30 rounded-lg">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-orange-500">{selectedRecipe.macros.calories}</p>
                    <p className="text-xs text-muted-foreground">kcal</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-500">{selectedRecipe.macros.protein}g</p>
                    <p className="text-xs text-muted-foreground">proteine</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-yellow-500">{selectedRecipe.macros.carbs}g</p>
                    <p className="text-xs text-muted-foreground">carbs</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-red-500">{selectedRecipe.macros.fats}g</p>
                    <p className="text-xs text-muted-foreground">grassi</p>
                  </div>
                </div>
              )}

              <div className="flex gap-2 mb-6 flex-wrap">
                {selectedRecipe.tags.map(tag => (
                  <Badge key={tag} variant="secondary">{tag}</Badge>
                ))}
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h2 className="text-lg font-semibold mb-3">Ingredienti</h2>
                  <ul className="space-y-2">
                    {selectedRecipe.ingredients.map((ing, idx) => (
                      <li key={idx} className="flex items-center justify-between p-2 rounded bg-secondary/50">
                        <span>{ing.name}</span>
                        <span className="text-muted-foreground text-sm">{ing.amount}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h2 className="text-lg font-semibold mb-3">Preparazione</h2>
                  <ol className="space-y-3">
                    {selectedRecipe.instructions.map((step, idx) => (
                      <li key={idx} className="flex gap-3">
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium">
                          {idx + 1}
                        </span>
                        <span className="text-muted-foreground">{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Swap recipe modal
  if (swapModalOpen && selectedDay && swapMealType) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20 p-4">
        <div className="max-w-4xl mx-auto">
          <Button 
            variant="ghost" 
            className="mb-4"
            onClick={() => setSwapModalOpen(false)}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Annulla
          </Button>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shuffle className="h-5 w-5" />
                Cambia {getMealLabel(swapMealType)} - {new Date(selectedDay.date).toLocaleDateString('it-IT', { weekday: 'long', day: 'numeric' })}
              </CardTitle>
            </CardHeader>
            
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {swapRecipeOptions.map(recipe => (
                  <Card 
                    key={recipe.id}
                    className={`cursor-pointer hover:border-orange-500/50 transition-colors ${
                      selectedDay[swapMealType]?.id === recipe.id ? 'border-orange-500 bg-orange-500/5' : ''
                    }`}
                    onClick={() => swapRecipe(recipe)}
                  >
                    <CardContent className="p-4">
                      <h3 className="font-semibold mb-2">{recipe.name}</h3>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                        <Clock className="h-4 w-4" />
                        {recipe.prepTime} min
                      </div>
                      {recipe.macros && (
                        <div className="text-xs text-muted-foreground">
                          {recipe.macros.calories} kcal • {recipe.macros.protein}g proteine
                        </div>
                      )}
                      <div className="flex flex-wrap gap-1 mt-2">
                        {recipe.tags.slice(0, 3).map(tag => (
                          <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const weekMacros = calculateWeekMacros();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20">
      {/* Header */}
      <header className="border-b border-border/50 bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Dashboard
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                  Meal Planner
                </h1>
                <p className="text-sm text-muted-foreground">
                  Pianifica i tuoi pasti e gestisci la spesa
                </p>
              </div>
            </div>
            
            {/* Quick stats */}
            {showMacros && (
              <div className="hidden md:flex items-center gap-4 text-sm">
                <div className="text-center">
                  <p className="font-bold text-orange-500">{Math.round(weekMacros.calories / 7)}</p>
                  <p className="text-xs text-muted-foreground">kcal/giorno</p>
                </div>
                <div className="text-center">
                  <p className="font-bold text-blue-500">{Math.round(weekMacros.protein / 7)}g</p>
                  <p className="text-xs text-muted-foreground">proteine/giorno</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Main Tabs */}
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="planner">
              <Calendar className="h-4 w-4 mr-2" />
              Pianificazione
            </TabsTrigger>
            <TabsTrigger value="recipes">
              <Utensils className="h-4 w-4 mr-2" />
              Ricette
            </TabsTrigger>
            <TabsTrigger value="shopping">
              <ShoppingCart className="h-4 w-4 mr-2" />
              Spesa
            </TabsTrigger>
          </TabsList>

          {/* PLANNER TAB */}
          <TabsContent value="planner" className="space-y-6">
            {/* Controls */}
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <Button
                  variant={viewMode === 'day' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('day')}
                >
                  Giorno
                </Button>
                <Button
                  variant={viewMode === 'week' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('week')}
                >
                  Settimana
                </Button>
                <Button
                  variant={viewMode === 'month' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('month')}
                >
                  Mese
                </Button>
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Vista:</span>
                <select 
                  className="px-3 py-1.5 rounded-md border bg-background text-sm"
                  value={futureDays}
                  onChange={(e) => {
                    const days = parseInt(e.target.value) as 7 | 14 | 30;
                    setFutureDays(days);
                    getWeatherForecast(days).then(w => {
                      setWeather(w);
                      generateNewPlan(w);
                    });
                  }}
                >
                  <option value={7}>Prossimi 7 giorni</option>
                  <option value={14}>Prossimi 14 giorni</option>
                  <option value={30}>Prossimi 30 giorni</option>
                </select>
                
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setShowMacros(!showMacros)}
                >
                  {showMacros ? 'Nascondi' : 'Mostra'} macros
                </Button>
                
                <Button 
                  onClick={regeneratePlan} 
                  variant="outline" 
                  size="sm"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Rigenera
                </Button>
              </div>
            </div>

            {/* Weather Forecast */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2">
              {weather.slice(0, viewMode === 'day' ? 1 : viewMode === 'week' ? 7 : 7).map((w, idx) => (
                <Card key={w.date} className={idx === 0 ? 'border-orange-500/50' : ''}>
                  <CardContent className="p-3 text-center">
                    <p className="text-xs text-muted-foreground capitalize mb-1">
                      {idx === 0 ? 'Oggi' : new Date(w.date).toLocaleDateString('it-IT', { weekday: 'short' })}
                    </p>
                    <div className="flex justify-center mb-1">{getWeatherIcon(w.condition)}</div>
                    <p className="text-sm font-medium">{w.temp}°C</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* DAY VIEW */}
            {viewMode === 'day' && (
              <div className="space-y-4">
                {mealPlan.slice(0, 1).map((day) => {
                  const date = new Date(day.date);
                  const macros = calculateDayMacros(day);
                  
                  return (
                    <div key={day.date} className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold">
                          {date.toLocaleDateString('it-IT', { weekday: 'long', day: 'numeric', month: 'long' })}
                        </h2>
                        {showMacros && (
                          <div className="flex items-center gap-4 text-sm">
                            <span className="text-orange-500 font-medium">{macros.calories} kcal</span>
                            <span className="text-blue-500 font-medium">{macros.protein}g proteine</span>
                          </div>
                        )}
                      </div>
                      
                      {(['breakfast', 'lunch', 'dinner'] as const).map((mealType) => {
                        const meal = day[mealType];
                        if (!meal) return null;
                        
                        return (
                          <Card key={mealType} className={day.locked?.[mealType] ? 'border-orange-500/50' : ''}>
                            <CardContent className="p-4">
                              <div className="flex items-start justify-between">
                                <div className="flex items-start gap-4">
                                  <div className={`p-3 rounded-lg ${getMealColor(mealType)}`}>
                                    <Clock className="h-5 w-5" />
                                    <p className="text-xs font-medium mt-1">{getMealTime(mealType)}</p>
                                  </div>
                                  
                                  <div>
                                    <Badge className={getMealColor(mealType)}>{getMealLabel(mealType)}</Badge>
                                    <h3 className="font-semibold text-lg mt-1">{meal.name}</h3>
                                    <div className="flex items-center gap-3 mt-2 text-sm text-muted-foreground">
                                      <span className="flex items-center gap-1">
                                        <Clock className="h-4 w-4" />
                                        {meal.prepTime} min
                                      </span>
                                      {meal.macros && (
                                        <>
                                          <span>{meal.macros.calories} kcal</span>
                                          <span>{meal.macros.protein}g proteine</span>
                                        </>
                                      )}
                                    </div>
                                  </div>
                                </div>
                                
                                <div className="flex items-center gap-2">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => toggleLock(day.date, mealType)}
                                  >
                                    {day.locked?.[mealType] ? (
                                      <Lock className="h-4 w-4 text-orange-500" />
                                    ) : (
                                      <Unlock className="h-4 w-4 text-muted-foreground" />
                                    )}
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => openSwapModal(day, mealType)}
                                  >
                                    <Shuffle className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setSelectedRecipe(meal)}
                                  >
                                    <Info className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            )}

            {/* WEEK VIEW */}
            {viewMode === 'week' && (
              <div className="space-y-4">
                {mealPlan.slice(0, 7).map((day) => {
                  const date = new Date(day.date);
                  const isToday = new Date().toISOString().split('T')[0] === day.date;
                  const macros = calculateDayMacros(day);
                  const isExpanded = expandedDays.has(day.date);
                  
                  return (
                    <Card key={day.date} className={isToday ? 'border-orange-500/50 bg-orange-500/5' : ''}>
                      <CardContent className="p-4">
                        <div 
                          className="flex items-center justify-between cursor-pointer"
                          onClick={() => toggleDayExpanded(day.date)}
                        >
                          <div className="flex items-center gap-4">
                            <div className="text-center min-w-[60px]">
                              <p className="text-sm text-muted-foreground capitalize">
                                {date.toLocaleDateString('it-IT', { weekday: 'short' })}
                              </p>
                              <p className="text-xl font-bold">{date.getDate()}</p>
                            </div>
                            
                            <div className="h-10 w-px bg-border" />
                            
                            <div className="flex items-center gap-4">
                              <div className="text-sm">
                                <span className="text-muted-foreground">Colazione:</span>{' '}
                                <span className="font-medium">{day.breakfast?.name}</span>
                              </div>
                              <div className="text-sm">
                                <span className="text-muted-foreground">Pranzo:</span>{' '}
                                <span className="font-medium">{day.lunch?.name}</span>
                              </div>
                              <div className="text-sm">
                                <span className="text-muted-foreground">Cena:</span>{' '}
                                <span className="font-medium">{day.dinner?.name}</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-4">
                            {showMacros && (
                              <div className="hidden md:flex items-center gap-3 text-sm">
                                <span className="text-orange-500">{macros.calories}</span>
                                <span className="text-blue-500">{macros.protein}g</span>
                              </div>
                            )}
                            {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                          </div>
                        </div>
                        
                        {isExpanded && (
                          <div className="mt-4 pt-4 border-t space-y-3">
                            {(['breakfast', 'lunch', 'dinner'] as const).map((mealType) => {
                              const meal = day[mealType];
                              if (!meal) return null;
                              
                              return (
                                <div key={mealType} className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg">
                                  <div className="flex items-center gap-3">
                                    <Badge className={getMealColor(mealType)}>{getMealLabel(mealType)}</Badge>
                                    <span className="font-medium">{meal.name}</span>
                                    <span className="text-sm text-muted-foreground">{meal.prepTime} min</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => toggleLock(day.date, mealType)}
                                    >
                                      {day.locked?.[mealType] ? (
                                        <Lock className="h-4 w-4 text-orange-500" />
                                      ) : (
                                        <Unlock className="h-4 w-4 text-muted-foreground" />
                                      )}
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => openSwapModal(day, mealType)}
                                    >
                                      <Shuffle className="h-4 w-4" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => setSelectedRecipe(meal)}
                                    >
                                      <Info className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}

            {/* MONTH VIEW */}
            {viewMode === 'month' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {mealPlan.map((day) => {
                    const date = new Date(day.date);
                    const isToday = new Date().toISOString().split('T')[0] === day.date;
                    const macros = calculateDayMacros(day);
                    
                    return (
                      <Card key={day.date} className={isToday ? 'border-orange-500/50 bg-orange-500/5' : ''}>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-3">
                            <div>
                              <p className="text-sm text-muted-foreground capitalize">
                                {date.toLocaleDateString('it-IT', { weekday: 'long' })}
                              </p>
                              <p className="text-xl font-bold">{date.getDate()}</p>
                            </div>
                            {showMacros && (
                              <div className="text-right text-xs">
                                <p className="text-orange-500 font-medium">{macros.calories} kcal</p>
                                <p className="text-blue-500">{macros.protein}g</p>
                              </div>
                            )}
                          </div>
                          
                          <div className="space-y-2">
                            {(['breakfast', 'lunch', 'dinner'] as const).map((mealType) => {
                              const meal = day[mealType];
                              if (!meal) return null;
                              
                              return (
                                <div key={mealType} className="flex items-center gap-2 text-sm">
                                  <span className={`w-2 h-2 rounded-full ${
                                    mealType === 'breakfast' ? 'bg-amber-500' :
                                    mealType === 'lunch' ? 'bg-green-500' : 'bg-indigo-500'
                                  }`} />
                                  <span className="truncate flex-1">{meal.name}</span>
                                  {day.locked?.[mealType] && <Lock className="h-3 w-3 text-orange-500" />}
                                </div>
                              );
                            })}
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Quick Actions */}
            <div className="flex flex-wrap gap-4">
              <Button onClick={() => generateShoppingListForRange(7)} variant="outline">
                <List className="h-4 w-4 mr-2" />
                Lista spesa settimanale
              </Button>
              <Button onClick={() => generateShoppingListForRange(futureDays)} variant="outline">
                <ShoppingCart className="h-4 w-4 mr-2" />
                Lista spesa completa
              </Button>
            </div>
          </TabsContent>

          {/* RECIPES TAB */}
          <TabsContent value="recipes" className="space-y-6">
            <div className="flex flex-wrap gap-4 items-center justify-between">
              <h2 className="text-xl font-semibold">Catalogo Ricette ({filteredRecipes.length})</h2>
              
              <div className="flex gap-2">
                <select 
                  className="px-3 py-2 rounded-md border bg-background"
                  value={mealTypeFilter}
                  onChange={(e) => setMealTypeFilter(e.target.value as any)}
                >
                  <option value="all">Tutti i pasti</option>
                  <option value="breakfast">Colazione</option>
                  <option value="lunch">Pranzo</option>
                  <option value="dinner">Cena</option>
                </select>
                
                <select 
                  className="px-3 py-2 rounded-md border bg-background"
                  value={tagFilter}
                  onChange={(e) => setTagFilter(e.target.value)}
                >
                  <option value="all">Tutti i tag</option>
                  {allTags.map(tag => (
                    <option key={tag} value={tag}>{tag}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredRecipes.map(recipe => (
                <Card 
                  key={recipe.id} 
                  className="cursor-pointer hover:border-orange-500/50 transition-colors"
                  onClick={() => setSelectedRecipe(recipe)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <Badge className={getMealColor(recipe.mealType || 'dinner')}>
                        {getMealLabel(recipe.mealType || 'dinner')}
                      </Badge>
                      {recipe.tags.includes('protein') && (
                        <Badge variant="outline" className="text-blue-500 text-xs">Proteica</Badge>
                      )}
                    </div>
                    
                    <h3 className="font-semibold mb-3">{recipe.name}</h3>
                    
                    <div className="flex items-center gap-3 text-sm text-muted-foreground mb-3">
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {recipe.prepTime} min
                      </span>
                      <span className="flex items-center gap-1">
                        <Flame className="h-4 w-4" />
                        {recipe.difficulty === 'easy' ? 'Facile' : 
                         recipe.difficulty === 'medium' ? 'Media' : 'Difficile'}
                      </span>
                    </div>
                    
                    {recipe.macros && (
                      <div className="text-xs text-muted-foreground mb-3">
                        {recipe.macros.calories} kcal • {recipe.macros.protein}g proteine • {recipe.macros.carbs}g carbs
                      </div>
                    )}
                    
                    <div className="flex flex-wrap gap-1">
                      {recipe.tags.slice(0, 4).map(tag => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* SHOPPING TAB */}
          <TabsContent value="shopping" className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <h2 className="text-xl font-semibold">Lista della Spesa</h2>
              <div className="flex gap-2">
                <Button onClick={() => generateShoppingListForRange(7)} variant="outline" size="sm">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Settimana
                </Button>
                <Button onClick={() => generateShoppingListForRange(futureDays)} variant="outline" size="sm">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Tutto ({futureDays}gg)
                </Button>
              </div>
            </div>

            {shoppingItems.length === 0 ? (
              <Card className="p-8 text-center">
                <ShoppingCart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground mb-4">
                  Nessun elemento nella lista. Genera la lista dalla tua pianificazione.
                </p>
                <div className="flex justify-center gap-2">
                  <Button onClick={() => generateShoppingListForRange(7)} variant="outline">
                    Settimanale
                  </Button>
                  <Button onClick={() => generateShoppingListForRange(futureDays)}>
                    Completa
                  </Button>
                </div>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <ShoppingCart className="h-5 w-5" />
                    Lista della Spesa ({shoppingItems.length} elementi)
                  </CardTitle>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {groupShoppingListByAisle(shoppingItems).map(({ aisle, items: aisleItems }) => (
                    <div key={aisle} className="space-y-2">
                      <p className="text-sm font-semibold text-orange-600 dark:text-orange-400 px-2 border-b border-orange-500/20 pb-1">
                        {aisle}
                      </p>
                      
                      {aisleItems.map(item => (
                        <div 
                          key={item.id}
                          className="flex items-center gap-3 p-2 rounded-lg hover:bg-secondary/50 transition-colors"
                        >
                          <Checkbox 
                            checked={checkedItems.has(item.id)}
                            onCheckedChange={() => toggleShoppingItem(item.id)}
                          />
                          
                          <div className="flex-1">
                            <p className={checkedItems.has(item.id) ? 'line-through text-muted-foreground' : ''}>
                              {item.name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {item.amount} • {item.recipeName}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
