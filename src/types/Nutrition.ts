/**
 * Represents the nutritional information of a food item.
 * 
 * @interface Nutrition
 * @property {number} calories - The amount of calories in the food item [kcal] per 100g.
 * @property {number} carbs - The amount of carbohydrates in grams [g] per 100g.
 * @property {number} fat - The amount of fat in grams [g] per 100g.
 * @property {number} protein - The amount of protein in grams [g] per 100g.
 */
interface Nutrition {
    calories: number;
    carbs: number;
    fat: number;
    protein: number;
}