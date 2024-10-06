class Meal {
    name: string;
    recipes: Recipe[];

    constructor(name: string, recipes: Recipe[]) {
        this.name = name;
        this.recipes = recipes;
    }

    get calories(): number {
        return this.recipes.reduce((acc, recipe) => acc + recipe.calories, 0);
    }

    get carbs(): number {
        return this.recipes.reduce((acc, recipe) => acc + recipe.carbs, 0);
    }

    get fat(): number {
        return this.recipes.reduce((acc, recipe) => acc + recipe.fat, 0);
    }

    get protein(): number {
        return this.recipes.reduce((acc, recipe) => acc + recipe.protein, 0);
    }

    get ingredients(): RecipeIngredient[] {
        let ingredients: RecipeIngredient[] = [];
        this.recipes.forEach(recipe => {
            ingredients = ingredients.concat(recipe.ingredients);
        });

        return ingredients;
    }
}
