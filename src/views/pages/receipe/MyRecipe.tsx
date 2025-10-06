import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { selectCurrentUserId } from '../../../store/AuthSlice'
import { setCurrentUserRecipe } from '../../../store/Slice'
import recipeService from '../../../infrastructure/services/api/recipe/RecipeInstance'
import MyRecipeDetail from './MyRecipeDetail'
import { Box } from '@mui/material'
import useSWR from 'swr'
interface UserRecipeProps {
    handleClose: () => void
}

const UserRecipe = (props: UserRecipeProps) => {
    const dispatch = useDispatch()
    const userId = useSelector(selectCurrentUserId)

    // =============================================
    // Fetch Recipes for a Specific Client
    // =============================================
    // - Retrieves recipes associated with a given client
    // - Ensures only client-specific data is returned
    // - Can be used for personalized dashboards or reports
    // - Helps maintain data segregation and access control
    // - Supports better user experience through filtered results
    // =============================================
    const fetcher = async () => {
        const query = { userId: userId }
        const response = await recipeService.getUserRecipe(userId, query)
        if (response.success) {
            return response.success
        } else {
            throw new Error(response.error?.message)
        }
    }

    const { data } = useSWR([userId], fetcher)

    useEffect(() => {
        const getRecipeByUser = async () => {
            if (data) {
                dispatch(setCurrentUserRecipe(data.recipe))
            }
        }

        if (userId) getRecipeByUser()
    }, [dispatch, data])

    return (
        <Box className="padding">
            <MyRecipeDetail handleClose={props.handleClose} />
        </Box>
    )
}

export default UserRecipe
