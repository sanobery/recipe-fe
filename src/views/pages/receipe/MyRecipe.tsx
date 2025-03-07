import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import {selectCurrentUserId } from "../../../components/redux/AuthSlice"
import { Grid, Card, CardContent, Typography, CardActionArea, Box } from "@mui/material"
import { setCurrentUserRecipe } from "../../../components/redux/Slice"
import { RootState } from "../../../components/redux/Store"
import EditRecipe from "./EditRecipe"
import { Recipe } from "../../../utils/RecipeAuthInterface"
import { useNavigate } from "react-router-dom"
import recipeService from "../../../infrastructure/services/api/recipe/RecipeInstance"
import { LazyLoadImage } from "react-lazy-load-image-component"
import "react-lazy-load-image-component/src/effects/blur.css"
interface UserRecipeProps {
    handleClose: () => void
}

const API_URL = import.meta.env.VITE_API_URL

const UserRecipe = (props: UserRecipeProps) => {
    const dispatch = useDispatch()
    const userId = useSelector(selectCurrentUserId)
    const [message, setMessage] = useState<string>("")
    const recipes = useSelector((state: RootState) => state.recipe.currentUserRecipe)
    const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null)
    const navigate = useNavigate()

    const handleEditClick = (recipe: Recipe) => {
        props.handleClose()
        navigate(`/recipe/${recipe?._id}`)
    }

    const handleBack = () => {
        setSelectedRecipe(null)
    }

    useEffect(() => {
        const getRecipeByUser = async () => {
            const query = {userId:userId}
            const response = await recipeService.getUserRecipe(userId,query)
            if (response?.success) {
                dispatch(setCurrentUserRecipe(response?.success?.recipe))
            } else {
                setMessage(response?.error?.message)
            }
        }

        if (userId) getRecipeByUser()
    }, [dispatch, userId])


    return (
        <Box sx={{ p: 3 }}>          
            {selectedRecipe ? (
                <EditRecipe recipe={selectedRecipe} onBack={handleBack} />
            ) : (
                <>
                    <Typography variant="h5" gutterBottom sx={{ fontWeight: "bold", textAlign: "center" }}>
                        Your Recipes
                    </Typography>

                    {recipes.length > 0 ? (
                        <Grid container spacing={3} sx={{ mt: 2 }}>
                            {recipes.map((recipe) => (
                                <Grid item xs={12} sm={6} md={4} key={recipe._id}>
                                    <Card 
                                        sx={{ 
                                            maxWidth: 345, 
                                            transition: "0.3s",
                                            "&:hover": { transform: "scale(1.05)" },
                                            boxShadow: 3,
                                            borderRadius: 3
                                        }} 
                                    >
                                        <CardActionArea onClick={() => handleEditClick(recipe)}>
                                            <LazyLoadImage
                                                src={recipe?.image ? `${API_URL}/uploads/${recipe?.image}` : "placeholder.jpg"}
                                                height="200px"
                                                effect="blur" 
                                                style={{ objectFit: "cover" }}
                                            />
                                            <CardContent>
                                                <Typography variant="h6"  
                                                sx={{ 
                                                    fontWeight: "bold", 
                                                    whiteSpace: "nowrap", 
                                                    overflow: "hidden", 
                                                    textOverflow: "ellipsis", 
                                                    display: "block", 
                                                    maxWidth: "100%", 
                                                    height: 32 // Fixed height for consistency
                                                }}>
                                                    {recipe.title}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    Prep Time: {recipe.preparationTime} mins
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    ⭐ {recipe.averageRating} / 5
                                                </Typography>
                                            </CardContent>
                                        </CardActionArea>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    ) : (
                        <Typography color="error" sx={{ textAlign: "center", mt: 2 }}>{message}</Typography>
                    )}
                </>
            )}
        </Box>
    )
}

export default UserRecipe
