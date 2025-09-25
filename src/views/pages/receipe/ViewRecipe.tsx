import React from "react"
import Grid from "@mui/material/Grid"
import { RootState } from "../../../store/Store"
import { useSelector } from "react-redux"
import RecipeReviewCard from "./RecipeReviewCard"
import { ConstantMessages } from "../../../constants/ConstantMessages"

const ViewRecipe = React.memo(() => {
  const recipes = useSelector((state: RootState) => state.recipe.recipes)
  const searchedRecipes = useSelector((state: RootState) => state.recipe.searchRecipeByIngredient)
  const displayedRecipes = searchedRecipes.length > 0 ? searchedRecipes : recipes

  return (
    <Grid container spacing={3} justifyContent="center">
      {displayedRecipes.length > 0 ? (
        displayedRecipes.map((recipe, index) => (
          <Grid
            item
            key={index}
            xs={12}
            sm={6}
            md={3}
            style={{ display: "flex", justifyContent: "center" }}
          >
            <RecipeReviewCard {...recipe} />
          </Grid>
        ))
      ) : (
        <Grid item xs={12}>
          <p style={{ textAlign: "center" }}>{ConstantMessages.NO_RECIPE}</p>
        </Grid>
      )}
    </Grid>
  )
})

export default ViewRecipe
