import { useDispatch, useSelector } from "react-redux";
import { setRecipe } from "../../components/app/redux/Slice";
import { RootState } from "../../components/app/redux/Store";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchData } from "../../components/utils/FetchData";
import config from "../../components/app/api/config/config";
import { Box, Stack, Typography, List, ListItem, ListItemText, ListItemIcon, Divider, IconButton } from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const RecipeDetail = () => {
    const { id } = useParams();
    const recipe = useSelector((state: RootState) => state.recipe.selectedRecipe);
    const dispatch = useDispatch();
    const navigate = useNavigate()    

    useEffect(() => {
        const getRecipe = async () => {
            try {
                const res = await fetchData(`${config.apiUrl}/recipe/${id}`);
                dispatch(setRecipe(res));
            } catch (error) {
                console.error("Fetch Error:", error);
            }
        };

        getRecipe();
    }, [dispatch, id]);

    if (!recipe) {
        return <Typography sx={{ textAlign: "center", mt: 4 }}>Loading...</Typography>;
    }

    return (
        <Box sx={{ p: 3 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, justifyContent: "space-between" }}>
                <Typography variant="h5" sx={{ fontWeight: "bold",textAlign:'center', flexGrow: 1 }}>
                    Created By - {recipe?.userId?.username?.toUpperCase()}
                </Typography>
                <IconButton onClick={() => navigate(-1)}>
                    <ArrowBackIcon fontSize="large" />
                </IconButton>
            </Box>

            <Divider />

            {/* Centered Image */}
            <Box sx={{ display: "flex", justifyContent: "center", mb: 4 ,mt:3}}>
                <img
                    src={recipe?.image ? `${config.apiUrl}/uploads/${recipe?.image}` : "placeholder.jpg"}
                    alt={recipe?.title}
                    style={{ width: "100%", maxWidth: "400px", borderRadius: "10px", boxShadow: "0 4px 10px rgba(0,0,0,0.1)" }}
                />
            </Box>

            {/* Recipe Details */}
            <Stack spacing={3} sx={{ maxWidth: "800px", mx: "auto" }}>
                
                <Typography variant="h6" sx={{ textAlign: "center", fontWeight: "bold" }}>
                    Title of Recipe -{recipe?.title}
                </Typography>

                <Typography variant="body1" color="text.secondary" sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <AccessTimeIcon sx={{ mr: 1 }} /> Preparation Time - {recipe?.preparationTime} minutes
                </Typography>

                <Divider />

                {/* Ingredients */}
                <Box>
                    <Typography variant="h5">
                        <ShoppingCartIcon color="warning" sx={{ verticalAlign: "middle", fontSize: "1.2em" }} /> Ingredients:
                    </Typography>
                    <List dense>
                        {recipe?.ingredients.map((ingredient, index) => (
                            <ListItem key={index}>
                                <ListItemIcon>
                                    <CheckCircleIcon color="primary" />
                                </ListItemIcon>
                                <ListItemText primary={ingredient} />
                            </ListItem>
                        ))}
                    </List>
                </Box>

                <Divider />

                {/* Steps */}
                <Box>
                    <Typography variant="h5">
                        <MenuBookIcon color="info" sx={{ verticalAlign: "middle", fontSize: "1.2em" }} /> Instructions:
                    </Typography>
                    <List dense>
                        {recipe?.steps.map((step, index) => (
                            <ListItem key={index} sx={{ alignItems: "flex-start" }}>
                                <Typography variant="body1">
                                    Step {index + 1}: {step}
                                </Typography>
                            </ListItem>
                        ))}
                    </List>
                </Box>
            </Stack>
        </Box>
    );
};

export default RecipeDetail;
