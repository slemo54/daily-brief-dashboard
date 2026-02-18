import { NextResponse } from 'next/server';
import { getWeatherForecast, generateWeeklyMealPlan } from '@/lib/meal-planner';

// Questa route viene chiamata dai cron job di Vercel
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'morning'; // 'morning' | 'evening'
    
    const weather = await getWeatherForecast(2);
    const mealPlan = generateWeeklyMealPlan(weather);
    
    const today = new Date().toISOString().split('T')[0];
    const todayMeal = mealPlan.find(m => m.date === today);
    const tomorrowMeal = mealPlan[1];
    
    let message = '';
    let meal = null;
    
    if (type === 'morning') {
      // Reminder mattina (8:00) - pasto di oggi
      meal = todayMeal?.dinner;
      message = meal 
        ? `🍽️ Oggi a cena: ${meal.name}\n👨‍🍳 Chef: ${meal.chef === 'me' ? 'Tu' : 'Moglie'}\n⏱️ Tempo: ${meal.prepTime} min`
        : 'Nessun pasto pianificato per oggi';
    } else {
      // Reminder sera (18:00) - pasto di domani
      meal = tomorrowMeal?.dinner;
      message = meal
        ? `🍽️ Domani a cena: ${meal.name}\n👨‍🍳 Chef: ${meal.chef === 'me' ? 'Tu' : 'Moglie'}\n⏱️ Tempo: ${meal.prepTime} min\n\nPrepara gli ingredienti!`
        : 'Nessun pasto pianificato per domani';
    }
    
    // Qui si potrebbe integrare con un servizio di notifiche
    // come Pushover, Telegram, o email
    
    return NextResponse.json({
      type,
      message,
      meal,
      timestamp: new Date().toISOString(),
      sent: true,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to send reminder' },
      { status: 500 }
    );
  }
}
