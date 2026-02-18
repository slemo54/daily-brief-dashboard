import { WeatherForecast } from './types';

export async function getWeatherForecast(days: number = 3): Promise<WeatherForecast[]> {
  try {
    // In produzione, usa un'API meteo reale come OpenWeatherMap
    // Per ora simuliamo dati realistici
    const today = new Date();
    const forecasts: WeatherForecast[] = [];
    
    const conditions: ('sunny' | 'rainy' | 'cloudy' | 'snowy')[] = ['sunny', 'cloudy', 'rainy', 'sunny'];
    const suggestions: Record<string, string> = {
      sunny: '☀️ Sole previsto → Perfetto per grigliata!',
      cloudy: '☁️ Nuvoloso → Ottimo per una zuppa calda',
      rainy: '🌧️ Pioggia prevista → Comfort food ideale',
      snowy: '❄️ Neve → Stufato o brasato perfetto',
    };
    
    for (let i = 0; i < days; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      
      // Simula dati meteo (in produzione fetch da API)
      const condition = conditions[Math.floor(Math.random() * conditions.length)];
      
      forecasts.push({
        date: date.toISOString().split('T')[0],
        temp: Math.floor(Math.random() * 15) + 10, // 10-25°C
        condition,
        icon: getWeatherIcon(condition),
        suggestion: suggestions[condition],
      });
    }
    
    return forecasts;
  } catch (error) {
    console.error('Error fetching weather:', error);
    return [];
  }
}

function getWeatherIcon(condition: string): string {
  const icons: Record<string, string> = {
    sunny: '☀️',
    cloudy: '☁️',
    rainy: '🌧️',
    snowy: '❄️',
  };
  return icons[condition] || '☁️';
}

export function getWeatherSuggestion(weather: WeatherForecast): string {
  const suggestions: Record<string, string[]> = {
    sunny: [
      '☀️ Sole splendente → Perfetto per una grigliata!',
      '🔥 Bel tempo → Pizza o cibi alla griglia',
      '☀️ Giornata calda → Insalata e piatti freschi',
    ],
    cloudy: [
      '☁️ Nuvoloso → Ottimo per una pasta calda',
      '🌤️ Coperto → Comfort food italiano',
      '☁️ Giornata grigia → Risotto o minestra',
    ],
    rainy: [
      '🌧️ Pioggia → Zuppa calda e avvolgente',
      '☔ Tempo umido → Stufato o brasato',
      '🌧️ Giornata piovosa → Pasta al forno',
    ],
    snowy: [
      '❄️ Neve → Polenta con brasato',
      '☃️ Freddo intenso → Minestrone caldo',
      '❄️ Nevicata → Zuppa di legumi',
    ],
  };
  
  const weatherSuggestions = suggestions[weather.condition] || suggestions.cloudy;
  return weatherSuggestions[Math.floor(Math.random() * weatherSuggestions.length)];
}
