import React from "react";
import { Card, CardContent, CardMedia, Typography, Box, Rating } from "@mui/material";
import RecipeHeader from "./RecipeHeader";

interface RecipeProps {
    _id: string;
    userId: number;
    title: string;
    ingredients: string[];
    steps: string[];
    image: string;
    preparationTime: number;
    createdAt: string;
    averageRating:number;
}
  

const RecipeCard: React.FC<RecipeProps> = ({ recipe }) => {   
    console.log(recipe);
     
  return (
    <>
    <RecipeHeader />
    <Card sx={{ maxWidth: 345, boxShadow: 3, borderRadius: 2 }}>
      <CardMedia
        component="img"
        height="180"
        image=""
        alt={recipe.recipe.title}
      />
      <CardContent>
        <Typography variant="h6" fontWeight="bold">
          {recipe.recipe.title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
        </Typography>
        <Box display="flex" alignItems="center" mt={1}>
          <Rating value={Math.ceil(recipe.averageRating)} readOnly />
          <Typography variant="body2" ml={1}>
            ({Math.ceil(recipe.averageRating)}/5)
          </Typography>
        </Box>
        <Typography variant="body2" mt={1}>
          <strong>Ingredients:</strong> {recipe.recipe.ingredients.join(", ")}
        </Typography>
        <Typography variant="body2" mt={1}>
          <strong>Steps:</strong> {recipe.recipe.steps.join(", ")}
        </Typography>
        <Typography variant="body2" mt={1} color="text.secondary">
          Preparation Time: {recipe.recipe.preparationTime} mins
        </Typography>
        <Typography variant="body2" mt={1} color="text.secondary">
          "{recipe.comment}"
        </Typography>
      </CardContent>
    </Card>
    </>
  );
};

export default RecipeCard;
