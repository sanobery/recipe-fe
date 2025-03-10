import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import {selectCurrentUserId } from "../../../components/redux/AuthSlice"
import { setCurrentUserRecipe } from "../../../components/redux/Slice"
// import EditRecipe from "./EditRecipe"
// import { Recipe } from "../../../utils/RecipeAuthInterface"
import recipeService from "../../../infrastructure/services/api/recipe/RecipeInstance"
import MyRecipeDetail from "./MyRecipeDetail"
import { Box } from "@mui/material"
interface UserRecipeProps {
    handleClose: () => void
}

const UserRecipe = (props: UserRecipeProps) => {
    const dispatch = useDispatch()
    const userId = useSelector(selectCurrentUserId)

    useEffect(() => {
        const getRecipeByUser = async () => {
            const query = {userId:userId}
            const response = await recipeService.getUserRecipe(userId,query)
            if (response?.success) {
                dispatch(setCurrentUserRecipe(response?.success?.recipe))
            }
        }

        if (userId) getRecipeByUser()
    }, [dispatch, userId])


    return (
        <Box sx={{ p: 3 }}>          
            <MyRecipeDetail handleClose={props.handleClose}/>                    
        </Box>
    )
}

export default UserRecipe
