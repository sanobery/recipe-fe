import React, { useState } from "react"
import { Box,TextField, List, ListItem, IconButton,Typography,Alert } from "@mui/material"
import DeleteIcon from "@mui/icons-material/Delete"
import AddIcon from "@mui/icons-material/Add"

interface IngredientStepsProps {
    onIngredientStepsChange: (ingredients: string[]) => void,
    recipename:string
}

const IngredientSteps: React.FC<IngredientStepsProps> = ({ onIngredientStepsChange,recipename }) => {
    const [ingredient, setIngredient] = useState<string>("")
    const [ingredients, setIngredients] = useState<string[]>([])
    const [error,setError] = useState<string>("")

    // Adding Ingredient in Recipe
    const addIngredient = () => {
        if (ingredient.trim() === "") return 

        const newItems = ingredient
                        .split(",")
                        .map(item => item.trim().replace(/"/g, "")) // Replace all double quotes
                        .filter(item => item !== "")// Ensure no empty strings
    
        // Remove duplicates from the new items
        const uniqueItems = newItems.filter(item => !ingredients.includes(item))

        if (uniqueItems.length === 0) {
            setError("All ingredients are already added!")
            return
        }

        if (ingredients.includes(ingredient.trim())) {
            setError(`${ingredient} already added!`)
            return
        }
    
        const newIngredients = [...ingredients, ...uniqueItems]
        setIngredients(newIngredients)
        onIngredientStepsChange(newIngredients)
        setIngredient("") 
        setError("")
    }
    

    const removeIngredient = (index: number) => {
        const newIngredients = ingredients.filter((_, i) => i !== index)
        setIngredients(newIngredients)
        onIngredientStepsChange(newIngredients)
    }

    return (
        <>
        <Box display="flex" alignItems="center" gap={2}>
            <TextField
                label={recipename}
                variant="outlined"
                fullWidth
                value={ingredient}
                onChange={(e) => setIngredient(e.target.value)}
                margin="normal"
            />
            <IconButton color="primary" onClick={addIngredient}>
                <AddIcon />
            </IconButton>
        </Box>
        {error && <Alert severity="error">{error}</Alert>}
        {ingredients.length > 0 && (
            <Box
                sx={{
                mt: 2,         // Margin top
                p: 2,          // Padding
                border: "1px solid #ccc", // Border
                borderRadius: "8px", // Rounded corners
                backgroundColor: "#f9f9f9", // Light background color
                maxWidth: 400, // Limit width
                boxShadow: 2, // Add slight shadow
                }}
            >
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                List of {recipename}:
                </Typography>

                <List>
                {ingredients.map((item, index) => (
                    <ListItem
                    key={index}
                    secondaryAction={
                        <IconButton edge="end" onClick={() => removeIngredient(index)} color="error">
                        <DeleteIcon />
                        </IconButton>
                    }
                    >
                    {item}
                    </ListItem>
                ))}
                </List>
            </Box>
        )}
        </>
    )
}

export default IngredientSteps
