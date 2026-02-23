import { Recipe, MealPlan, ShoppingItem, WeatherForecast } from './types';

// RICETTE REALI DI ANSELMO - 1 persona, 30-35€/settimana
// Focus: budget-conscious, ingredienti da Migross (freschi) e Lidl (dispensa)
// Struttura: Colazione (8:00) + Pranzo (13:00) + Cena (20:00)
// Adattate per atleta 190cm/85kg - porzioni aumentate dove necessario

export const recipes: Recipe[] = [
  // ========== COLAZIONE (8:00) ==========
  {
    id: 'colazione-pancake',
    name: 'Pancake (3 pezzi)',
    chef: 'me',
    prepTime: 15,
    difficulty: 'easy',
    tags: ['colazione', 'sweet', 'quick', 'budget'],
    mealType: 'breakfast',
    macros: { protein: 12, carbs: 45, fats: 15, calories: 380 },
    ingredients: [
      { name: 'Farina', amount: '1/2 tazza (75g)', store: 'Lidl', aisle: 'Panetteria' },
      { name: 'Lievito in polvere', amount: '1 cucchiaino', store: 'Lidl', aisle: 'Panetteria' },
      { name: 'Bicarbonato', amount: 'pizzico', store: 'Lidl', aisle: 'Panetteria' },
      { name: 'Zucchero', amount: '1 cucchiaio', store: 'Lidl', aisle: 'Panetteria' },
      { name: 'Sale', amount: 'pizzico', store: 'Lidl', aisle: 'Condimenti' },
      { name: 'Latte', amount: '1/4 tazza (60ml)', store: 'Migross', aisle: 'Latticini' },
      { name: 'Uova', amount: '1', store: 'Migross', aisle: 'Latticini' },
      { name: 'Olio', amount: '1 cucchiaio', store: 'Lidl', aisle: 'Oli' },
      { name: 'Vaniglia', amount: '1/2 cucchiaino', store: 'Lidl', aisle: 'Dolci' },
    ],
    instructions: [
      'Mescolare farina, lievito, bicarbonato, zucchero e sale',
      'In un\'altra ciotola sbattere uovo, latte, olio e vaniglia',
      'Unire gli ingredienti secchi a quelli liquidi',
      'Cuocere in padella antiaderente 2-3 minuti per lato',
      'Varianti: aggiungere banana, mirtilli o cannella'
    ],
    weatherSuitable: ['sunny', 'cloudy', 'cold', 'hot'],
    notes: 'Conservazione: 2-3 giorni in frigo. Per atleta: raddoppiare la dose (6 pancake)'
  },
  {
    id: 'colazione-frittata',
    name: 'Frittata',
    chef: 'me',
    prepTime: 10,
    difficulty: 'easy',
    tags: ['colazione', 'protein', 'savory', 'portable', 'budget'],
    mealType: 'breakfast',
    macros: { protein: 18, carbs: 8, fats: 22, calories: 320 },
    ingredients: [
      { name: 'Uova', amount: '3', store: 'Migross', aisle: 'Latticini' },
      { name: 'Verdure a piacere', amount: 'q.b.', store: 'Migross', aisle: 'Ortofrutta' },
      { name: 'Olio', amount: '1 cucchiaio', store: 'Lidl', aisle: 'Oli' },
      { name: 'Sale e pepe', amount: 'q.b.', store: 'Lidl', aisle: 'Condimenti' },
    ],
    instructions: [
      'Sbattere le uova con sale e pepe',
      'Tagliare le verdure a pezzetti',
      'Scaldare l\'olio in padella',
      'Cuocere le verdure 3-4 minuti',
      'Versare le uova e cuocere 3-4 minuti per lato'
    ],
    weatherSuitable: ['sunny', 'cloudy', 'cold', 'hot'],
    notes: 'Buona anche fredda, perfetta per pranzo al lavoro'
  },

  // ========== PRANZO/CENA ==========
  {
    id: 'polenta-uovo',
    name: 'Polenta con Uovo',
    chef: 'me',
    prepTime: 15,
    difficulty: 'easy',
    tags: ['pranzo', 'cena', 'comfort', 'budget', 'quick'],
    mealType: 'lunch',
    macros: { protein: 14, carbs: 35, fats: 18, calories: 380 },
    ingredients: [
      { name: 'Farina per polenta', amount: '50g', store: 'Lidl', aisle: 'Cereali' },
      { name: 'Acqua', amount: '200ml', store: '-', aisle: '-' },
      { name: 'Uova', amount: '1', store: 'Migross', aisle: 'Latticini' },
      { name: 'Olio', amount: '1 cucchiaio', store: 'Lidl', aisle: 'Oli' },
      { name: 'Sale', amount: 'q.b.', store: 'Lidl', aisle: 'Condimenti' },
    ],
    instructions: [
      'Portare l\'acqua a bollore con sale',
      'Versare la farina a pioggia mescolando',
      'Cuocere 8-10 minuti mescolando',
      'Friggere o cuocere l\'uovo in camicia',
      'Servire l\'uovo sulla polenta calda'
    ],
    weatherSuitable: ['cold', 'rainy', 'cloudy'],
    notes: 'Per atleta: aggiungere formaggio grattugiato'
  },
  {
    id: 'tacos-pollo',
    name: 'Tacos di Pollo',
    chef: 'me',
    prepTime: 20,
    difficulty: 'easy',
    tags: ['pranzo', 'cena', 'protein', 'mexican', 'budget'],
    mealType: 'lunch',
    macros: { protein: 35, carbs: 30, fats: 15, calories: 420 },
    ingredients: [
      { name: 'Petto di pollo', amount: '200g', store: 'Migross', aisle: 'Carne' },
      { name: 'Tortillas', amount: '2', store: 'Lidl', aisle: 'Panetteria' },
      { name: 'Paprika', amount: '1 cucchiaino', store: 'Lidl', aisle: 'Spezie' },
      { name: 'Cumino', amount: '1/2 cucchiaino', store: 'Lidl', aisle: 'Spezie' },
      { name: 'Aglio', amount: '1 spicchio', store: 'Migross', aisle: 'Ortofrutta' },
      { name: 'Cipolla', amount: '1/2', store: 'Migross', aisle: 'Ortofrutta' },
      { name: 'Olio', amount: '1 cucchiaio', store: 'Lidl', aisle: 'Oli' },
    ],
    instructions: [
      'Tagliare il pollo a strisce sottili',
      'Mescolare paprika, cumino e sale',
      'Insaporire il pollo con le spezie',
      'Soffriggere aglio e cipolla, aggiungere pollo',
      'Cuocere 8-10 minuti e servire nelle tortillas'
    ],
    weatherSuitable: ['sunny', 'hot'],
    notes: 'Per atleta: aggiungere fagioli neri'
  },
  {
    id: 'pasta-fagioli',
    name: 'Pasta e Fagioli',
    chef: 'me',
    prepTime: 25,
    difficulty: 'easy',
    tags: ['pranzo', 'cena', 'comfort', 'budget', 'italian'],
    mealType: 'lunch',
    macros: { protein: 18, carbs: 65, fats: 12, calories: 480 },
    ingredients: [
      { name: 'Pasta', amount: '100g', store: 'Lidl', aisle: 'Pasta' },
      { name: 'Fagioli borlotti', amount: '1 scatola (240g)', store: 'Lidl', aisle: 'Conserve' },
      { name: 'Passata di pomodoro', amount: '200g', store: 'Lidl', aisle: 'Conserve' },
      { name: 'Cipolla', amount: '1/2', store: 'Migross', aisle: 'Ortofrutta' },
      { name: 'Aglio', amount: '1 spicchio', store: 'Migross', aisle: 'Ortofrutta' },
      { name: 'Olio', amount: '2 cucchiai', store: 'Lidl', aisle: 'Oli' },
      { name: 'Rosmarino', amount: 'q.b.', store: 'Lidl', aisle: 'Spezie' },
    ],
    instructions: [
      'Soffriggere cipolla e aglio nell\'olio',
      'Aggiungere passata e cuocere 10 minuti',
      'Aggiungere fagioli scolati e rosmarino',
      'Cuocere la pasta al dente',
      'Mantecare tutto insieme e servire'
    ],
    weatherSuitable: ['cold', 'rainy', 'cloudy'],
    notes: 'Per atleta: aumentare pasta a 120g'
  },
  {
    id: 'tortilla-spagnola',
    name: 'Tortilla Spagnola',
    chef: 'me',
    prepTime: 25,
    difficulty: 'easy',
    tags: ['pranzo', 'cena', 'protein', 'spanish', 'budget'],
    mealType: 'dinner',
    macros: { protein: 16, carbs: 30, fats: 20, calories: 380 },
    ingredients: [
      { name: 'Uova', amount: '3', store: 'Migross', aisle: 'Latticini' },
      { name: 'Patate', amount: '2 medie (200g)', store: 'Migross', aisle: 'Ortofrutta' },
      { name: 'Cipolla', amount: '1', store: 'Migross', aisle: 'Ortofrutta' },
      { name: 'Olio', amount: '3 cucchiai', store: 'Lidl', aisle: 'Oli' },
      { name: 'Sale', amount: 'q.b.', store: 'Lidl', aisle: 'Condimenti' },
    ],
    instructions: [
      'Tagliare patate e cipolla a fette sottili',
      'Friggere le patate e cipolla nell\'olio fino a doratura',
      'Scolare e lasciare intiepidire',
      'Sbattere le uova e unire alle verdure',
      'Cuocere in padella 3-4 minuti per lato'
    ],
    weatherSuitable: ['sunny', 'cloudy', 'cold'],
    notes: 'Per atleta: aggiungere 1 uova in più'
  },
  {
    id: 'pollo-speziato',
    name: 'Pollo Speziato',
    chef: 'me',
    prepTime: 20,
    difficulty: 'easy',
    tags: ['pranzo', 'cena', 'protein', 'low-carb', 'budget'],
    mealType: 'dinner',
    macros: { protein: 40, carbs: 5, fats: 12, calories: 320 },
    ingredients: [
      { name: 'Petto di pollo', amount: '250g', store: 'Migross', aisle: 'Carne' },
      { name: 'Limone', amount: '1/2', store: 'Migross', aisle: 'Ortofrutta' },
      { name: 'Paprika', amount: '1 cucchiaino', store: 'Lidl', aisle: 'Spezie' },
      { name: 'Aglio', amount: '2 spicchi', store: 'Migross', aisle: 'Ortofrutta' },
      { name: 'Olio', amount: '2 cucchiai', store: 'Lidl', aisle: 'Oli' },
      { name: 'Sale e pepe', amount: 'q.b.', store: 'Lidl', aisle: 'Condimenti' },
    ],
    instructions: [
      'Tagliare il pollo a strisce o fette',
      'Marinare con limone, paprika, aglio, sale e pepe per 15 min',
      'Scaldare l\'olio in padella',
      'Cuocere il pollo 5-6 minuti per lato',
      'Servire caldo con contorno di verdure'
    ],
    weatherSuitable: ['sunny', 'hot', 'cloudy'],
    notes: 'Per atleta: aumentare a 300g di pollo'
  },
  {
    id: 'tostadas-fagioli',
    name: 'Tostadas di Fagioli',
    chef: 'me',
    prepTime: 15,
    difficulty: 'easy',
    tags: ['pranzo', 'cena', 'vegetarian', 'mexican', 'budget'],
    mealType: 'dinner',
    macros: { protein: 15, carbs: 45, fats: 12, calories: 380 },
    ingredients: [
      { name: 'Tortillas', amount: '2', store: 'Lidl', aisle: 'Panetteria' },
      { name: 'Fagioli neri', amount: '1 scatola (240g)', store: 'Lidl', aisle: 'Conserve' },
      { name: 'Cipolla', amount: '1/2', store: 'Migross', aisle: 'Ortofrutta' },
      { name: 'Olio', amount: '2 cucchiai', store: 'Lidl', aisle: 'Oli' },
      { name: 'Sale', amount: 'q.b.', store: 'Lidl', aisle: 'Condimenti' },
      { name: 'Peperoncino', amount: 'q.b.', store: 'Lidl', aisle: 'Spezie' },
    ],
    instructions: [
      'Tostare le tortillas in padella senza olio fino a croccantezza',
      'Schiacciare i fagioli con una forchetta',
      'Soffriggere cipolla nell\'olio',
      'Aggiungere fagioli e cuocere 5 minuti',
      'Spalmare su tortillas tostate e servire'
    ],
    weatherSuitable: ['sunny', 'hot'],
    notes: 'Per atleta: aggiungere formaggio grattugiato'
  },
  {
    id: 'quesadillas',
    name: 'Quesadillas',
    chef: 'me',
    prepTime: 10,
    difficulty: 'easy',
    tags: ['pranzo', 'cena', 'vegetarian', 'mexican', 'budget', 'quick'],
    mealType: 'dinner',
    macros: { protein: 20, carbs: 35, fats: 25, calories: 450 },
    ingredients: [
      { name: 'Tortillas', amount: '2', store: 'Lidl', aisle: 'Panetteria' },
      { name: 'Formaggio grattugiato', amount: '100g', store: 'Migross', aisle: 'Formaggi' },
      { name: 'Olio', amount: '1 cucchiaio', store: 'Lidl', aisle: 'Oli' },
    ],
    instructions: [
      'Scaldare l\'olio in padella antiaderente',
      'Disporre una tortilla in padella',
      'Spargere il formaggio uniformemente',
      'Coprire con l\'altra tortilla',
      'Cuocere 2-3 min per lato fino a doratura, tagliare a spicchi'
    ],
    weatherSuitable: ['sunny', 'hot', 'cloudy'],
    notes: 'Per atleta: aggiungere petto di pollo a strisce'
  },
  {
    id: 'pollo-arrosto',
    name: 'Pollo Arrosto',
    chef: 'me',
    prepTime: 50,
    difficulty: 'easy',
    tags: ['pranzo', 'cena', 'protein', 'comfort', 'budget'],
    mealType: 'lunch',
    macros: { protein: 45, carbs: 0, fats: 18, calories: 380 },
    ingredients: [
      { name: 'Cosce di pollo', amount: '2 (400g)', store: 'Migross', aisle: 'Carne' },
      { name: 'Aglio', amount: '2 spicchi', store: 'Migross', aisle: 'Ortofrutta' },
      { name: 'Rosmarino', amount: 'q.b.', store: 'Lidl', aisle: 'Spezie' },
      { name: 'Olio', amount: '2 cucchiai', store: 'Lidl', aisle: 'Oli' },
      { name: 'Sale e pepe', amount: 'q.b.', store: 'Lidl', aisle: 'Condimenti' },
    ],
    instructions: [
      'Scaldare il forno a 180°C',
      'Insaporire le cosce con sale, pepe, aglio e rosmarino',
      'Disporre su teglia con un filo d\'olio',
      'Infornare per 45 minuti',
      'Lasciare riposare 5 minuti prima di servire'
    ],
    weatherSuitable: ['sunny', 'cloudy', 'cold', 'rainy'],
    notes: 'Per atleta: mangiare entrambe le cosce'
  },
  {
    id: 'uova-ranchero',
    name: 'Uova Ranchero',
    chef: 'me',
    prepTime: 15,
    difficulty: 'easy',
    tags: ['pranzo', 'cena', 'protein', 'mexican', 'budget'],
    mealType: 'dinner',
    macros: { protein: 18, carbs: 30, fats: 20, calories: 380 },
    ingredients: [
      { name: 'Tortillas', amount: '2', store: 'Lidl', aisle: 'Panetteria' },
      { name: 'Fagioli neri', amount: '1/2 scatola (120g)', store: 'Lidl', aisle: 'Conserve' },
      { name: 'Uova', amount: '2', store: 'Migross', aisle: 'Latticini' },
      { name: 'Passata di pomodoro', amount: '100g', store: 'Lidl', aisle: 'Conserve' },
      { name: 'Olio', amount: '2 cucchiai', store: 'Lidl', aisle: 'Oli' },
      { name: 'Cipolla', amount: '1/4', store: 'Migross', aisle: 'Ortofrutta' },
    ],
    instructions: [
      'Scaldare le tortillas in padella',
      'Preparare salsa con passata, cipolla e olio, cuocere 5 min',
      'Friggere le uova in padella',
      'Scaldare i fagioli',
      'Assemblare: tortilla, fagioli, uovo fritto, salsa pomodoro'
    ],
    weatherSuitable: ['sunny', 'cloudy', 'hot'],
    notes: 'Per atleta: aggiungere avocado se disponibile'
  },
  {
    id: 'risotto',
    name: 'Risotto',
    chef: 'me',
    prepTime: 30,
    difficulty: 'medium',
    tags: ['pranzo', 'cena', 'comfort', 'italian', 'budget'],
    mealType: 'lunch',
    macros: { protein: 12, carbs: 70, fats: 15, calories: 480 },
    ingredients: [
      { name: 'Riso Carnaroli', amount: '100g', store: 'Lidl', aisle: 'Riso' },
      { name: 'Brodo vegetale', amount: '500ml', store: 'Lidl', aisle: 'Brodi' },
      { name: 'Cipolla', amount: '1/2', store: 'Migross', aisle: 'Ortofrutta' },
      { name: 'Vino bianco', amount: '50ml (opzionale)', store: 'Lidl', aisle: 'Vini' },
      { name: 'Parmigiano', amount: '30g', store: 'Migross', aisle: 'Formaggi' },
      { name: 'Olio', amount: '1 cucchiaio', store: 'Lidl', aisle: 'Oli' },
      { name: 'Burro', amount: '20g', store: 'Migross', aisle: 'Latticini' },
    ],
    instructions: [
      'Soffriggere la cipolla nell\'olio',
      'Tostare il riso 2 minuti',
      'Sfumare con vino (opzionale)',
      'Aggiungere brodo caldo poco alla volta',
      'Cuocere 18 minuti, mantecare con burro e parmigiano'
    ],
    weatherSuitable: ['cold', 'rainy', 'cloudy'],
    notes: 'Per atleta: aggiungere pollo o funghi per più proteine'
  },
  {
    id: 'zuppa-verdure',
    name: 'Zuppa di Verdure',
    chef: 'me',
    prepTime: 30,
    difficulty: 'easy',
    tags: ['pranzo', 'cena', 'vegetarian', 'healthy', 'budget'],
    mealType: 'lunch',
    macros: { protein: 8, carbs: 35, fats: 8, calories: 250 },
    ingredients: [
      { name: 'Carote', amount: '2', store: 'Migross', aisle: 'Ortofrutta' },
      { name: 'Zucchine', amount: '2', store: 'Migross', aisle: 'Ortofrutta' },
      { name: 'Patate', amount: '2', store: 'Migross', aisle: 'Ortofrutta' },
      { name: 'Cipolla', amount: '1', store: 'Migross', aisle: 'Ortofrutta' },
      { name: 'Brodo vegetale', amount: '500ml', store: 'Lidl', aisle: 'Brodi' },
      { name: 'Olio', amount: '2 cucchiai', store: 'Lidl', aisle: 'Oli' },
      { name: 'Sale e pepe', amount: 'q.b.', store: 'Lidl', aisle: 'Condimenti' },
    ],
    instructions: [
      'Tagliare tutte le verdure a dadini',
      'Soffriggere cipolla nell\'olio',
      'Aggiungere le altre verdure e cuocere 5 min',
      'Coprire con brodo caldo',
      'Cuocere 20 minuti, frullare se desiderato'
    ],
    weatherSuitable: ['cold', 'rainy'],
    notes: 'Per atleta: aggiungere fagioli o pasta'
  },
  {
    id: 'riso-pollo',
    name: 'Riso con Pollo',
    chef: 'me',
    prepTime: 20,
    difficulty: 'easy',
    tags: ['pranzo', 'cena', 'protein', 'quick', 'budget'],
    mealType: 'lunch',
    macros: { protein: 35, carbs: 50, fats: 12, calories: 480 },
    ingredients: [
      { name: 'Riso', amount: '100g', store: 'Lidl', aisle: 'Riso' },
      { name: 'Petto di pollo', amount: '200g', store: 'Migross', aisle: 'Carne' },
      { name: 'Olio', amount: '2 cucchiai', store: 'Lidl', aisle: 'Oli' },
      { name: 'Sale e pepe', amount: 'q.b.', store: 'Lidl', aisle: 'Condimenti' },
    ],
    instructions: [
      'Cuocere il riso in acqua salata',
      'Tagliare il pollo a cubetti',
      'Cuocere il pollo in padella con olio',
      'Insaporire con sale e pepe',
      'Servire il pollo con il riso'
    ],
    weatherSuitable: ['sunny', 'cloudy', 'hot'],
    notes: 'Per atleta: aumentare pollo a 250g'
  },
];

// ========== MENU SETTIMANALE PREDEFINITO ==========
// Lunedì: Pancake (3pz) / Polenta+uovo / Tacos di pollo
// Martedì: Pancake avanzo / Pasta e fagioli / Frittata
// Mercoledì: Pancake (3pz) / Riso+pollo avanzo / Tortilla spagnola
// Giovedì: Pancake avanzo / Zuppa verdure / Pollo speziato
// Venerdì: Pancake (3pz) / Pasta avanzo / Tostadas fagioli
// Sabato: Frittata / Risotto / Quesadillas
// Domenica: Pancake speciale / Pollo arrosto / Uova ranchero

export const weeklyMenuPlan = [
  { day: 'Lunedì', breakfast: 'colazione-pancake', lunch: 'polenta-uovo', dinner: 'tacos-pollo' },
  { day: 'Martedì', breakfast: 'colazione-pancake', lunch: 'pasta-fagioli', dinner: 'colazione-frittata' },
  { day: 'Mercoledì', breakfast: 'colazione-pancake', lunch: 'riso-pollo', dinner: 'tortilla-spagnola' },
  { day: 'Giovedì', breakfast: 'colazione-pancake', lunch: 'zuppa-verdure', dinner: 'pollo-speziato' },
  { day: 'Venerdì', breakfast: 'colazione-pancake', lunch: 'pasta-fagioli', dinner: 'tostadas-fagioli' },
  { day: 'Sabato', breakfast: 'colazione-frittata', lunch: 'risotto', dinner: 'quesadillas' },
  { day: 'Domenica', breakfast: 'colazione-pancake', lunch: 'pollo-arrosto', dinner: 'uova-ranchero' },
];

// Helper functions
export function getRecipes(): Recipe[] {
  return recipes;
}

export function getRecipeById(id: string): Recipe | undefined {
  return recipes.find(r => r.id === id);
}

export function getRecipesByTag(tag: string): Recipe[] {
  return recipes.filter(r => r.tags.includes(tag));
}

export function getRecipesByMealType(mealType: 'breakfast' | 'lunch' | 'dinner'): Recipe[] {
  return recipes.filter(r => r.mealType === mealType);
}

export function getRecipesByWeather(weather: 'sunny' | 'rainy' | 'cold' | 'hot' | 'cloudy'): Recipe[] {
  return recipes.filter(r => r.weatherSuitable.includes(weather));
}

// Generate daily meal plan based on day of week (Anselmo's plan)
export function generateDailyMealPlan(weather: WeatherForecast, dayIndex: number = 0): {
  breakfast: Recipe;
  lunch: Recipe;
  dinner: Recipe;
} {
  const dayPlan = weeklyMenuPlan[dayIndex % 7];
  
  return {
    breakfast: getRecipeById(dayPlan.breakfast) || recipes[0],
    lunch: getRecipeById(dayPlan.lunch) || recipes[2],
    dinner: getRecipeById(dayPlan.dinner) || recipes[3],
  };
}

export function generateWeeklyMealPlan(weatherForecast: WeatherForecast[]): MealPlan[] {
  const today = new Date();
  const plan: MealPlan[] = [];
  
  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    const dateStr = date.toISOString().split('T')[0];
    
    const dayOfWeek = date.getDay(); // 0 = Domenica, 1 = Lunedì, ...
    const dayIndex = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Converti a 0 = Lunedì
    
    const weather = weatherForecast[i] || { condition: 'cloudy' };
    const dailyPlan = generateDailyMealPlan(weather, dayIndex);
    
    plan.push({
      date: dateStr,
      breakfast: dailyPlan.breakfast,
      lunch: dailyPlan.lunch,
      dinner: dailyPlan.dinner,
    });
  }
  
  return plan;
}

export function generateShoppingList(mealPlan: MealPlan[]): ShoppingItem[] {
  const items: Map<string, ShoppingItem> = new Map();
  
  mealPlan.forEach(day => {
    const meals = [day.breakfast, day.lunch, day.dinner].filter(Boolean);
    
    meals.forEach(recipe => {
      if (recipe) {
        recipe.ingredients.forEach(ing => {
          const key = `${ing.name}-${ing.store}`;
          if (!items.has(key)) {
            items.set(key, {
              ...ing,
              id: key,
              checked: false,
              recipeId: recipe.id,
              recipeName: recipe.name,
            });
          }
        });
      }
    });
  });
  
  return Array.from(items.values());
}

// Lista della spesa divisa per supermercato
export function groupShoppingListByStore(items: ShoppingItem[]): { store: string; items: ShoppingItem[] }[] {
  const grouped = items.reduce((acc, item) => {
    const store = item.store || 'Altro';
    if (!acc[store]) {
      acc[store] = [];
    }
    acc[store].push(item);
    return acc;
  }, {} as Record<string, ShoppingItem[]>);
  
  return Object.entries(grouped)
    .map(([store, items]) => ({ store, items }))
    .sort((a, b) => {
      // Migross prima (fresco), poi Lidl (dispensa)
      if (a.store === 'Migross') return -1;
      if (b.store === 'Migross') return 1;
      return a.store.localeCompare(b.store);
    });
}

// Lista della spesa per reparto
export function groupShoppingListByAisle(items: ShoppingItem[]): { aisle: string; items: ShoppingItem[] }[] {
  const grouped = items.reduce((acc, item) => {
    if (!acc[item.aisle]) {
      acc[item.aisle] = [];
    }
    acc[item.aisle].push(item);
    return acc;
  }, {} as Record<string, ShoppingItem[]>);
  
  // Ordine logico del supermercato
  const aisleOrder = ['Ortofrutta', 'Carne', 'Pesce', 'Pasta', 'Riso', 'Salse', 'Conserve', 'Formaggi', 'Latticini', 'Panetteria', 'Cereali', 'Dolci', 'Spezie', 'Oli', 'Brodi', 'Vini', 'Condimenti'];
  
  return Object.entries(grouped)
    .map(([aisle, items]) => ({ aisle, items }))
    .sort((a, b) => {
      const aIndex = aisleOrder.indexOf(a.aisle);
      const bIndex = aisleOrder.indexOf(b.aisle);
      if (aIndex === -1 && bIndex === -1) return a.aisle.localeCompare(b.aisle);
      if (aIndex === -1) return 1;
      if (bIndex === -1) return -1;
      return aIndex - bIndex;
    });
}

// Calculate daily macros
export function calculateDailyMacros(mealPlan: MealPlan): { protein: number; carbs: number; fats: number; calories: number } {
  const meals = [mealPlan.breakfast, mealPlan.lunch, mealPlan.dinner].filter(Boolean);
  
  return meals.reduce((acc, meal) => ({
    protein: acc.protein + (meal?.macros?.protein || 0),
    carbs: acc.carbs + (meal?.macros?.carbs || 0),
    fats: acc.fats + (meal?.macros?.fats || 0),
    calories: acc.calories + (meal?.macros?.calories || 0),
  }), { protein: 0, carbs: 0, fats: 0, calories: 0 });
}

// Calculate weekly budget estimate
export function calculateWeeklyBudget(): number {
  // Stima basata su 30-35€/settimana
  return 32.5;
}

// Get weekly menu plan
export function getWeeklyMenuPlan() {
  return weeklyMenuPlan;
}
