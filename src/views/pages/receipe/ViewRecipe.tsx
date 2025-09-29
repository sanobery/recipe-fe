import React from "react"
import Grid from "@mui/material/Grid2"
import { useSelector } from "react-redux"
import RecipeReviewCard from "./RecipeReviewCard"
import { RootState } from "../../../store/Store"

const ViewRecipe = React.memo(() => {
    const recipes = useSelector((state: RootState) => state.recipe.recipes)
    const searchedRecipes = useSelector((state: RootState) => state.recipe.searchRecipeByIngredient)
    const displayedRecipes = searchedRecipes.length > 0 ? searchedRecipes : recipes
    
    return (
        <Grid container spacing={3} justifyContent="center">
            {displayedRecipes.length > 0 ? (
                displayedRecipes.map((recipe, index) => (
                    <Grid item key={index} xs={12} sm={6} md={6}>
                        <RecipeReviewCard {...recipe} />
                    </Grid>
                ))
            ) : (
                <p>No recipes found.</p>
            )}
        </Grid>
    )
})

export default ViewRecipe