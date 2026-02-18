import { NextResponse } from 'next/server';
import { 
  getRecipes, 
  getRecipeById, 
  getRecipesByTag,
} from '@/lib/meal-planner';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const tag = searchParams.get('tag');
  const id = searchParams.get('id');

  try {
    if (id) {
      const recipe = getRecipeById(id);
      if (!recipe) {
        return NextResponse.json({ error: 'Recipe not found' }, { status: 404 });
      }
      return NextResponse.json(recipe);
    }

    if (tag) {
      const recipes = getRecipesByTag(tag);
      return NextResponse.json(recipes);
    }

    const recipes = getRecipes();
    return NextResponse.json(recipes);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch recipes' }, { status: 500 });
  }
}
