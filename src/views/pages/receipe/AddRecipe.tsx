import React, { useState } from "react"
import { useForm, SubmitHandler } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { TextField, Button, Box, Typography, Snackbar } from "@mui/material"
import IngredientSteps from "./IngredientSteps"
import { useDispatch, useSelector } from "react-redux"
import { selectCurrentUserId } from "../../../store/AuthSlice"
import { setRecipes } from "../../../store/Slice"
import { RootState } from "../../../store/Store"
import recipeService from "../../../infrastructure/services/api/recipe/RecipeInstance"
import CustomField from "../../../components/CustomField"
import { ConstantMessages, getMessage } from "../../../constants/ConstantMessages"

// Zod schema for  adding recipe
const addRecipeSchema = z.object({
  title: z.string().min(1, { message: getMessage("title", "required") }),
  ingredients: z.array(z.string()).min(1, "Add at least one ingredient"),
  steps: z.array(z.string()).min(1, "Add at least one step"),
  preparationTime: z
    .number()
    .min(1, ConstantMessages.PREP_TIME_MIN)
    .max(100, ConstantMessages.PREP_TIME_MAX),
  image: z
    .any()
    .refine((file) => file instanceof File, {
      message: ConstantMessages.IMAGE_INVALID_FILE,
    }),
})

type FormData = z.infer<typeof addRecipeSchema>

interface AddRecipeProps {
  handleClose: () => void
}

const AddRecipe: React.FC<AddRecipeProps> = ({ handleClose }) => {
    const {
        register,
        handleSubmit,
        setValue,
        watch,
        reset,
        formState: { errors },
    } = useForm<FormData>({
        resolver: zodResolver(addRecipeSchema),
        defaultValues: {
        title: "",
        ingredients: [],
        steps: [],
        preparationTime: 1,
        image: null },
    })

    const ingredients = watch("ingredients")
    const steps = watch("steps")
    const [message, setMessage] = useState<string>("")
    const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false)
    const dispatch = useDispatch()
    const recipes = useSelector((state: RootState) => state.recipe.recipes)
    const userId = useSelector(selectCurrentUserId)

    const handleIngredientsChange = (ingredients: string[]) => setValue("ingredients", ingredients)
    const handleStepsChange = (steps: string[]) => setValue("steps", steps)

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (file) {
        const allowedTypes = ["image/jpeg", "image/jpg", "image/png"]
        if (!allowedTypes.includes(file.type)) {
            setMessage(ConstantMessages.IMAGE_INVALID)
            setSnackbarOpen(true)
            return
        }
        setValue("image", file)
        }
    }

    // =============================================
    // Handle Submission of Form for Adding Recipe
    // =============================================
    // - Collects and validates form input data (e.g., title, ingredients, steps)
    // - Utilizes schema validation (e.g., Zod) to ensure correctness
    // - Submits validated data to the backend API/service
    // - Provides user feedback (success or error notifications)
    // - Ensures smooth user experience with proper error handling
    // - Maintains data integrity and prevents invalid submissions
    // =============================================
    const onSubmit: SubmitHandler<FormData> = async (data) => {
        const formData = new FormData()
        formData.append("title", data.title)
        formData.append("ingredients", JSON.stringify(data.ingredients))
        formData.append("steps", JSON.stringify(data.steps))
        formData.append("userId", String(userId))
        formData.append("preparationTime", data.preparationTime.toString())

        if (data.image instanceof File) {
        formData.append("image", data.image)
        }

        const response = await recipeService.addRecipe(formData)
        if (response?.success) {
        setMessage(response.success.message)
        dispatch(setRecipes([response.success.recipe, ...recipes.slice(0, -1)]))
        reset()
        setSnackbarOpen(true)
        setTimeout(() => handleClose(), 2000)
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
            ContentProps={{ sx: { backgroundColor: "#FF5722", color: "white" } }}
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
            {/* Title */}
            <CustomField label="Title" name="title" register={register} errors={errors} />

            {/* Ingredients & Steps */}
            <IngredientSteps onIngredientStepsChange={handleIngredientsChange} recipename="Ingredient" />
            <IngredientSteps onIngredientStepsChange={handleStepsChange} recipename="Steps" />

            {/* File */}
            <TextField type="file" fullWidth onChange={handleFileChange} required />

            {/* Preparation Time */}
            <TextField
                fullWidth
                label="Preparation Time (in mins)"
                variant="outlined"
                margin="normal"
                type="number"
                {...register("preparationTime", { valueAsNumber: true })}
                error={!!errors.preparationTime}
                helperText={errors.preparationTime?.message}
            />

            <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                sx={{ mt: 2 }}
                disabled={ingredients.length === 0 || steps.length === 0}
            >
                Submit Recipe
            </Button>
            </form>
        </Box>
        </>
    )
}

export default AddRecipe
