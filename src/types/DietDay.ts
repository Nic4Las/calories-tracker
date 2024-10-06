class DietDay {
    date: Date;
    meals: Meal[];

    constructor(date: Date, meals: Meal[]) {
        this.date = date;
        this.meals = meals;
    }

    get calories(): number {
        return this.meals.reduce((acc, meal) => acc + meal.calories, 0);
    }

    get carbs(): number {
        return this.meals.reduce((acc, meal) => acc + meal.carbs, 0);
    }

    get fat(): number {
        return this.meals.reduce((acc, meal) => acc + meal.fat, 0);
    }

    get protein(): number {
        return this.meals.reduce((acc, meal) => acc + meal.protein, 0);
    }

    get ingredients(): RecipeIngredient[] {
        let ingredients: RecipeIngredient[] = [];
        this.meals.forEach(meal => {
            ingredients = ingredients.concat(meal.ingredients);
        });

        return ingredients;
    }
}

