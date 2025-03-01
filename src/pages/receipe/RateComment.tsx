import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import {
    Alert,
    AlertColor,
    Modal,
    Box,
    Typography,
    Button,
    Rating,
    TextField
} from "@mui/material";
import { useSelector } from "react-redux";
import { selectCurrentToken, selectCurrentUserId } from "../../components/app/redux/AuthSlice";
import { RootState } from "../../components/app/redux/Store";
import config from "../../components/app/api/config/config";

interface RateCommentProps {
    open: boolean;
    onClose: () => void;
    type: "rate" | "comment";
}

const RateComment: React.FC<RateCommentProps> = ({ open, onClose, type }) => {
    const { handleSubmit, control, reset } = useForm({
        defaultValues: {
            type:  type || "rate",  // Default to 'rate'
            rate: null,
            comment: "",
        },
    });

    const token = useSelector(selectCurrentToken);
    const userid = useSelector(selectCurrentUserId);
    const recipe = useSelector((state: RootState) => state.recipe.selectedRecipe);
    const [message, setMessage] = useState("");
    const [severity, setSeverity] = useState<AlertColor>("success");

    const handleFormSubmit = async (data: { type: string; rate: number | null; comment: string }) => {
        try {
            const recipeId = recipe?._id;
            const payload: Record<string, any> = { userId: userid, recipeId };
    
            // Include only relevant data
            if (data.type === "rate" && data.rate !== null) {
                payload.rate = data.rate;
            } else if (data.type === "comment" && data.comment.trim() !== "") {
                payload.comment = data.comment;
            } else {
                setSeverity("error");
                setMessage("Please provide a valid rating or comment.");
                return;
            }
    
            console.log(payload, "Payload before sending");
            const feedback = await fetch(`${config.apiUrl}/recipe/${data.type}`, {
                method: "POST",
                body: JSON.stringify({ 
                    ...payload, 
                    userId: userid, 
                    recipeId: recipeId 
                }),
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            const response = await feedback.json();
            console.log(response);

            if (feedback.status === 200) {
                setSeverity("success");
                setMessage(response.message);
                reset();
                setTimeout(() => {
                    onClose();
                }, 2000);
            } else {
                setSeverity("error");
                setMessage(response.message);
            }
        } catch (e) {
            console.log(e);
        }
    };

    const handleClose = () => {
        setMessage("");
    };

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
    );
};

export default RateComment;
