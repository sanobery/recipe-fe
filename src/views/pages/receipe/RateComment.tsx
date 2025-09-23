import React, { useState } from "react"
import { useForm, Controller } from "react-hook-form"
import {
    Alert,
    AlertColor,
    Modal,
    Box,
    Typography,
    Button,
    Rating,
    TextField
} from "@mui/material"
import { useSelector } from "react-redux"
import { selectCurrentUserId } from "../../../store/AuthSlice"
import { RootState } from "../../../store/Store"
import recipeService from "../../../infrastructure/services/api/recipe/RecipeInstance"

interface RateCommentProps {
    open: boolean,
    onClose: () => void,
    type: "rate" | "comment" | "delete",
}

const RateComment: React.FC<RateCommentProps> = ({ open, onClose, type }) => {    
    const { handleSubmit, control, reset } = useForm({
        defaultValues: {
            type:  type || "rate",  // Default to 'rate'
            rate: null,
            comment: "",
        },
    })

    const userid = useSelector(selectCurrentUserId)
    const recipeId = useSelector((state: RootState) => state.recipe.recipeId)
    const [message, setMessage] = useState<string>("")
    const [severity, setSeverity] = useState<AlertColor>("success")

    const handleFormSubmit = async (data: { type: string ,rate: number | null, comment: string }) => {
            const payload: Record<string, number|string|null> = { userId: userid, recipeId }
            if (data.type === "rate" && data.rate !== null) {
                payload.rate = data.rate
            } else if (data.type === "comment" && data.comment.trim() !== "") {
                payload.comment = data.comment
            } else {
                setSeverity("error")
                setMessage("Please provide a valid rating or comment.")
                return
            }
            const queryParams= {...payload, userId: userid, recipeId: recipeId}
            const response = await recipeService.feedback(data.type,queryParams)
            if (response.success) {
                setSeverity("success")
                setMessage(response?.success?.message)
                reset()
                setTimeout(() => {
                    onClose()
                }, 2000)
            } else {
                setSeverity("error")
                setMessage(response?.error?.message)
            }
    }

    const handleClose = () => {
        setMessage("")
    }

    return (
        <Modal open={open} onClose={onClose}>
            <Box
                sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: 400,
                    bgcolor: "background.paper",
                    boxShadow: 24,
                    p: 4,
                    borderRadius: 2,
                }}
            >
                {message && (
                    <Alert severity={severity} onClose={handleClose}>
                        {message}
                    </Alert>
                )}

                <Typography variant="h6">{type.toLocaleUpperCase()} - Recipe</Typography>

                <form onSubmit={handleSubmit(handleFormSubmit)}>

                    {/* Rating Field (Only if 'Rate' is selected) */}
                    {type === "rate" && (
                        <Controller
                            name="rate"
                            control={control}
                            render={({ field }) => (
                                <Rating
                                    {...field}
                                    onChange={(_, newValue) => field.onChange(newValue)}
                                    sx={{ mt: 2 }}
                                />
                            )}
                        />
                    )}

                    {/* Comment Field (Only if 'Comment' is selected) */}
                    {type === "comment" && (
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

                    {/* Buttons */}
                    <div>
                    <Button type="submit" variant="contained" size="small" color="primary" sx={{ mt: 3 }}>
                        Submit
                    </Button>
                    <Button variant="contained" color="error" size="small" onClick={onClose} sx={{ mt: 3, mx: 2 }}>
                        Close
                    </Button>
                    </div>
                </form>
            </Box>
        </Modal>
    )
}

export default RateComment
