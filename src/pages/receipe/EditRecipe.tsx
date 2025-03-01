import { Button, Typography } from "@mui/material";

const EditRecipe = ({ recipe, onBack }) => {
    return (
        <div>
            <Typography variant="h5">Edit Recipe</Typography>
            <Typography variant="subtitle1">{recipe?.title}</Typography>
            <Typography variant="body2">Preparation Time: {recipe?.preparationTime}</Typography>
            
            {/* Back Button */}
            <Button variant="contained" color="primary" onClick={onBack} sx={{ marginTop: 2 }}>
                Back to Recipes
            </Button>
        </div>
    );
};

export default EditRecipe;
