import { Recipe, MealPlan, ShoppingItem, WeatherForecast } from './types';

// RICETTE ADATTATE PER: 190cm, 85kg, in allenamento
// Focus: proteine, porzioni generose, calorie sufficienti

export const recipes: Recipe[] = [
  // PASTA - porzioni 120-150g pasta secca (80g = 1 porzione standard)
  {
    id: 'pasta-pomodoro',
    name: 'Pasta al Pomodoro (doppia porzione)',
    chef: 'me',
    prepTime: 15,
    difficulty: 'easy',
    tags: ['pasta', 'vegetarian', 'quick', 'carbs'],
    ingredients: [
      { name: 'Pasta', amount: '500g', store: 'any', aisle: 'Pasta' },
      { name: 'Pomodori pelati', amount: '800g', store: 'any', aisle: 'Salse' },
      { name: 'Aglio', amount: '3 spicchi', store: 'any', aisle: 'Ortofrutta' },
      { name: 'Olio EVO', amount: '4 cucchiai', store: 'any', aisle: 'Oli' },
      { name: 'Parmigiano', amount: '100g', store: 'any', aisle: 'Formaggi' },
    ],
    instructions: [
      'Soffriggere l\'aglio in olio',
      'Aggiungere pomodori e cuocere 10 minuti',
      'Cuocere la pasta al dente (500g = 2 porzioni)',
      'Mantecare pasta con il sugo',
      'Abbondante parmigiano'
    ],
    weatherSuitable: ['sunny', 'rainy', 'cold', 'hot'],
  },
  {
    id: 'pasta-aglio-olio',
    name: 'Spaghetti Aglio e Olio (doppia porzione)',
    chef: 'me',
    prepTime: 10,
    difficulty: 'easy',
    tags: ['pasta', 'vegetarian', 'quick', 'carbs'],
    ingredients: [
      { name: 'Spaghetti', amount: '500g', store: 'any', aisle: 'Pasta' },
      { name: 'Aglio', amount: '6 spicchi', store: 'any', aisle: 'Ortofrutta' },
      { name: 'Olio EVO', amount: '6 cucchiai', store: 'any', aisle: 'Oli' },
      { name: 'Peperoncino', amount: 'q.b.', store: 'any', aisle: 'Spezie' },
      { name: 'Prezzemolo', amount: 'q.b.', store: 'any', aisle: 'Erbe' },
    ],
    instructions: [
      'Cuocere la pasta al dente',
      'Soffriggere abbondante aglio e peperoncino',
      'Scolare pasta conservando acqua',
      'Saltare pasta in padella',
      'Aggiungere prezzemolo'
    ],
    weatherSuitable: ['sunny', 'hot'],
  },
  {
    id: 'pasta-salsiccia',
    name: 'Pasta con Salsiccia (doppia porzione)',
    chef: 'me',
    prepTime: 20,
    difficulty: 'easy',
    tags: ['pasta', 'meat', 'quick', 'protein'],
    ingredients: [
      { name: 'Pasta', amount: '500g', store: 'any', aisle: 'Pasta' },
      { name: 'Salsicce', amount: '600g', store: 'any', aisle: 'Carne' },
      { name: 'Cipolla', amount: '1 grande', store: 'any', aisle: 'Ortofrutta' },
      { name: 'Vino bianco', amount: '100ml', store: 'any', aisle: 'Vini' },
      { name: 'Olio EVO', amount: '3 cucchiai', store: 'any', aisle: 'Oli' },
    ],
    instructions: [
      'Togliere la salsiccia dal budello',
      'Sbriciolare e rosolare con cipolla',
      'Sfumare con vino',
      'Cuocere pasta al dente',
      'Mantecare insieme'
    ],
    weatherSuitable: ['cold', 'rainy'],
  },
  {
    id: 'pasta-zucchine',
    name: 'Pasta con Zucchine (doppia porzione)',
    chef: 'me',
    prepTime: 20,
    difficulty: 'easy',
    tags: ['pasta', 'vegetarian', 'quick'],
    ingredients: [
      { name: 'Pasta', amount: '500g', store: 'any', aisle: 'Pasta' },
      { name: 'Zucchine', amount: '5', store: 'any', aisle: 'Ortofrutta' },
      { name: 'Aglio', amount: '3 spicchi', store: 'any', aisle: 'Ortofrutta' },
      { name: 'Olio EVO', amount: '4 cucchiai', store: 'any', aisle: 'Oli' },
      { name: 'Parmigiano', amount: '100g', store: 'any', aisle: 'Formaggi' },
    ],
    instructions: [
      'Tagliare zucchine a dadini',
      'Soffriggere aglio e zucchine',
      'Cuocere pasta al dente',
      'Mantecare insieme',
      'Abbondante parmigiano'
    ],
    weatherSuitable: ['sunny', 'cloudy'],
  },

  // RISO - porzioni 200-250g riso crudo
  {
    id: 'risotto-funghi-semplice',
    name: 'Risotto Funghi (doppia porzione)',
    chef: 'me',
    prepTime: 25,
    difficulty: 'easy',
    tags: ['rice', 'vegetarian', 'comfort'],
    ingredients: [
      { name: 'Riso Carnaroli', amount: '500g', store: 'any', aisle: 'Riso' },
      { name: 'Funghi champignon', amount: '600g', store: 'any', aisle: 'Ortofrutta' },
      { name: 'Brodo', amount: '1.5L', store: 'any', aisle: 'Brodi' },
      { name: 'Cipolla', amount: '1 grande', store: 'any', aisle: 'Ortofrutta' },
      { name: 'Parmigiano', amount: '150g', store: 'any', aisle: 'Formaggi' },
      { name: 'Burro', amount: '80g', store: 'any', aisle: 'Latticini' },
    ],
    instructions: [
      'Soffriggere cipolla e funghi',
      'Tostare il riso',
      'Aggiungere brodo poco alla volta',
      'Cuocere 18 minuti mescolando',
      'Mantecare con burro e parmigiano'
    ],
    weatherSuitable: ['cold', 'rainy'],
  },
  {
    id: 'risotto-pomodoro',
    name: 'Risotto al Pomodoro (doppia porzione)',
    chef: 'me',
    prepTime: 25,
    difficulty: 'easy',
    tags: ['rice', 'vegetarian', 'comfort'],
    ingredients: [
      { name: 'Riso', amount: '500g', store: 'any', aisle: 'Riso' },
      { name: 'Pomodori pelati', amount: '800g', store: 'any', aisle: 'Salse' },
      { name: 'Cipolla', amount: '1 grande', store: 'any', aisle: 'Ortofrutta' },
      { name: 'Brodo', amount: '1.5L', store: 'any', aisle: 'Brodi' },
      { name: 'Parmigiano', amount: '150g', store: 'any', aisle: 'Formaggi' },
    ],
    instructions: [
      'Soffriggere cipolla',
      'Tostare il riso',
      'Aggiungere pomodori e brodo',
      'Cuocere 18 minuti',
      'Mantecare con parmigiano'
    ],
    weatherSuitable: ['cold', 'rainy'],
  },

  // CARNE - porzioni 300-400g carne
  {
    id: 'pollo-padella',
    name: 'Pollo in Padella (porzione XL)',
    chef: 'me',
    prepTime: 20,
    difficulty: 'easy',
    tags: ['chicken', 'quick', 'protein'],
    ingredients: [
      { name: 'Petto di pollo', amount: '800g', store: 'any', aisle: 'Carne' },
      { name: 'Limone', amount: '2', store: 'any', aisle: 'Ortofrutta' },
      { name: 'Rosmarino', amount: '3 rametti', store: 'any', aisle: 'Erbe' },
      { name: 'Olio EVO', amount: '4 cucchiai', store: 'any', aisle: 'Oli' },
      { name: 'Sale', amount: 'q.b.', store: 'any', aisle: 'Condimenti' },
    ],
    instructions: [
      'Affettare il pollo a strisce',
      'Scaldare olio in padella',
      'Cuocere pollo 5 minuti per lato',
      'Aggiungere rosmarino e limone',
      'Servire caldo'
    ],
    weatherSuitable: ['sunny', 'cloudy'],
  },
  {
    id: 'salsicce-pomodoro',
    name: 'Salsicce al Pomodoro (porzione XL)',
    chef: 'me',
    prepTime: 30,
    difficulty: 'easy',
    tags: ['meat', 'comfort', 'protein'],
    ingredients: [
      { name: 'Salsicce', amount: '800g', store: 'any', aisle: 'Carne' },
      { name: 'Pomodori pelati', amount: '800g', store: 'any', aisle: 'Salse' },
      { name: 'Cipolla', amount: '2 grandi', store: 'any', aisle: 'Ortofrutta' },
      { name: 'Vino bianco', amount: '200ml', store: 'any', aisle: 'Vini' },
      { name: 'Olio EVO', amount: '3 cucchiai', store: 'any', aisle: 'Oli' },
    ],
    instructions: [
      'Rosolare salsicce in padella',
      'Aggiungere cipolla tritata',
      'Sfumare con vino bianco',
      'Aggiungere pomodori',
      'Cuocere 20 minuti a fuoco basso'
    ],
    weatherSuitable: ['cold', 'rainy'],
  },
  {
    id: 'bistecca-griglia',
    name: 'Bistecca alla Griglia (doppia)',
    chef: 'me',
    prepTime: 20,
    difficulty: 'easy',
    tags: ['grill', 'meat', 'protein', 'quick'],
    ingredients: [
      { name: 'Bistecca di manzo', amount: '600g (2 pezzi)', store: 'any', aisle: 'Carne' },
      { name: 'Sale marino', amount: 'q.b.', store: 'any', aisle: 'Condimenti' },
      { name: 'Pepe nero', amount: 'q.b.', store: 'any', aisle: 'Condimenti' },
      { name: 'Olio EVO', amount: '3 cucchiai', store: 'any', aisle: 'Oli' },
      { name: 'Rosmarino', amount: '3 rametti', store: 'any', aisle: 'Erbe' },
    ],
    instructions: [
      'Togliere la carne dal frigo 30 minuti prima',
      'Scaldare la griglia a temperatura alta',
      'Condire la carne con sale, pepe e olio',
      'Grigliare 3-4 minuti per lato',
      'Lasciar riposare 5 minuti prima di servire'
    ],
    weatherSuitable: ['sunny', 'hot'],
  },

  // UOVA - 4-6 uova
  {
    id: 'frittata',
    name: 'Frittata di Verdure (XL)',
    chef: 'me',
    prepTime: 15,
    difficulty: 'easy',
    tags: ['eggs', 'vegetarian', 'quick', 'protein'],
    ingredients: [
      { name: 'Uova', amount: '8', store: 'any', aisle: 'Latticini' },
      { name: 'Zucchine', amount: '3', store: 'any', aisle: 'Ortofrutta' },
      { name: 'Cipolla', amount: '1 grande', store: 'any', aisle: 'Ortofrutta' },
      { name: 'Parmigiano', amount: '100g', store: 'any', aisle: 'Formaggi' },
      { name: 'Olio EVO', amount: '3 cucchiai', store: 'any', aisle: 'Oli' },
    ],
    instructions: [
      'Tagliare zucchine e cipolla',
      'Soffriggere le verdure 5 minuti',
      'Sbattere uova con parmigiano',
      'Versare in padella e cuocere',
      'Girare e finire la cottura'
    ],
    weatherSuitable: ['sunny', 'cloudy', 'rainy'],
  },
  {
    id: 'uova-pomodoro',
    name: 'Uova al Pomodoro (4 uova)',
    chef: 'me',
    prepTime: 15,
    difficulty: 'easy',
    tags: ['eggs', 'vegetarian', 'quick', 'protein'],
    ingredients: [
      { name: 'Uova', amount: '4', store: 'any', aisle: 'Latticini' },
      { name: 'Pomodori pelati', amount: '400g', store: 'any', aisle: 'Salse' },
      { name: 'Cipolla', amount: '1', store: 'any', aisle: 'Ortofrutta' },
      { name: 'Olio EVO', amount: '3 cucchiai', store: 'any', aisle: 'Oli' },
      { name: 'Basilico', amount: 'q.b.', store: 'any', aisle: 'Erbe' },
    ],
    instructions: [
      'Soffriggere cipolla',
      'Aggiungere pomodori e cuocere 10 min',
      'Creare 4 buchi nel sugo',
      'Romperci le uova dentro',
      'Coprire e cuocere 5 minuti'
    ],
    weatherSuitable: ['sunny', 'cloudy', 'rainy'],
  },

  // CONTORNI - porzioni abbondanti
  {
    id: 'zucchine-padella',
    name: 'Zucchine in Padella (XL)',
    chef: 'me',
    prepTime: 10,
    difficulty: 'easy',
    tags: ['vegetarian', 'quick', 'side', 'healthy'],
    ingredients: [
      { name: 'Zucchine', amount: '6', store: 'any', aisle: 'Ortofrutta' },
      { name: 'Aglio', amount: '3 spicchi', store: 'any', aisle: 'Ortofrutta' },
      { name: 'Olio EVO', amount: '4 cucchiai', store: 'any', aisle: 'Oli' },
      { name: 'Menta', amount: 'q.b.', store: 'any', aisle: 'Erbe' },
      { name: 'Sale', amount: 'q.b.', store: 'any', aisle: 'Condimenti' },
    ],
    instructions: [
      'Tagliare zucchine a rondelle',
      'Scaldare olio con aglio',
      'Cuocere zucchine 8-10 minuti',
      'Aggiungere menta a fine cottura',
      'Servire come contorno'
    ],
    weatherSuitable: ['sunny', 'hot'],
  },
  {
    id: 'peperonata',
    name: 'Peperonata (XL)',
    chef: 'me',
    prepTime: 30,
    difficulty: 'easy',
    tags: ['vegetarian', 'side', 'make-ahead'],
    ingredients: [
      { name: 'Peperoni', amount: '6', store: 'any', aisle: 'Ortofrutta' },
      { name: 'Cipolle', amount: '3', store: 'any', aisle: 'Ortofrutta' },
      { name: 'Pomodori pelati', amount: '400g', store: 'any', aisle: 'Salse' },
      { name: 'Olio EVO', amount: '5 cucchiai', store: 'any', aisle: 'Oli' },
      { name: 'Capperi', amount: '2 cucchiai', store: 'any', aisle: 'Conserve' },
    ],
    instructions: [
      'Tagliare peperoni e cipolle a strisce',
      'Soffriggere in olio 10 minuti',
      'Aggiungere pomodori e capperi',
      'Cuocere 20 minuti',
      'Servire tiepida o fredda'
    ],
    weatherSuitable: ['sunny', 'cloudy'],
  },
  {
    id: 'melanzane-forno',
    name: 'Melanzane al Forno (XL)',
    chef: 'me',
    prepTime: 40,
    difficulty: 'medium',
    tags: ['vegetarian', 'oven', 'comfort'],
    ingredients: [
      { name: 'Melanzane', amount: '3 grandi', store: 'any', aisle: 'Ortofrutta' },
      { name: 'Pomodori pelati', amount: '600g', store: 'any', aisle: 'Salse' },
      { name: 'Parmigiano', amount: '150g', store: 'any', aisle: 'Formaggi' },
      { name: 'Aglio', amount: '3 spicchi', store: 'any', aisle: 'Ortofrutta' },
      { name: 'Olio EVO', amount: '4 cucchiai', store: 'any', aisle: 'Oli' },
    ],
    instructions: [
      'Tagliare melanzane a fette',
      'Disporre su teglia con pomodori',
      'Aggiungere aglio e parmigiano',
      'Infornare a 200° per 30 min',
      'Servire caldo'
    ],
    weatherSuitable: ['cold', 'rainy'],
  },
  {
    id: 'insalata-pomodori',
    name: 'Insalata di Pomodori (XL)',
    chef: 'me',
    prepTime: 5,
    difficulty: 'easy',
    tags: ['salad', 'vegetarian', 'quick', 'cold'],
    ingredients: [
      { name: 'Pomodori', amount: '6', store: 'any', aisle: 'Ortofrutta' },
      { name: 'Cipolla rossa', amount: '1 grande', store: 'any', aisle: 'Ortofrutta' },
      { name: 'Olio EVO', amount: '4 cucchiai', store: 'any', aisle: 'Oli' },
      { name: 'Origano', amount: 'q.b.', store: 'any', aisle: 'Spezie' },
      { name: 'Sale', amount: 'q.b.', store: 'any', aisle: 'Condimenti' },
    ],
    instructions: [
      'Tagliare pomodori a spicchi',
      'Affettare cipolla sottile',
      'Condire con olio e sale',
      'Aggiungere origano',
      'Lasciar riposare 10 minuti'
    ],
    weatherSuitable: ['sunny', 'hot'],
  },

  // PESCE - porzioni 300-400g
  {
    id: 'salmone-griglia',
    name: 'Salmone alla Griglia (doppio)',
    chef: 'me',
    prepTime: 15,
    difficulty: 'easy',
    tags: ['grill', 'fish', 'protein', 'healthy'],
    ingredients: [
      { name: 'Filetto di salmone', amount: '400g (2 pezzi)', store: 'any', aisle: 'Pesce' },
      { name: 'Limone', amount: '2', store: 'any', aisle: 'Ortofrutta' },
      { name: 'Olio EVO', amount: '3 cucchiai', store: 'any', aisle: 'Oli' },
      { name: 'Aneto', amount: 'q.b.', store: 'any', aisle: 'Erbe' },
      { name: 'Sale', amount: 'q.b.', store: 'any', aisle: 'Condimenti' },
    ],
    instructions: [
      'Scaldare la griglia',
      'Condire il salmone con olio, sale e limone',
      'Grigliare 4-5 minuti per lato',
      'Servire con aneto fresco'
    ],
    weatherSuitable: ['sunny', 'hot'],
  },

  // MINESTRA
  {
    id: 'minestrone',
    name: 'Minestrone (pentola XL)',
    chef: 'me',
    prepTime: 45,
    difficulty: 'easy',
    tags: ['soup', 'vegetarian', 'comfort', 'meal-prep'],
    ingredients: [
      { name: 'Zucchine', amount: '3', store: 'any', aisle: 'Ortofrutta' },
      { name: 'Carote', amount: '4', store: 'any', aisle: 'Ortofrutta' },
      { name: 'Patate', amount: '3', store: 'any', aisle: 'Ortofrutta' },
      { name: 'Fagioli borlotti', amount: '2 scatole', store: 'any', aisle: 'Conserve' },
      { name: 'Pasta mista', amount: '300g', store: 'any', aisle: 'Pasta' },
      { name: 'Brodo', amount: '2L', store: 'any', aisle: 'Brodi' },
      { name: 'Cipolla', amount: '1', store: 'any', aisle: 'Ortofrutta' },
      { name: 'Olio', amount: '4 cucchiai', store: 'any', aisle: 'Oli' },
    ],
    instructions: [
      'Soffriggere la cipolla',
      'Aggiungere le verdure tagliate a cubetti',
      'Coprire con brodo e cuocere 30 minuti',
      'Aggiungere i fagioli',
      'Aggiungere pasta e cuocere altri 10 minuti'
    ],
    weatherSuitable: ['cold', 'rainy'],
  },
];

export function getRecipes(): Recipe[] {
  return recipes;
}

export function getRecipeById(id: string): Recipe | undefined {
  return recipes.find(r => r.id === id);
}

export function getRecipesByTag(tag: string): Recipe[] {
  return recipes.filter(r => r.tags.includes(tag));
}

export function getRecipesByWeather(weather: 'sunny' | 'rainy' | 'cold' | 'hot' | 'cloudy'): Recipe[] {
  return recipes.filter(r => r.weatherSuitable.includes(weather));
}

export function generateWeeklyMealPlan(weatherForecast: WeatherForecast[]): MealPlan[] {
  const today = new Date();
  const plan: MealPlan[] = [];
  const usedRecipes = new Set<string>();
  
  // Giorni di allenamento: più proteine
  const trainingDays = [1, 3, 5]; // Lun, Mer, Ven
  
  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    const dateStr = date.toISOString().split('T')[0];
    const dayOfWeek = date.getDay();
    
    const weather = weatherForecast[i] || { condition: 'cloudy' };
    const isTrainingDay = trainingDays.includes(dayOfWeek);
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    
    // Seleziona ricette in base al meteo e giorno
    let suitableRecipes = recipes.filter(r => 
      (r.weatherSuitable.includes(weather.condition as any) || 
      r.weatherSuitable.length === 0) &&
      !usedRecipes.has(r.id)
    );
    
    if (suitableRecipes.length === 0) {
      suitableRecipes = recipes.filter(r => !usedRecipes.has(r.id));
    }
    
    if (suitableRecipes.length === 0) {
      usedRecipes.clear();
      suitableRecipes = recipes;
    }
    
    // Giorni di allenamento: priorità a proteine (carne, pesce, uova)
    let dinnerPool;
    if (isTrainingDay) {
      dinnerPool = suitableRecipes.filter(r => 
        r.tags.includes('protein') || r.tags.includes('meat') || r.tags.includes('fish')
      );
    } else if (isWeekend) {
      dinnerPool = suitableRecipes.filter(r => r.prepTime >= 30);
    } else {
      dinnerPool = suitableRecipes.filter(r => r.prepTime <= 25);
    }
    
    // Se il pool è vuoto, usa tutte le ricette adatte
    if (dinnerPool.length === 0) {
      dinnerPool = suitableRecipes;
    }
    
    const dinner = dinnerPool[Math.floor(Math.random() * dinnerPool.length)] || recipes[0];
    
    if (dinner) {
      usedRecipes.add(dinner.id);
    }
    
    plan.push({
      date: dateStr,
      dinner: dinner || recipes[0],
    });
  }
  
  return plan;
}

export function generateShoppingList(mealPlan: MealPlan[]): ShoppingItem[] {
  const items: Map<string, ShoppingItem> = new Map();
  
  mealPlan.forEach(day => {
    const recipe = day.dinner || day.lunch;
    if (recipe) {
      recipe.ingredients.forEach(ing => {
        const key = `${ing.name}`;
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
  
  return Array.from(items.values());
}

// Lista della spesa SENZA divisione per supermercato
export function groupShoppingListByAisle(items: ShoppingItem[]): { aisle: string; items: ShoppingItem[] }[] {
  const grouped = items.reduce((acc, item) => {
    if (!acc[item.aisle]) {
      acc[item.aisle] = [];
    }
    acc[item.aisle].push(item);
    return acc;
  }, {} as Record<string, ShoppingItem[]>);
  
  // Ordine logico del supermercato
  const aisleOrder = ['Ortofrutta', 'Carne', 'Pesce', 'Pasta', 'Riso', 'Salse', 'Conserve', 'Formaggi', 'Latticini', 'Panetteria', 'Oli', 'Spezie', 'Erbe', 'Brodi', 'Vini', 'Condimenti'];
  
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
