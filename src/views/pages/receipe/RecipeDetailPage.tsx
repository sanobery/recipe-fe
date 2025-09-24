import { 
    Box, Stack, Typography, List, ListItem, ListItemText, ListItemIcon, Divider, IconButton, Rating 
} from "@mui/material"
import AccessTimeIcon from "@mui/icons-material/AccessTime"
import CheckCircleIcon from "@mui/icons-material/CheckCircle"
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart"
import MenuBookIcon from "@mui/icons-material/MenuBook"
import ArrowBackIcon from "@mui/icons-material/ArrowBack"
import StarIcon from "@mui/icons-material/Star"
import CommentIcon from "@mui/icons-material/Comment"
import { LazyLoadImage } from "react-lazy-load-image-component"
import { useSelector } from "react-redux"
import { RootState } from "../../../store/Store"
import { useNavigate } from "react-router-dom"
import { getApiUrl } from "../../../infrastructure/services/api/config"

const API_URL = getApiUrl()
const RecipeDetailPage = ()=>{
    const recipe = useSelector((state: RootState) => state.recipe.selectedRecipe)
    const navigate = useNavigate()  

    // Ensure ratings and comments are always arrays
    const ratingsArray = Array.isArray(recipe?.ratings) ? recipe?.ratings : recipe?.ratings ? [recipe?.ratings] : []
    const commentsArray = Array.isArray(recipe?.comments) ? recipe?.comments : []

    return (
        <>
        { recipe ? (
            <Box sx={{ p: 3, cursor: "pointer" }}>
                {/* Header Section */}
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, justifyContent: "space-between" }}>
                    <Typography variant="h5" sx={{ fontWeight: "bold", textAlign: "center", flexGrow: 1 }}>
                        Created By - {recipe?.userId?.username?.toUpperCase() || "Unknown"}
                    </Typography>
                    <IconButton onClick={() => navigate(-1)}>
                        <ArrowBackIcon fontSize="large" />
                    </IconButton>
                </Box>

                <Divider />

                {/* Centered Image */}
                <Box sx={{ display: "flex", justifyContent: "center", my: 3 }}>
                    <LazyLoadImage
                    src={recipe.image ? `${API_URL}/uploads/${recipe.image}` : "placeholder.jpg"}
                    effect="blur" //  Apply blur effect while loading
                    style={{ width: "100%", maxWidth: "400px", borderRadius: "10px", boxShadow: "0 4px 10px rgba(0,0,0,0.1)" }}
                    />
                </Box>

                {/* Recipe Details */}
                <Stack spacing={3} sx={{ maxWidth: "800px", mx: "auto" }}>
                    <Typography variant="h6" sx={{ textAlign: "center", fontWeight: "bold" }}>
                        Title of Recipe - {recipe?.title || "Untitled"}
                    </Typography>

                    <Typography variant="body1" color="text.secondary" sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <Rating value={Math.ceil(recipe?.averageRating || 0)} sx={{ me: 2 }} readOnly />
                    </Typography>

                    <Typography variant="body1" color="text.secondary" sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <AccessTimeIcon sx={{ mr: 1 }} /> Preparation Time - {recipe?.preparationTime || 0} minutes
                    </Typography>

                    <Divider />

                    {/* Ingredients & Instructions */}
                    <Box sx={{ display: "flex", gap: 4, justifyContent: "center", flexWrap: "wrap" }}>
                        {/* Ingredients */}
                        <Box sx={{ width: "45%" }}>
                            <Typography variant="h5">
                                <ShoppingCartIcon color="warning" sx={{ verticalAlign: "middle", fontSize: "1.2em" }} /> Ingredients:
                            </Typography>
                            <List dense>
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
                        </Box>

                        {/* Instructions */}
                        <Box sx={{ width: "45%" }}>
                            <Typography variant="h5">
                                <MenuBookIcon color="info" sx={{ verticalAlign: "middle", fontSize: "1.2em" }} /> Instructions:
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
                        </Box>
                    </Box>

                    <Divider />

                    {/* Ratings Section */}
                    <Box>
                        <Typography variant="h5">
                            <StarIcon sx={{ color: "#FF9800" }} /> Ratings:
                        </Typography>
                        {ratingsArray.length > 0 ? (
                            <List dense>
                                {ratingsArray.map((rating) => (
                                    <ListItem key={rating?._id} sx={{ display: "flex", justifyContent: "space-between" }}>
                                        <ListItemText
                                            primary={
                                                <Typography>
                                                    {rating?.userId?.username || "Anonymous"}
                                                    <Rating value={Math.ceil(rating?.rate || 0)} sx={{ me: 2 }} readOnly />
                                                </Typography>
                                            }
                                            secondary={rating?.createdAt ? new Date(rating.createdAt).toLocaleString() : "Date not available"}
                                        />
                                    </ListItem>
                                ))}
                            </List>
                        ) : (
                            <Typography variant="body2" color="text.secondary">
                                No ratings yet.
                            </Typography>
                        )}
                    </Box>

                    <Divider />

                    {/* Comments Section */}
                    <Box>
                        <Typography variant="h5">
                            <CommentIcon sx={{ color: "#333", mt: 0.5 }} /> Comments:
                        </Typography>
                        {commentsArray.length > 0 ? (
                            <List dense>
                                {commentsArray.map((comment) => (
                                    <ListItem key={comment._id} alignItems="flex-start">
                                        <ListItemText
                                            primary={`${comment.userId?.username || "Anonymous"}:`}
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
                    </Box>
                </Stack>
            </Box>
        ):(
            <Typography sx={{ textAlign: "center", mt: 4 }}>Loading...</Typography>
        )}
        </>
    )
}

export default RecipeDetailPage