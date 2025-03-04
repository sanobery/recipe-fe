import { useState } from "react";
import { Button, Typography, TextField, Paper, Box } from "@mui/material";
import { RecipeInputs,Recipe } from "../../components/utils/RecipeInterface";
import config from "../../components/app/api/config/config";
import { fetchData } from "../../components/utils/FetchData";

interface EditRecipeProps {
    recipe: Recipe;
    onBack: () => void;
}

const EditRecipe = ({ recipe, onBack }: EditRecipeProps) => {
    const [formData, setFormData] = useState<RecipeInputs>({
        title: recipe?.title || "",
        image: recipe?.image || null ,
        preparationTime: recipe?.preparationTime || 0,
        ingredients: recipe?.ingredients || [],
        steps: recipe?.steps || [],
    });

    // Handle form input changes
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: name === "preparationTime" ? Number(value) : value });
    };

    // Handle array updates (Ingredients & Steps)
    const handleArrayChange = (index: number, value: string, field: keyof RecipeInputs) => {
        const updatedArray = [...formData[field] as string[]];
        updatedArray[index] = value;
        setFormData({ ...formData, [field]: updatedArray });
    };

    // Add a new ingredient/step
    const addField = (field: keyof RecipeInputs) => {
        setFormData({ ...formData, [field]: [...(formData[field] as string[]), ""] });
    };

    // Remove ingredient/step
    const removeField = (index: number, field: keyof RecipeInputs) => {
        const updatedArray = (formData[field] as string[]).filter((_, i) => i !== index);
        setFormData({ ...formData, [field]: updatedArray });
    };

    // Submit updated data
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();        
        try {
            if (!recipe?._id) {
                console.error("Recipe ID is missing!");
                return;
            }
        
            const updatedData = {
                ...formData,
                recipeId: recipe._id, // Include recipeId
            };
            const res = await fetchData(`${config.apiUrl}/recipe/update/`, "PUT",updatedData);
            // onUpdate(updatedRecipe); // Call parent function to update UI
        } catch (error) {
            console.error("Error updating recipe:", error);
        }
    };
    
    return (
        <>
            <Button variant="contained" color="secondary" onClick={onBack}>
                Back to Recipes
            </Button>
            <Paper elevation={3} sx={{ padding: 3, maxWidth: 600, margin: "auto", mt: 3 }}>
                <Typography variant="h4" fontWeight="bold" gutterBottom>
                    Edit Recipe
                </Typography>

                <form onSubmit={handleSubmit}>
                    {/* Title */}
                    <TextField
                        fullWidth
                        label="Title"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        margin="normal"
                    />

                    {/* Image */}
                    <Box mt={3}>
                        <Typography variant="h6">Image</Typography>
                        <input
                            type="file"
                            name="image"
                            accept="image/*"
                            onChange={handleChange}
                        />
                        {formData.image && (
                            <Typography variant="body2">{formData?.image}</Typography>
                        )}
                    </Box>
                    {/* Preparation Time */}
                    <TextField
                        fullWidth
                        label="Preparation Time (mins)"
                        type="number"
                        name="preparationTime"
                        value={formData.preparationTime}
                        onChange={handleChange}
                        margin="normal"
                    />

                    {/* Ingredients */}
                    <Box mt={3}>
                        <Typography variant="h6">Ingredients</Typography>
                        {formData.ingredients.map((ingredient, index) => (
                            <Box key={index} display="flex" alignItems="center">
                                <TextField
                                    fullWidth
                                    value={ingredient}
                                    onChange={(e) => handleArrayChange(index, e.target.value, "ingredients")}
                                    margin="dense"
                                />
                                <Button onClick={() => removeField(index, "ingredients")} color="error">
                                    X
                                </Button>
                            </Box>
                        ))}
                        <Button onClick={() => addField("ingredients")} variant="outlined" sx={{ mt: 1 }}>
                            Add Ingredient
                        </Button>
                    </Box>

                    {/* Steps */}
                    <Box mt={3}>
                        <Typography variant="h6">Steps</Typography>
                        {formData.steps.map((step, index) => (
                            <Box key={index} display="flex" alignItems="center">
                                <TextField
                                    fullWidth
                                    value={step}
                                    onChange={(e) => handleArrayChange(index, e.target.value, "steps")}
                                    margin="dense"
                                />
                                <Button onClick={() => removeField(index, "steps")} color="error">
                                    X
                                </Button>
                            </Box>
                        ))}
                        <Button onClick={() => addField("steps")} variant="outlined" sx={{ mt: 1 }}>
                            Add Step
                        </Button>
                    </Box>

                    {/* Submit Button */}
                    <Box display="flex" justifyContent="space-between" mt={4}>
                        <Button type="submit" variant="contained" color="primary">
                            Update Recipe
                        </Button>
                    </Box>
                </form>
            </Paper>
        </>
    );
};

export default EditRecipe;
