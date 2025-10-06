import { useState } from 'react'
import { Button, Typography, TextField, Box, Snackbar } from '@mui/material'
import { RecipeInputs, Recipe } from '../../../types/RecipeAuthInterface'
import { useSelector } from 'react-redux'
import { selectCurrentUserId } from '../../../store/AuthSlice'
import recipeService from '../../../infrastructure/services/api/recipe/RecipeInstance'
import {
    CustomSnackbarContent,
    StyleBoxContent,
    StyledPaper,
    SubmitButton,
} from '../../styles/styles'

const API_URL = import.meta.env.VITE_API_URL

interface EditRecipeProps {
    recipe: Recipe
    onBack: () => void
    handleClose: () => void
}

const EditRecipe = ({ recipe, onBack, handleClose }: EditRecipeProps) => {
    const userId = useSelector(selectCurrentUserId)
    const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false)
    const [message, setMessage] = useState<string>('')
    const [imagePreview, setImagePreview] = useState<string>(
        recipe?.image ? `${API_URL}/uploads/${recipe.image}` : ''
    )

    const [formData, setFormData] = useState<RecipeInputs>({
        title: recipe?.title || '',
        preparationTime: recipe?.preparationTime || 0,
        image: '',
        ingredients: recipe?.ingredients || [],
        steps: recipe?.steps || [],
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: name === 'preparationTime' ? Number(value) : value,
        }))
    }

    // Handle file selection & preview update
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png']
            if (!allowedTypes.includes(file.type)) {
                setMessage('Only JPEG, JPG, or PNG files are allowed')
                setSnackbarOpen(true)
                return
            }

            const imageUrl = URL.createObjectURL(file)
            setImagePreview(imageUrl)

            setFormData((prev) => ({
                ...prev,
                image: file, // Store the file in state
            }))
        }
    }

    const handleArrayChange = (index: number, value: string, field: keyof RecipeInputs) => {
        setFormData((prev) => {
            const updatedArray = [...(prev[field] as string[])]
            updatedArray[index] = value
            return { ...prev, [field]: updatedArray }
        })
    }

    const addField = (field: keyof RecipeInputs) => {
        setFormData((prev) => ({
            ...prev,
            [field]: [...(prev[field] as string[]), ''],
        }))
    }

    const removeField = (index: number, field: keyof RecipeInputs) => {
        setFormData((prev) => ({
            ...prev,
            [field]: (prev[field] as string[]).filter((_, i) => i !== index),
        }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!recipe?._id) {
            setMessage('Unexpected error occurred.')
            setSnackbarOpen(true)
            return
        }

        const formDataToSend = new FormData()
        let hasChanges = false

        Object.keys(formData).forEach((key) => {
            const field = key as keyof RecipeInputs
            const newValue = formData[field]
            const oldValue = recipe[field]

            if (JSON.stringify(newValue) !== JSON.stringify(oldValue)) {
                hasChanges = true

                if (Array.isArray(newValue)) {
                    // Convert array to JSON string
                    formDataToSend.append(key, JSON.stringify(newValue))
                } else if (field === 'image' && newValue instanceof File) {
                    formDataToSend.append('image', newValue)
                } else if (newValue !== null && newValue !== undefined) {
                    formDataToSend.append(key, newValue.toString())
                }
            }
        })

        if (!hasChanges) {
            setMessage('No changes detected.')
            setSnackbarOpen(true)
            return
        }

        formDataToSend.append('recipeId', recipe._id)
        formDataToSend.append('userId', String(userId))

        const response = await recipeService.editRecipe(formDataToSend)

        if (response?.success) {
            setMessage(response?.success?.message)
            setSnackbarOpen(true)
            setTimeout(() => {
                handleClose()
            }, 2000)
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
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <CustomSnackbarContent message={message} />
            </Snackbar>

            <Button variant="contained" color="secondary" onClick={onBack}>
                Back to Recipes
            </Button>
            <StyledPaper elevation={3}>
                <Typography variant="h4" fontWeight="bold" gutterBottom>
                    Edit Recipe
                </Typography>

                <form onSubmit={handleSubmit}>
                    <TextField
                        fullWidth
                        label="Title"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        variant="outlined"
                        margin="normal"
                        required
                    />

                    <Typography variant="h6">Ingredients</Typography>
                    {formData.ingredients.map((ingredient, index) => (
                        <Box key={index} display="flex" gap={2}>
                            <TextField
                                fullWidth
                                value={ingredient}
                                onChange={(e) =>
                                    handleArrayChange(index, e.target.value, 'ingredients')
                                }
                                variant="outlined"
                                margin="normal"
                            />
                            <Button onClick={() => removeField(index, 'ingredients')}>
                                Remove
                            </Button>
                        </Box>
                    ))}
                    <Button onClick={() => addField('ingredients')}>Add Ingredient</Button>

                    <Typography variant="h6">Steps</Typography>
                    {formData.steps.map((step, index) => (
                        <Box key={index} display="flex" gap={2}>
                            <TextField
                                fullWidth
                                value={step}
                                onChange={(e) => handleArrayChange(index, e.target.value, 'steps')}
                                variant="outlined"
                                margin="normal"
                            />
                            <Button onClick={() => removeField(index, 'steps')}>Remove</Button>
                        </Box>
                    ))}
                    <Button onClick={() => addField('steps')}>Add Step</Button>

                    <Typography variant="h6">Recipe Image</Typography>
                    {imagePreview && (
                        <StyleBoxContent>
                            <img src={imagePreview} alt="Recipe" className="imgPreview" />
                        </StyleBoxContent>
                    )}
                    <input type="file" onChange={handleFileChange} />

                    <TextField
                        fullWidth
                        label="Preparation Time (in mins)"
                        name="preparationTime"
                        value={formData.preparationTime}
                        onChange={handleChange}
                        variant="outlined"
                        margin="normal"
                        type="number"
                        required
                    />

                    <SubmitButton type="submit" variant="contained" color="primary" fullWidth>
                        Update Recipe
                    </SubmitButton>
                </form>
            </StyledPaper>
        </>
    )
}

export default EditRecipe
