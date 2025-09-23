import { LazyLoadImage } from "react-lazy-load-image-component"
import "react-lazy-load-image-component/src/effects/blur.css"
import { Grid, Card, CardContent, Typography, CardActionArea } from "@mui/material"
import { RootState } from "../../../store/Store"
import { useSelector } from "react-redux"
import { Recipe } from "../../../types/RecipeAuthInterface"
import { UserRecipeProps } from "../../../types/RecipeAuthInterface"
import EditRecipe from "./EditRecipe"
import { useState } from "react"

const API_URL = import.meta.env.VITE_API_URL

const MyRecipeDetail = (props: UserRecipeProps)=> {
    const recipes = useSelector((state: RootState) => state.recipe.currentUserRecipe)
    const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null)

   
    const handleBack = () => {
        setSelectedRecipe(null)
    }


    const handleEditClick = (recipe: Recipe) => {
        setSelectedRecipe(recipe)
    }

    return (
        <>
        {selectedRecipe ? (
            <EditRecipe recipe={selectedRecipe} onBack={handleBack} handleClose={props.handleClose}/>
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
                <Typography color="error" sx={{ textAlign: "center", mt: 2 }}>No Recipe Found!</Typography>
            )}
        </>
        )}  
        </>
    )
}

export default MyRecipeDetail