import { NextResponse } from 'next/server';
import { generateWeeklyMealPlan, getWeatherForecast, MealPlan } from '@/lib/meal-planner';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const days = parseInt(searchParams.get('days') || '7', 10);
    
    const weather = await getWeatherForecast(days);
    const mealPlan = generateWeeklyMealPlan(weather);
    
    return NextResponse.json({
      plan: mealPlan,
      weather,
      generatedAt: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to generate meal plan' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { preferences, exclusions } = body;
    
    // Qui si potrebbe implementare logica più complessa
    // per generare un piano personalizzato basato sulle preferenze
    
    const weather = await getWeatherForecast(7);
    const mealPlan = generateWeeklyMealPlan(weather);
    
    return NextResponse.json({
      plan: mealPlan,
      weather,
      preferences,
      generatedAt: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to generate custom meal plan' },
      { status: 500 }
    );
  }
}
