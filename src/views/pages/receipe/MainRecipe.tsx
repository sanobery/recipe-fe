import React, { useState, useEffect, useCallback } from "react"
import recipeService from "../../../infrastructure/services/api/recipe/RecipeInstance"
// import Grid from "@mui/material/Grid2"
import { RootState } from "../../../components/redux/Store"
import { useDispatch, useSelector } from "react-redux"
import SearchFilterRecipe from "./SearchFilterRecipe"
// import RecipeReviewCard from "./RecipeReviewCard"
import { Pagination } from "@mui/material"
import RecipeSlider from "./RecipeSlider"
// import { Recipe } from "../../../utils/RecipeAuthInterface"
import ViewRecipe from "./ViewRecipe"
import { setRecipes } from "../../../components/redux/Slice"

const MainRecipe = React.memo(() => {
    const dispatch = useDispatch()
    const [page, setPage] = useState<number>(1)
    const recipesPerPage = 4
    const [totalRecipes, setTotalRecipes] = useState<number>(0)
    const searchedRecipes = useSelector((state: RootState) => state.recipe.searchRecipeByIngredient)
    const search = searchedRecipes.length ? false : true

    const getRecipes = useCallback(async () => {
        const queryParams = { page, limit: recipesPerPage }
        const response = await recipeService.getAll(queryParams) 

        if (response.success) {
            dispatch(setRecipes(response?.success?.recipes))
            setTotalRecipes(response?.success?.total)
        } else {
            dispatch(setRecipes([]))
            setTotalRecipes(0)
        }
    }, [page, dispatch])
    

    useEffect(() => {
        getRecipes()
    }, [getRecipes])

    const handlePageChange = (_: unknown, value: number) => {
        setPage(value)
    }

    return (
        <>
            <SearchFilterRecipe />
            {search && <RecipeSlider />}
            <div style={{ display: "flex", width: "100%" }}>
                <div style={{ flex: 1, transition: "0.3s ease-in-out" }}>
                    <ViewRecipe/>
                    {search && (
                        <Pagination
                            count={Math.ceil(totalRecipes / recipesPerPage)}
                            page={page}
                            onChange={handlePageChange}
                            sx={{ display: "flex", justifyContent: "center", marginTop: 2 }}
                        />
                    )}
                </div>
            </div>
        </>
    )
})

export default MainRecipe
