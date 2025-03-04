import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectCurrentToken, selectCurrentUserId } from "../../components/app/redux/AuthSlice";
import config from "../../components/app/api/config/config";
import { Alert, AlertColor, Grid, Card, CardMedia, CardContent, Typography, CardActionArea, Box } from "@mui/material";
import { setCurrentUserRecipe } from "../../components/app/redux/Slice";
import { RootState } from "../../components/app/redux/Store";
import EditRecipe from "./EditRecipe";
import { Recipe } from "../../components/utils/RecipeInterface";
import { useNavigate } from "react-router-dom";

interface UserRecipeProps {
    handleClose: () => void;
}

const UserRecipe = (props: UserRecipeProps) => {
    const dispatch = useDispatch();
    const userId = useSelector(selectCurrentUserId);
    const token = useSelector(selectCurrentToken);
    const [message, setMessage] = useState<string>("");
    const [severity, setSeverity] = useState<AlertColor>("success");
    const recipes = useSelector((state: RootState) => state.recipe.currentUserRecipe);
    const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
    const navigate = useNavigate()

    const handleEditClick = (recipe: Recipe) => {
        props.handleClose()
        navigate(`/recipe/${recipe?._id}`)
    };

    const handleBack = () => {
        setSelectedRecipe(null);
    };

    useEffect(() => {
        const getRecipeByUser = async () => {
            try {
                const result = await fetch(`${config.apiUrl}/recipe/${userId}`, {
                    method: "POST",
                    body: JSON.stringify({ userId }),
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                });

                const response = await result.json();

                if (result.status === 200) {
                    dispatch(setCurrentUserRecipe(response.recipe));
                } else {
                    setSeverity("error");
                    setMessage(response.message);
                }
            } catch (error) {
                if (error instanceof Error) { 
                    setMessage(error.message); // ✅ Now TypeScript knows it's a string
                    setSeverity("error");
                } else {
                    setMessage("An unexpected error occurred"); // Fallback for non-Error types
                    setSeverity("error");
                }
            }
        };

        if (userId) getRecipeByUser();
    }, [dispatch, userId, token]);

    const handleClose = () => {
        setMessage("");
    };

    return (
        <Box sx={{ p: 3 }}>
            {/* Alert Message */}
            {message && (
                <Alert severity={severity} onClose={handleClose} sx={{ mb: 2 }}>
                    {message}
                </Alert>
            )}

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
                                            <CardMedia
                                                component="img"
                                                height="200"
                                                image={recipe.image ? `${config.apiUrl}/uploads/${recipe.image}` : "placeholder.jpg"}
                                                alt={recipe.title}
                                                sx={{ objectFit: "cover" }}
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
                        <Typography color="error" sx={{ textAlign: "center", mt: 2 }}>No recipes found!</Typography>
                    )}
                </>
            )}
        </Box>
    );
};

export default UserRecipe;
