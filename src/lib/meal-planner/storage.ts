import { MealPlan } from './types';

const MEAL_PLAN_KEY = 'meal-planner-plan';
const SHOPPING_LIST_KEY = 'meal-planner-shopping';

export function saveMealPlan(plan: MealPlan[]): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(MEAL_PLAN_KEY, JSON.stringify(plan));
  }
}

export function loadMealPlan(): MealPlan[] | null {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem(MEAL_PLAN_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  }
  return null;
}

export function clearMealPlan(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(MEAL_PLAN_KEY);
  }
}

export interface ShoppingListState {
  checkedItems: string[];
  lastUpdated: string;
}

export function saveShoppingListState(state: ShoppingListState): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(SHOPPING_LIST_KEY, JSON.stringify(state));
  }
}

export function loadShoppingListState(): ShoppingListState | null {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem(SHOPPING_LIST_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  }
  return null;
}

export function clearShoppingListState(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(SHOPPING_LIST_KEY);
  }
}
