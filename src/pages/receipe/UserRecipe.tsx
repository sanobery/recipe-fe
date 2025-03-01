import { useEffect,useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { selectCurrentToken, selectCurrentUserId } from "../../components/app/redux/AuthSlice"
import config from "../../components/app/api/config/config"
import { Alert, AlertColor,List, ListItem, ListItemText, Paper, Typography } from "@mui/material"
import withAuth from "../auth/WithAuthCheck"
import { setCurrentUserRecipe } from "../../components/app/redux/Slice"
import { RootState } from "../../components/app/redux/Store";
import EditRecipe from "./EditRecipe"

const UserRecipe = ()=>{
    const dispatch = useDispatch()
    const userId = useSelector(selectCurrentUserId)
    const token = useSelector(selectCurrentToken)
    const [message,setMessage] = useState("")
    const [severity,setSeverity] = useState<AlertColor>("success")
    const recipes = useSelector((state: RootState) => state.recipe.currentUserRecipe);
    const [selectedRecipe, setSelectedRecipe] = useState(null);

    const handleEditClick = (recipe) => {
        setSelectedRecipe(recipe); // Store the clicked recipe
    };

    const handleBack = () => {
        setSelectedRecipe(null); // Reset and return to UserRecipe
    };
    
    useEffect(()=>{
        const getRecipeByUser = async () => {
            try{
                const result = await fetch(`${config.apiUrl}/recipe/${userId}`,{
                    method:"POST",
                    body:JSON.stringify({userId}),
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                });
                let response = await result.json()
                
                if(result.status === 200){
                    dispatch(setCurrentUserRecipe(response.recipe))
                }
                else {
                    setSeverity("error")
                    setMessage(response.message)
                }
            }
            catch(e){
                console.log(e);
            }
        }
        getRecipeByUser();
    },[dispatch])

    const handleClose = () => {
        setMessage('');
    };

    return(
        <>
        {/* Alert Message */}
        {message && (
            <Alert severity={severity} onClose={handleClose}>
                {message}
            </Alert>
        )}

        {selectedRecipe ? (
            <EditRecipe recipe={selectedRecipe} onBack={handleBack} />
            ) : (
            <Paper elevation={3} sx={{ padding: 2, marginTop: 2 }}>
                <Typography variant="h6" gutterBottom>
                    Recipe List
                </Typography>
                <List>
                    {recipes.length > 0 ? (
                        recipes.map((recipe, index) => (
                            <ListItem 
                                key={index} 
                                divider 
                                button 
                                onClick={() => handleEditClick(recipe)}
                            >
                                <ListItemText 
                                    primary={recipe?.title} 
                                    secondary={`Preparation Time: ${recipe?.preparationTime}`} 
                                />
                            </ListItem>
                        ))
                    ) : (
                        <Typography color="error">No recipes found!</Typography>
                    )}
                </List>
            </Paper>
            )} 
        </>
    )
}

export default (UserRecipe)