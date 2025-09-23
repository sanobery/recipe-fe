import React from "react";
import Grid from "@mui/material/Grid"; 
import { RootState } from "../../../components/redux/Store";
import { useSelector } from "react-redux";
import RecipeReviewCard from "./RecipeReviewCard";

const ViewRecipe = React.memo(() => {
  const recipes = useSelector((state: RootState) => state.recipe.recipes);
  const searchedRecipes = useSelector(
    (state: RootState) => state.recipe.searchRecipeByIngredient
  );

  const displayedRecipes =
    searchedRecipes.length > 0 ? searchedRecipes : recipes;

  return (
    <Grid 
      container 
      spacing={3} 
      justifyContent="center"
      alignItems="stretch"   // ✅ make heights equal
    >
      {displayedRecipes.length > 0 ? (
        displayedRecipes.map((recipe, index) => (
          <Grid 
            item 
            key={index} 
            xs={12} sm={6} md={4} lg={3} // ✅ better breakpoints
            display="flex"               // ✅ ensure equal height
            justifyContent="center"
          >
            <RecipeReviewCard {...recipe} />
          </Grid>
        ))
      ) : (
        <Grid item>
          <p>No recipes found.</p>
        </Grid>
      )}
    </Grid>
  );
});

export default ViewRecipe;
