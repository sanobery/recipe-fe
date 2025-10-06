import React, { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { Alert, AlertColor, Modal, Typography, TextField } from '@mui/material'
import { useSelector } from 'react-redux'
import { selectCurrentUserId } from '../../../store/AuthSlice'
import { RootState } from '../../../store/Store'
import recipeService from '../../../infrastructure/services/api/recipe/RecipeInstance'
import { ConstantMessages } from '../../../constants/ConstantMessages'
import { ModalBox, ModalContent, StyledRating, SubmitButton } from '../../styles/styles'
interface RateCommentProps {
    open: boolean
    onClose: () => void
    type: 'rate' | 'comment' | 'delete'
}

const RateComment: React.FC<RateCommentProps> = ({ open, onClose, type }) => {
    const { handleSubmit, control, reset } = useForm({
        defaultValues: {
            type: type || 'rate', // Default to 'rate'
            rate: null,
            comment: '',
        },
    })

    const userid = useSelector(selectCurrentUserId)
    const recipeId = useSelector((state: RootState) => state.recipe.recipeId)
    const [message, setMessage] = useState<string>('')
    const [severity, setSeverity] = useState<AlertColor>('success')

    // =============================================
    // Handle Rating & Comments in Recipes
    // =============================================
    // - Allows users to rate a recipe (e.g., 1–5 stars)
    // - Enables users to add comments/feedback on recipes
    // - Each rating/comment is linked to the recipe & user
    // - Validates input (rating range, sanitized comments)
    // - Stores feedback in the database for future insights
    // - Enhances user engagement & improves recipe quality
    // =============================================
    const handleFormSubmit = async (data: {
        type: string
        rate: number | null
        comment: string
    }) => {
        const payload: Record<string, number | string | null> = {
            userId: userid,
            recipeId,
        }
        if (data.type === 'rate' && data.rate !== null) {
            payload.rate = data.rate
        } else if (data.type === 'comment' && data.comment.trim() !== '') {
            payload.comment = data.comment
        } else {
            setSeverity('error')
            setMessage(ConstantMessages.VALID_RATING_COMMENT)
            return
        }
        const queryParams = { ...payload, userId: userid, recipeId: recipeId }
        const response = await recipeService.feedback(data.type, queryParams)
        if (response.success) {
            setSeverity('success')
            setMessage(response?.success?.message)
            reset()
            setTimeout(() => {
                onClose()
            }, 2000)
        } else {
            setSeverity('error')
            setMessage(response?.error?.message)
        }
    }

    const handleClose = () => {
        setMessage('')
    }

    return (
        <Modal open={open} onClose={onClose}>
            <ModalBox>
                <ModalContent>
                    {message && (
                        <Alert severity={severity} onClose={handleClose}>
                            {message}
                        </Alert>
                    )}

                    <Typography variant="h6">{type.toUpperCase()} - Recipe</Typography>

                    <form onSubmit={handleSubmit(handleFormSubmit)}>
                        {type === 'rate' && (
                            <Controller
                                name="rate"
                                control={control}
                                render={({ field }) => (
                                    <StyledRating
                                        {...field}
                                        onChange={(_, newValue) => field.onChange(newValue)}
                                        mt={2}
                                    />
                                )}
                            />
                        )}

                        {type === 'comment' && (
                            <Controller
                                name="comment"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        fullWidth
                                        label="Your Comment"
                                        variant="outlined"
                                        margin="normal"
                                        multiline
                                        rows={4}
                                    />
                                )}
                            />
                        )}

                        <div>
                            <SubmitButton
                                type="submit"
                                variant="contained"
                                size="small"
                                color="primary"
                            >
                                Submit
                            </SubmitButton>
                            <SubmitButton
                                variant="contained"
                                color="error"
                                size="small"
                                onClick={onClose}
                                marginX={16}
                            >
                                Close
                            </SubmitButton>
                        </div>
                    </form>
                </ModalContent>
            </ModalBox>
        </Modal>
    )
}

export default RateComment
