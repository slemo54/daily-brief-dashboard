'use client';

import { useState, useEffect } from 'react';
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
  Sun,
  CloudRain,
  Wind,
  ArrowLeft,
  RefreshCw,
  CheckCircle2,
  Circle
} from 'lucide-react';
import Link from 'next/link';
import { 
  Recipe, 
  MealPlan, 
  ShoppingItem, 
  WeatherForecast,
  generateWeeklyMealPlan,
  getRecipes,
  getRecipesByTag,
  getWeatherForecast,
  generateShoppingList,
  groupShoppingListByAisle,
  saveMealPlan,
  loadMealPlan,
  saveShoppingListState,
  loadShoppingListState
} from '@/lib/meal-planner';

export default function MealPlannerPage() {
  const [activeTab, setActiveTab] = useState('weekly');
  const [mealPlan, setMealPlan] = useState<MealPlan[]>([]);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [shoppingItems, setShoppingItems] = useState<ShoppingItem[]>([]);
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());
  const [weather, setWeather] = useState<WeatherForecast[]>([]);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [tagFilter, setTagFilter] = useState<string>('all');

  useEffect(() => {
    initializeData();
  }, []);

  async function initializeData() {
    const allRecipes = getRecipes();
    setRecipes(allRecipes);
    
    const weatherData = await getWeatherForecast(7);
    setWeather(weatherData);
    
    // Carica piano salvato o genera nuovo
    const savedPlan = loadMealPlan();
    if (savedPlan) {
      setMealPlan(savedPlan);
    } else {
      const newPlan = generateWeeklyMealPlan(weatherData);
      setMealPlan(newPlan);
      saveMealPlan(newPlan);
    }
    
    // Carica stato shopping list
    const savedShopping = loadShoppingListState();
    if (savedShopping) {
      setCheckedItems(new Set(savedShopping.checkedItems));
    }
  }

  function regeneratePlan() {
    const newPlan = generateWeeklyMealPlan(weather);
    setMealPlan(newPlan);
    saveMealPlan(newPlan);
  }

  function getShoppingList() {
    const items = generateShoppingList(mealPlan);
    setShoppingItems(items);
    return items;
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

  const filteredRecipes = recipes.filter(recipe => {
    if (tagFilter !== 'all' && !recipe.tags.includes(tagFilter)) return false;
    return true;
  });

  const allTags = Array.from(new Set(recipes.flatMap(r => r.tags)));

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
            <div className="h-48 bg-gradient-to-r from-orange-500/20 to-red-500/20 flex items-center justify-center">
              <Utensils className="h-16 w-16 text-orange-500/50" />
            </div>
            
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20">
      {/* Header */}
      <header className="border-b border-border/50 bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
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
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="weekly">
              <Calendar className="h-4 w-4 mr-2" />
              Settimana
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

          {/* Weekly View */}
          <TabsContent value="weekly" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Piano Settimanale</h2>
              <Button onClick={regeneratePlan} variant="outline" size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                Rigenera
              </Button>
            </div>

            {/* Weather Forecast */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {weather.slice(0, 3).map((w, idx) => (
                <Card key={w.date} className={idx === 0 ? 'border-orange-500/50' : ''}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">
                        {idx === 0 ? 'Oggi' : new Date(w.date).toLocaleDateString('it-IT', { weekday: 'long' })}
                      </span>
                      <span className="text-2xl">{w.icon}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>{w.temp}°C</span>
                    </div>
                    
                    {w.suggestion && (
                      <p className="text-xs mt-2 text-orange-600 dark:text-orange-400">
                        {w.suggestion}
                      </p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Weekly Meal Plan */}
            <div className="grid gap-4">
              {mealPlan.map((day) => {
                const date = new Date(day.date);
                const isToday = new Date().toISOString().split('T')[0] === day.date;
                
                return (
                  <Card key={day.date} className={isToday ? 'border-orange-500/50 bg-orange-500/5' : ''}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="text-center min-w-[60px]">
                            <p className="text-sm text-muted-foreground capitalize">
                              {date.toLocaleDateString('it-IT', { weekday: 'short' })}
                            </p>
                            <p className="text-xl font-bold">
                              {date.getDate()}
                            </p>
                          </div>
                          
                          <div className="h-10 w-px bg-border" />
                          
                          <div>
                            <p className="font-medium">{day.dinner?.name}</p>
                            <div className="flex items-center gap-2 mt-1">
                              {day.dinner && (
                                <>
                                  <Badge variant="outline" className="text-xs">
                                    <Clock className="h-3 w-3 mr-1" />
                                    {day.dinner.prepTime} min
                                  </Badge>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        {day.dinner && (
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => setSelectedRecipe(day.dinner!)}
                          >
                            Dettagli
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          {/* Recipes Catalog */}
          <TabsContent value="recipes" className="space-y-6">
            <div className="flex flex-wrap gap-4 items-center justify-between">
              <h2 className="text-xl font-semibold">Catalogo Ricette ({filteredRecipes.length})</h2>
              
              <div className="flex gap-2">
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

          {/* Shopping List */}
          <TabsContent value="shopping" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Lista della Spesa</h2>
              <Button onClick={getShoppingList} variant="outline" size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                Genera dalla pianificazione
              </Button>
            </div>

            {shoppingItems.length === 0 ? (
              <Card className="p-8 text-center">
                <ShoppingCart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  Nessun elemento nella lista. Genera la lista dalla tua pianificazione settimanale.
                </p>
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
