class Recipe {
	name: string;
	ingredients: RecipeIngredient[];

	constructor(name: string, ingredients: RecipeIngredient[]) {
		this.name = name;
		this.ingredients = ingredients;
	}

	get calories():number {
		return this.ingredients.reduce((acc, ingredient) => acc + ingredient.calories, 0);
	}

	get carbs():number {
		return this.ingredients.reduce((acc, ingredient) => acc + ingredient.carbs, 0);
	}

	get fat():number {
		return this.ingredients.reduce((acc, ingredient) => acc + ingredient.fat, 0);
	}

	get protein():number {
		return this.ingredients.reduce((acc, ingredient) => acc + ingredient.protein, 0);
	}
}