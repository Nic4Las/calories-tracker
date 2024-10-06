/**
 * Represents an ingredient with its nutritional information.
 * 
 * @interface Ingredient
 * @property {string} name - The name of the ingredient.
 * @property {string} [barcode] - An optional barcode for the ingredient.
 * @property {Nutrition} nutrition - The nutritional information of the ingredient.
 */
interface Ingredient {
    name: string;
    barcode?: string;
    nutrition: Nutrition;
}