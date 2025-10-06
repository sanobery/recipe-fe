import React, { useState, useEffect, useCallback } from 'react'
import useSWR from 'swr'
import recipeService from '../../../infrastructure/services/api/recipe/RecipeInstance'
import { RootState } from '../../../store/Store'
import { useDispatch, useSelector } from 'react-redux'
import SearchFilterRecipe from './SearchFilterRecipe'
import RecipeSlider from './RecipeSlider'
import ViewRecipe from './ViewRecipe'
import { setRecipes } from '../../../store/Slice'
import { StyledDiv, StyledPageDiv, StyledPagination } from '../../styles/styles'

const MainRecipe = React.memo(() => {
    const dispatch = useDispatch()
    const [page, setPage] = useState<number>(1)
    const recipesPerPage = 4
    const [totalRecipes, setTotalRecipes] = useState<number>(0)
    const searchedRecipes = useSelector((state: RootState) => state.recipe.searchRecipeByIngredient)
    const search = searchedRecipes.length ? false : true

    const fetcher = async () => {
        const queryParams = { page, limit: recipesPerPage }
        const response = await recipeService.getAll(queryParams)
        return response.success || { recipes: [], total: 0 }
    }

    const { data } = useSWR(['recipes', page], fetcher)

    const getRecipes = useCallback(async () => {
        if (data) {
            dispatch(setRecipes(data.recipes))
            setTotalRecipes(data.total)
        }
    }, [data, dispatch])

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
            <StyledDiv>
                <StyledPageDiv>
                    <ViewRecipe />
                    {search && (
                        <StyledPagination
                            count={Math.ceil(totalRecipes / recipesPerPage)}
                            page={page}
                            onChange={handlePageChange}
                        />
                    )}
                </StyledPageDiv>
            </StyledDiv>
        </>
    )
})

export default MainRecipe
