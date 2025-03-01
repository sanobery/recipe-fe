import React, { useState } from "react";
import { Box,TextField, Button, List, ListItem, IconButton,Typography } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

interface IngredientsInputProps {
  onIngredientsChange: (ingredients: string[]) => void;
}

const IngredientsInput: React.FC<IngredientsInputProps> = ({ onIngredientsChange }) => {
  const [ingredient, setIngredient] = useState<string>("");
  const [ingredients, setIngredients] = useState<string[]>([]);

  const addIngredient = () => {
    if (ingredient.trim() !== "") {
      const newIngredients = [...ingredients, ingredient.trim()];
      setIngredients(newIngredients);
      onIngredientsChange(newIngredients); // Send updated list to parent
      setIngredient(""); // Clear input
    }
  };

  const removeIngredient = (index: number) => {
    const newIngredients = ingredients.filter((_, i) => i !== index);
    setIngredients(newIngredients);
    onIngredientsChange(newIngredients);
  };

  return (
    <>
    <Box display="flex" alignItems="center" gap={2}>
      <TextField
        label="Ingredient"
        variant="outlined"
        fullWidth
        value={ingredient}
        onChange={(e) => setIngredient(e.target.value)}
        margin="normal"
      />
      <Button 
        variant="contained"
        size="small"
        color="info" 
        onClick={addIngredient}
        sx={{ 
            fontSize: "12px",  // Smaller text
            padding: "2px 8px", // Less padding
            minWidth: "80px"  // Reduce width
        }}
        >
        Add Ingredient
      </Button>
      </Box>
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
      List of Ingredients:
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
  );
};

export default IngredientsInput;
