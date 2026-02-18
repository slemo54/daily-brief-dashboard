import { NextResponse } from 'next/server';
import { generateShoppingList, groupShoppingListByAisle, MealPlan } from '@/lib/meal-planner';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const planParam = searchParams.get('plan');
    
    let mealPlan: MealPlan[] = [];
    
    if (planParam) {
      try {
        mealPlan = JSON.parse(decodeURIComponent(planParam));
      } catch {
        return NextResponse.json(
          { error: 'Invalid meal plan format' },
          { status: 400 }
        );
      }
    }
    
    const items = generateShoppingList(mealPlan);
    const groupedByAisle = groupShoppingListByAisle(items);
    
    return NextResponse.json({
      items,
      groupedByAisle,
      totalItems: items.length,
      generatedAt: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to generate shopping list' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { mealPlan, excludeChecked } = body;
    
    const items = generateShoppingList(mealPlan);
    const groupedByAisle = groupShoppingListByAisle(items);
    
    return NextResponse.json({
      items,
      groupedByAisle,
      totalItems: items.length,
      excludeChecked,
      generatedAt: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to generate shopping list' },
      { status: 500 }
    );
  }
}
