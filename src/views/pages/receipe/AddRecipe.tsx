import React ,{useState} from "react"
import { useForm, SubmitHandler } from "react-hook-form"
import { TextField, Button, Box, Typography, Snackbar } from "@mui/material"
import IngredientSteps from "./IngredientSteps"
import { useDispatch, useSelector } from "react-redux"
import { selectCurrentUserId } from "../../../components/redux/AuthSlice"
import { setRecipes } from "../../../components/redux/Slice"
import { RootState } from "../../../components/redux/Store"
import { RecipeInputs } from "../../../utils/RecipeAuthInterface"
import recipeService from "../../../infrastructure/services/api/recipe/RecipeInstance"

interface AddRecipeProps {
    handleClose: () => void
}

const AddRecipe: React.FC<AddRecipeProps> = ({handleClose}) => {
    const {
        register,
        handleSubmit,
        setValue,
        reset,
        formState: { errors },
        watch
    } = useForm<RecipeInputs>()

    const ingredients = watch("ingredients", [])
    const steps = watch("steps", [])
    const [message,setMessage] = useState<string>("")
    const isFormValid = ingredients.length > 0 && steps.length > 0
    const dispatch = useDispatch()
    const recipes = useSelector((state: RootState) => state?.recipe?.recipes)
    const userId = useSelector(selectCurrentUserId) 
    const [snackbarOpen,setSnackbarOpen] = useState<boolean>(false)

    // Function to update ingredients in form
    const handleIngredientsChange = (ingredients: string[]) => {
        setValue("ingredients", ingredients)
    }

    const handleStepsChange = (steps: string[]) => {
        setValue("steps", steps)
    }

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0] 
    
        if (file) {
            const allowedTypes = ["image/jpeg", "image/jpg", "image/png"]
            if (!allowedTypes.includes(file.type)) {
                setMessage("Only JPEG, JPG, or PNG files are allowed")
                setSnackbarOpen(true)
                return
            }
    
            setValue("image", file)
        }
    }

    const onSubmit: SubmitHandler<RecipeInputs> = async (data) => {
        const formData = new FormData()
        formData.append("title", data.title)
        formData.append("ingredients", JSON.stringify(data.ingredients))
        formData.append("steps", JSON.stringify(data.steps))
        formData.append("userId", String(userId))
        if (data.image instanceof File) {
            formData.append("image", data.image) 
        } else {
            setMessage("Image is not a valid file object")
        }
        formData.append("preparationTime", data.preparationTime.toString())
        
        const response = await recipeService.addRecipe(formData)

        if(response?.success) {
            setMessage(response?.success?.message)
            dispatch(setRecipes([response?.success?.recipe, ...recipes.slice(0,-1)]))
            reset()
            setSnackbarOpen(true)
            setTimeout( ()=>{
                handleClose()
            },2000)
        } else {
            setMessage(response?.error?.message)
            setSnackbarOpen(true)
        }
    }
    
    return (
        <>
        <Snackbar
            open={snackbarOpen}
            autoHideDuration={2000}
            onClose={() => setSnackbarOpen(false)}
            message={message}
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
            ContentProps={{
                sx: { backgroundColor: "#FF5722", color: "white" },
            }}
        />
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
                required: "Title is required"
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
                type="number"
                {...register("preparationTime", {
                    required: "Preparation Time is required",
                    pattern: {
                        value: /^[0-9]+$/, 
                        message: "Only numbers are allowed",
                    },
                    min: {
                        value: 1,
                        message: "Preparation time must be at least 1 minute",
                    },
                    max: {
                        value: 100, // Enforces max value
                        message: "Preparation time cannot exceed 100 minutes",
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
        </>
    )
}

export default AddRecipe
