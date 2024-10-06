<script lang="ts">
    import {
        Accordion,
        AccordionContent,
        AccordionItem,
        AccordionTrigger,
    } from "$lib/components/ui/accordion";
    import * as AlertDialog from "$lib/components/ui/alert-dialog/index.js";
    import { Button } from "$lib/components/ui/button";
    import { Input } from "$lib/components/ui/input";
    import { Toaster } from "$lib/components/ui/sonner";
    import { CheckCircle } from "lucide-svelte";
    import { toast } from "svelte-sonner";
    import { Label } from "./components/ui/label";

    import { OpenFoodFactsApi } from "openfoodfac-ts";
    import { createEventDispatcher } from "svelte";
    import QrCodeScanner from "./QrCodeScanner.svelte";

    export let isEditMode: boolean = false;

    interface AddEvent {
        ingredient: Ingredient;
    }

    const dispatchAdd = createEventDispatcher<AddEvent>();
    const dispatchCancel = createEventDispatcher();

    let isOpen = false;
    let isScanning = false;
    let accordionValue = "";

    let openFoodFactsApi = new OpenFoodFactsApi();
    let name = "";
    let code = "";
    let calories = 0;
    let carbs = 0;
    let fat = 0;
    let protein = 0;

    const getOpenFoodFacts = async (code: string) => {
        const response = await openFoodFactsApi.findProductByBarcode(code);
        if (response === null) {
            toast.error("No product found.", {
                description: "No product found with the given barcode.",
            });
            return;
        }

        if (response.nutriments === undefined) {
            toast.error("No nutriments found.", {
                description: "No nutriments found for the given barcode.",
            });
            return;
        }

        let foundName = response.product_name;
        let foundBrand = response.brands;
        let foundCalories = response.nutriments["energy-kcal_100g"];
        let foundCarbs = response.nutriments["carbohydrates_100g"];
        let foundFat = response.nutriments["fat_100g"];
        let foundProtein = response.nutriments["proteins_100g"];

        if (foundName !== undefined) {
            name =
                foundBrand !== undefined
                    ? foundBrand + " - " + foundName
                    : foundName;
        } else {
            toast.warning("No name found.", {
                description: "No name found for the given barcode.",
            });
        }

        if (foundCalories !== undefined) {
            calories = foundCalories;
        } else {
            toast.warning("No calories found.", {
                description: "No calories found for the given barcode.",
            });
        }

        if (foundCarbs !== undefined) {
            carbs = foundCarbs;
        } else {
            toast.warning("No carbs found.", {
                description: "No carbs found for the given barcode.",
            });
        }

        if (foundFat !== undefined) {
            fat = foundFat;
        } else {
            toast.warning("No fat found.", {
                description: "No fat found for the given barcode.",
            });
        }

        if (foundProtein !== undefined) {
            protein = foundProtein;
        } else {
            toast.warning("No protein found.", {
                description: "No protein found for the given barcode.",
            });
        }

        accordionValue = "macros";
    };

    const reset = () => {
        name = "";
        code = "";
        calories = 0;
        carbs = 0;
        fat = 0;
        protein = 0;
    };

    const startScanning = () => {
        isScanning = true;
    };

    const stopScanning = () => {
        isScanning = false;
    };

    const handleAdd = () => {
        if (name === "") {
            toast.error("Name is required.", {
                description: "Please enter a name for the ingredient.",
            });
            return;
        }
        isOpen = false;
        stopScanning();

        dispatchAdd("ingredient", {
            name: name,
            barcode: code,
            nutrition: {
                calories: calories,
                carbs: carbs,
                fat: fat,
                protein: protein,
            },
        });
        reset();
    };

    const handleCancel = () => {
        isOpen = false;
        stopScanning();
        dispatchCancel("cancel");
        reset();
    };

    const handleScanSuccess = (
        e: CustomEvent<{
            decodedText: string;
        }>,
    ) => {
        code = e.detail.decodedText;
        stopScanning();
        getOpenFoodFacts(code);
    };
</script>

<AlertDialog.Root bind:open={isOpen}>
    <AlertDialog.Trigger asChild let:builder>
        <Button builders={[builder]} variant="outline" class="w-full mt-4">
            <span class="mr-2"
                >{isEditMode ? "Edit Ingredient" : "Add New Ingredient"}</span
            >
            <CheckCircle class="w-5 h-5" />
        </Button>
    </AlertDialog.Trigger>

    <AlertDialog.Content
        class="p-6 sm:p-8  shadow-lg space-y-6 w-full max-w-lg"
    >
        <AlertDialog.Header>
            <AlertDialog.Title class="text-xl font-semibold">{isEditMode ? "Edit Ingredient" : "Add New Ingredient"}</AlertDialog.Title>
            <AlertDialog.Description class="mt-4 space-y-4">
                <div class="grid grid-cols-1 gap-4">
                    <!-- Row 1: Name Input and Scan Barcode Button -->
                    <div class="flex items-end gap-2">
                        <div class="flex-grow">
                            <Label for="code">Name</Label>
                            <Input
                                id="code"
                                name="code"
                                type="text"
                                bind:value={name}
                                placeholder="Name"
                                class="mt-1"
                            />
                        </div>

                        {#if isScanning}
                            <Button
                                variant="secondary"
                                class="mt-1 flex items-center"
                                on:click={() => stopScanning()}
                            >
                                Stop Scanning
                            </Button>
                        {:else}
                            <Button
                                variant="secondary"
                                class="mt-1 flex items-center"
                                on:click={() => startScanning()}
                            >
                                Start Scanning
                            </Button>
                        {/if}
                    </div>

                    <!-- Row 2: Manual Barcode Input and Check Barcode Button -->
                    <div class="flex items-end gap-2">
                        <div class="flex-grow">
                            <Label for="code">Barcode</Label>
                            <Input
                                id="code"
                                name="code"
                                type="text"
                                bind:value={code}
                                placeholder="Barcode"
                                class="mt-1"
                            />
                        </div>
                        <Button
                            variant="secondary"
                            class="mt-1 flex items-center"
                            on:click={() => getOpenFoodFacts(code)}
                        >
                            Check Barcode
                        </Button>
                    </div>

                    {#if isScanning}
                        <QrCodeScanner
                            on:detect={(e) => handleScanSuccess(e)}
                            paused={!isScanning}
                            width={569}
                            height={320}
                            class="w-full max-w-sm mx-auto"
                        />
                    {/if}
                </div>

                <!-- Expander for Macronutrients -->
                <Accordion class="mt-6 " bind:value={accordionValue}>
                    <AccordionItem value="macros">
                        <AccordionTrigger
                            class="flex justify-between items-center px-4 py-2 text-sm font-medium "
                        >
                            <span>Macronutrients</span>
                            <span class="text-sm text-gray-500">Per 100g</span>
                        </AccordionTrigger>
                        <AccordionContent class="p-4 ">
                            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <Label for="calories">Calories</Label>
                                    <Input
                                        id="calories"
                                        name="calories"
                                        type="number"
                                        bind:value={calories}
                                        placeholder="Calories"
                                        class="mt-1"
                                    />
                                </div>
                                <div>
                                    <Label for="carbs">Carbs</Label>
                                    <Input
                                        id="carbs"
                                        name="carbs"
                                        type="number"
                                        bind:value={carbs}
                                        placeholder="Carbs"
                                        class="mt-1"
                                    />
                                </div>
                                <div>
                                    <Label for="fat">Fat</Label>
                                    <Input
                                        id="fat"
                                        name="fat"
                                        type="number"
                                        bind:value={fat}
                                        placeholder="Fat"
                                        class="mt-1"
                                    />
                                </div>
                                <div>
                                    <Label for="protein">Protein</Label>
                                    <Input
                                        id="protein"
                                        name="protein"
                                        type="number"
                                        bind:value={protein}
                                        placeholder="Protein"
                                        class="mt-1"
                                    />
                                </div>
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </AlertDialog.Description>
        </AlertDialog.Header>

        <AlertDialog.Footer class="flex justify-end space-x-4">
            <AlertDialog.Cancel asChild>
                <Button
                    variant="ghost"
                    class="flex items-center"
                    on:click={handleCancel}
                >
                    Cancel
                </Button>
            </AlertDialog.Cancel>

            <AlertDialog.Action asChild>
                <Button class="flex items-center" on:click={handleAdd}>
                    {isEditMode ? "Confirm" : "Add"}
                </Button>
            </AlertDialog.Action>
        </AlertDialog.Footer>
    </AlertDialog.Content>
</AlertDialog.Root>

<Toaster />
