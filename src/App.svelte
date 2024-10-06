<script lang="ts">
	
	import { OpenFoodFactsApi } from "openfoodfac-ts";
	import { ModeWatcher } from "mode-watcher";
    import NewIngredientDialog from "$lib/NewIngredientDialog.svelte";
	import { Toggle } from "$lib/components/ui/toggle";

	let ingredient: Ingredient | null = null;
	let editMode = false;

	const onIngredient = (e: CustomEvent<Ingredient>) => {
		ingredient = e.detail;
		console.log(ingredient);
	};

</script>

<main>
	<ModeWatcher />
	<Toggle aria-label="Toggle Edit Mode" bind:pressed={editMode} on:click={(e) => console.log(editMode)}>Edit Mode</Toggle>
	<NewIngredientDialog on:cancel={() => console.log("canceled Add")} on:ingredient={onIngredient} bind:isEditMode={editMode}/>

	{#if ingredient}
		<h2>{ingredient.name}</h2>
		<h3>Macronutrients per 100g</h3>
		<p>Calories: {ingredient.nutrition.calories}</p>
		<p>Protein: {ingredient.nutrition.protein}</p>
		<p>Fat: {ingredient.nutrition.fat}</p>
		<p>Carbohydrates: {ingredient.nutrition.carbs}</p>
	{/if}


	
</main>
