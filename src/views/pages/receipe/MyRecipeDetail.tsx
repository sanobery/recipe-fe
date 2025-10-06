import 'react-lazy-load-image-component/src/effects/blur.css'
import { Grid, CardContent, Typography, CardActionArea } from '@mui/material'
import { RootState } from '../../../store/Store'
import { useSelector } from 'react-redux'
import { Recipe } from '../../../types/RecipeAuthInterface'
import { UserRecipeProps } from '../../../types/RecipeAuthInterface'
import EditRecipe from './EditRecipe'
import { useState } from 'react'
import { ConstantMessages } from '../../../constants/ConstantMessages'
import {
    StyledCard,
    StyledGrid,
    StyledLazyLoadImage,
    StyledMyRecipe,
    StyledTypographyMargin,
} from '../../styles/styles'

const API_URL = import.meta.env.VITE_API_URL

const MyRecipeDetail = (props: UserRecipeProps) => {
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
                <EditRecipe
                    recipe={selectedRecipe}
                    onBack={handleBack}
                    handleClose={props.handleClose}
                />
            ) : (
                <>
                    <Typography variant="h5" gutterBottom className="textStyle">
                        Your Recipes
                    </Typography>
                    {recipes.length > 0 ? (
                        <StyledGrid container spacing={3}>
                            {recipes.map((recipe) => (
                                // @ts-ignore
                                <Grid item xs={12} sm={12} md={6} key={recipe._id}>
                                    <StyledCard>
                                        <CardActionArea onClick={() => handleEditClick(recipe)}>
                                            <StyledLazyLoadImage
                                                src={
                                                    recipe?.image
                                                        ? `${API_URL}/uploads/${recipe?.image}`
                                                        : 'placeholder.jpg'
                                                }
                                                height="200px"
                                                width="550px"
                                                effect="blur"
                                            />
                                            <CardContent>
                                                <StyledMyRecipe variant="h6">
                                                    {recipe.title}
                                                </StyledMyRecipe>
                                                <Typography variant="body2" color="text.secondary">
                                                    Prep Time: {recipe.preparationTime} mins
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    ⭐ {recipe.averageRating} / 5
                                                </Typography>
                                            </CardContent>
                                        </CardActionArea>
                                    </StyledCard>
                                </Grid>
                            ))}
                        </StyledGrid>
                    ) : (
                        <StyledTypographyMargin color="error" aria-label="noRecipe">
                            {ConstantMessages.NO_RECIPE}
                        </StyledTypographyMargin>
                    )}
                </>
            )}
        </>
    )
}

export default MyRecipeDetail
