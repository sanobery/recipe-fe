import {
    Box,
    Typography,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    Divider,
    IconButton,
} from '@mui/material'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { useSelector } from 'react-redux'
import { RootState } from '../../../store/Store'
import { useNavigate } from 'react-router-dom'
import { getApiUrl } from '../../../infrastructure/services/api/config'
import {
    CustomLazyLoadImage,
    StyledAccessTimeIcon,
    StyledCommentIcon,
    StyledImageBox,
    StyledListItem,
    StyledMenuBookIcon,
    StyledRating,
    StyledRecipeBox,
    StyledRecipeDetailBox,
    StyledShoppingCartIcon,
    StyledStack,
    StyledStarIcon,
    StyledTypographyMargin,
} from '../../styles/styles'

const API_URL = getApiUrl()
const RecipeDetailPage = () => {
    const recipe = useSelector((state: RootState) => state.recipe.selectedRecipe)
    const navigate = useNavigate()

    // Ensure ratings and comments are always arrays
    const ratingsArray = Array.isArray(recipe?.ratings)
        ? recipe?.ratings
        : recipe?.ratings
          ? [recipe?.ratings]
          : []
    const commentsArray = Array.isArray(recipe?.comments) ? recipe?.comments : []

    return (
        <>
            {recipe ? (
                <Box className="padding pointer">
                    {/* Header Section */}
                    <StyledRecipeBox>
                        <Typography variant="h5" className="flex textStyle">
                            Created By - {recipe?.userId?.username?.toUpperCase() || 'Unknown'}
                        </Typography>
                        <IconButton onClick={() => navigate(-1)}>
                            <ArrowBackIcon fontSize="large" />
                        </IconButton>
                    </StyledRecipeBox>

                    <Divider />

                    {/* Centered Image */}
                    <StyledImageBox>
                        <CustomLazyLoadImage
                            src={
                                recipe.image
                                    ? `${API_URL}/uploads/${recipe.image}`
                                    : 'placeholder.jpg'
                            }
                            effect="blur" //  Apply blur effect while loading
                        />
                    </StyledImageBox>

                    {/* Recipe Details */}
                    <StyledStack spacing={3}>
                        <StyledRecipeDetailBox>
                        <Typography variant="h6">
                            Title of Recipe - {recipe?.title || 'Untitled'}
                        </Typography>

                        <Typography variant="body1" color="text.secondary" className="display">
                            <StyledRating
                                value={Math.ceil(recipe?.averageRating || 0)}
                                me={2}
                                readOnly
                            />
                        </Typography>

                        <Typography variant="body1" color="text.secondary" className="display">
                            <StyledAccessTimeIcon /> Preparation Time -{' '}
                            {recipe?.preparationTime || 0} minutes
                        </Typography>
</StyledRecipeDetailBox>
                        {/* Ingredients & Instructions */}

                        <StyledRecipeDetailBox>
                            {/* Ingredients Heading */}
                            <Typography variant="h5" className="display marginBottom">
                                <StyledShoppingCartIcon color="warning" />
                                Ingredients:
                            </Typography>

                            {/* Ingredients List */}
                            <List dense className="imgPreview">
                                {recipe?.ingredients?.length ? (
                                    recipe.ingredients.map((ingredient, index) => (
                                        <ListItem key={index}>
                                            <ListItemIcon>
                                                <CheckCircleIcon color="primary" />
                                            </ListItemIcon>
                                            <ListItemText primary={ingredient} />
                                        </ListItem>
                                    ))
                                ) : (
                                    <Typography variant="body2" color="text.secondary">
                                        No ingredients listed.
                                    </Typography>
                                )}
                            </List>
                        </StyledRecipeDetailBox>

                        {/* Instructions */}
                        <StyledRecipeDetailBox>
                            <Typography variant="h5">
                                <StyledMenuBookIcon color="info" /> Instructions:
                            </Typography>
                            <List dense>
                                {recipe?.steps?.length ? (
                                    recipe.steps.map((step, index) => (
                                        <ListItem key={index}>
                                            <Typography variant="body1">
                                                Step {index + 1}: {step}
                                            </Typography>
                                        </ListItem>
                                    ))
                                ) : (
                                    <Typography variant="body2" color="text.secondary">
                                        No instructions provided.
                                    </Typography>
                                )}
                            </List>
                        </StyledRecipeDetailBox>

                        <Divider />

                        {/* Ratings Section */}
                        <StyledRecipeDetailBox>
                            <Typography variant="h5">
                                <StyledStarIcon /> Ratings:
                            </Typography>
                            {ratingsArray.length > 0 ? (
                                <List dense>
                                    {ratingsArray.map((rating) => (
                                        <StyledListItem key={rating?._id}>
                                            <ListItemText
                                                primary={
                                                    <Typography>
                                                        {rating?.userId?.username || 'Anonymous'}
                                                        <StyledRating
                                                            value={Math.ceil(rating?.rate || 0)}
                                                            me={2}
                                                            readOnly
                                                        />
                                                    </Typography>
                                                }
                                                secondary={
                                                    rating?.createdAt
                                                        ? new Date(
                                                              rating.createdAt
                                                          ).toLocaleString()
                                                        : 'Date not available'
                                                }
                                            />
                                        </StyledListItem>
                                    ))}
                                </List>
                            ) : (
                                <Typography variant="body2" color="text.secondary">
                                    No ratings yet.
                                </Typography>
                            )}
                        </StyledRecipeDetailBox>

                        <Divider />

                        {/* Comments Section */}
                        <StyledRecipeDetailBox>
                            <Typography variant="h5">
                                <StyledCommentIcon /> Comments:
                            </Typography>
                            {commentsArray.length > 0 ? (
                                <List dense>
                                    {commentsArray.map((comment) => (
                                        <ListItem key={comment._id} alignItems="flex-start">
                                            <ListItemText
                                                primary={`${comment.userId?.username || 'Anonymous'}:`}
                                                secondary={comment.comment}
                                            />
                                        </ListItem>
                                    ))}
                                </List>
                            ) : (
                                <Typography variant="body2" color="text.secondary">
                                    No comments yet.
                                </Typography>
                            )}
                        </StyledRecipeDetailBox>
                    </StyledStack>
                </Box>
            ) : (
                <StyledTypographyMargin>Loading...</StyledTypographyMargin>
            )}
        </>
    )
}

export default RecipeDetailPage
