import { WeatherData } from '@/lib/types';

export async function getWeatherData(): Promise<WeatherData> {
  try {
    // Verona coordinates
    const lat = 45.4384;
    const lon = 10.9916;
    
    const response = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&timezone=Europe/Rome`,
      { next: { revalidate: 300 } }
    );
    
    if (!response.ok) throw new Error('Weather API error');
    
    const data = await response.json();
    const current = data.current;
    
    const weatherCodes: Record<number, { condition: string; icon: string }> = {
      0: { condition: 'Sereno', icon: '☀️' },
      1: { condition: 'Prevalentemente sereno', icon: '🌤️' },
      2: { condition: 'Parzialmente nuvoloso', icon: '⛅' },
      3: { condition: 'Nuvoloso', icon: '☁️' },
      45: { condition: 'Nebbia', icon: '🌫️' },
      48: { condition: 'Nebbia', icon: '🌫️' },
      51: { condition: 'Pioggerella', icon: '🌦️' },
      53: { condition: 'Pioggerella', icon: '🌦️' },
      55: { condition: 'Pioggerella', icon: '🌦️' },
      61: { condition: 'Pioggia', icon: '🌧️' },
      63: { condition: 'Pioggia', icon: '🌧️' },
      65: { condition: 'Pioggia', icon: '🌧️' },
      71: { condition: 'Neve', icon: '🌨️' },
      73: { condition: 'Neve', icon: '🌨️' },
      75: { condition: 'Neve', icon: '🌨️' },
      95: { condition: 'Temporale', icon: '⛈️' },
      96: { condition: 'Temporale', icon: '⛈️' },
      99: { condition: 'Temporale', icon: '⛈️' },
    };
    
    const weatherInfo = weatherCodes[current.weather_code] || { condition: 'Sconosciuto', icon: '❓' };
    
    return {
      temp: Math.round(current.temperature_2m),
      condition: weatherInfo.condition,
      humidity: current.relative_humidity_2m,
      wind: Math.round(current.wind_speed_10m),
      icon: weatherInfo.icon,
    };
  } catch (error) {
    console.error('Error fetching weather:', error);
    return {
      temp: 15,
      condition: 'Dati non disponibili',
      humidity: 60,
      wind: 5,
      icon: '❓',
    };
  }
}
