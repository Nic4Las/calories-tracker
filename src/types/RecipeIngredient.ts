/**
 * Represents an ingredient in a Recipe with its nutritional information.
 * 
 * @class RecipeIngredient
 * 
 * @property {string} name - The name of the meal ingredient.
 * @property {Ingredient} ingredient - The ingredient object containing nutritional information.
 * @property {number} quantity - The quantity of the ingredient in grams.
 * 
 * @method get calories - Calculates the total calories based on the quantity.
 * @method get carbs - Calculates the total carbohydrates based on the quantity.
 * @method get fat - Calculates the total fat based on the quantity.
 * @method get protein - Calculates the total protein based on the quantity.
 */
class RecipeIngredient {

    public name: string;
    public ingredient: Ingredient| Recipe;
    public quantity: number;

    constructor(name: string, ingredient: Ingredient | Recipe, quantity: number) {
        this.name = name;
        this.ingredient = ingredient;
        this.quantity = quantity;
    }

    get calories(): number {
        if (this.ingredient instanceof Recipe) {
            return this.ingredient.calories * this.quantity / 100;
        } else {
            return this.ingredient.nutrition.calories * this.quantity / 100;
        }
    }

    get carbs(): number {
        if (this.ingredient instanceof Recipe) {
            return this.ingredient.carbs * this.quantity / 100;
        } else {
            return this.ingredient.nutrition.carbs * this.quantity / 100;
        }
    }

    get fat(): number {
        if (this.ingredient instanceof Recipe) {
            return this.ingredient.fat * this.quantity / 100;
        } else {
            return this.ingredient.nutrition.fat * this.quantity / 100;
        }
    }

    get protein(): number {
        if (this.ingredient instanceof Recipe) {
            return this.ingredient.protein * this.quantity / 100;
        } else {
            return this.ingredient.nutrition.protein * this.quantity / 100;
        }
    }
}