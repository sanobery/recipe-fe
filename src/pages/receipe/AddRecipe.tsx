import React ,{useState,useEffect} from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { TextField, Button, Box, Typography,Alert,AlertColor } from "@mui/material";
import IngredientSteps from "./IngredientSteps";
import { useDispatch, useSelector } from "react-redux";
import { selectCurrentUserId } from "../../components/app/redux/AuthSlice";
import { setRecipes } from "../../components/app/redux/Slice";
import { RootState } from "../../components/app/redux/Store";
import { fetchData } from "../../components/utils/FetchData";

// Define form data type
interface RecipeInputs {
    title: string;
    ingredients: string[]; 
    steps: string[]; 
    image: File|null;
    preparationTime:Number;
}
interface AddRecipeProps {
    handleClose: () => void;
    switchTo: () => void;
}

const AddRecipe: React.FC<AddRecipeProps> = ({handleClose,switchTo}) => {
    const {
        register,
        handleSubmit,
        setValue,
        reset,
        formState: { errors },
        watch
    } = useForm<RecipeInputs>();

    const ingredients = watch("ingredients", []);
    const steps = watch("steps", []);
    const [severity,setSeverity] = useState<AlertColor>("success");
    const isFormValid = ingredients.length > 0 && steps.length > 0;

    // Function to update ingredients in form
    const handleIngredientsChange = (ingredients: string[]) => {
        setValue("ingredients", ingredients);
    };

    const handleStepsChange = (steps: string[]) => {
        setValue("steps", steps);
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]; 
    
        if (file) {
            setValue("image", file);
        }
    };

    const dispatch = useDispatch()
    const recipes = useSelector((state: RootState) => state.recipe.recipes);
    const [message,setMessage] = useState("")
    const userId = useSelector(selectCurrentUserId)    

    const onSubmit: SubmitHandler<RecipeInputs> = async (data) => {
        const formData = new FormData();
        formData.append("title", data.title);
        formData.append("ingredients", JSON.stringify(data.ingredients));
        formData.append("steps", JSON.stringify(data.steps));
        formData.append("userId", userId); // No need to stringify `userid`
        if (data.image instanceof File) {
            formData.append("image", data.image); 
        } else {
            setMessage("Image is not a valid file object");
        }
        formData.append("preparationTime", data.preparationTime.toString());
    
        try {
            const result = await fetchData("http://localhost:3500/recipe", "POST", formData, true, true); // ✅ Pass `true` for `isFormData`
            
            if (result) {
                setMessage(result.message);
                dispatch(setRecipes([result.recipe, ...recipes]));
                setSeverity('success');
                reset();
                handleClose();
            } else {
                setMessage(result.message);
                setSeverity('error');
            }
        } catch (error:any) {
            setMessage(error.message);
            setSeverity('error');
        }
    };
    
    // const [showAlert, setShowAlert] = useState<boolean>(false);

    // const handleClose = () => {
    //     setShowAlert(false);
    // };
    
    // // Auto-close alert after 3 seconds
    // useEffect(() => {
    //     if (showAlert) {
    //         const timer = setTimeout(() => {
    //             setShowAlert(false);
    //         }, 3000);
    
    //         return () => clearTimeout(timer); // Cleanup timer on unmount
    //     }
    // }, [showAlert]);
    
    return (
        <Box
        sx={{
            maxWidth: 400,
            mx: "auto",
            mt: 5,
            p: 3,
            boxShadow: 3,
            borderRadius: 2,
            bgcolor: "white",
        }}
        >
        {message && 
        <Alert severity={severity} onClose={handleClose}>
            {message}
        </Alert>
        }
        <Typography variant="h5" gutterBottom textAlign="center">
            Add Recipe
        </Typography>
        <form onSubmit={handleSubmit(onSubmit)}>
            {/* Title Field */}
            <TextField
            fullWidth
            label="Title"
            variant="outlined"
            margin="normal"
            {...register("title", {
                required: "Title is required",
            })}
            error={!!errors.title}
            helperText={errors.title?.message}
            />

            <IngredientSteps onIngredientStepsChange={handleIngredientsChange}  recipename="Ingredient"/>

            <IngredientSteps onIngredientStepsChange={handleStepsChange} recipename="Steps"/>

            <TextField
            type="file"
            fullWidth
            onChange={handleFileChange}
            required
            />

<TextField
    fullWidth
    label="Preparation Time (in mins)"
    variant="outlined"
    margin="normal"
    type="number"  // Ensures numeric input
    {...register("preparationTime", {
        required: "Preparation Time is required",
        pattern: {
            value: /^[0-9]+$/, // Ensures only numbers
            message: "Only numbers are allowed",
        },
        min: {
            value: 1,
            message: "Preparation time must be at least 1 minute",
        }
    })}
    error={!!errors.preparationTime}
    helperText={errors.preparationTime?.message}
/>


            {/* Submit Button */}
            <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}  disabled={!isFormValid} >
                Submit Recipe
            </Button>
        </form>
        </Box>
    );
};

export default AddRecipe;
