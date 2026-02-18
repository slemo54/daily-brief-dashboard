import { WeatherData } from '@/lib/types';

export interface Recipe {
  id: string;
  name: string;
  chef: 'me' | 'wife';
  prepTime: number;
  difficulty: 'easy' | 'medium' | 'hard';
  tags: string[];
  ingredients: Ingredient[];
  instructions: string[];
  weatherSuitable: ('sunny' | 'rainy' | 'cold' | 'hot' | 'cloudy')[];
  image?: string;
}

export interface Ingredient {
  name: string;
  amount: string;
  store: 'lidl' | 'migross' | 'esselunga' | 'any';
  aisle: string;
}

export interface MealPlan {
  date: string;
  lunch?: Recipe;
  dinner: Recipe;
  weather?: WeatherData;
}

export interface ShoppingItem extends Ingredient {
  id: string;
  checked: boolean;
  recipeId: string;
  recipeName: string;
}

export interface ShoppingList {
  store: string;
  items: ShoppingItem[];
}

export interface WeatherForecast {
  date: string;
  temp: number;
  condition: 'sunny' | 'rainy' | 'cloudy' | 'snowy';
  icon: string;
  suggestion?: string;
}
