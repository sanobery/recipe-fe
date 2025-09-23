import React,{useState,useEffect} from "react"
import { useForm, SubmitHandler } from "react-hook-form"
import { Alert, AlertColor, TextField, Button, Box, Typography } from "@mui/material"
import CryptoJS from "crypto-js"
import { useDispatch,useSelector } from "react-redux"
import { selectCurrentToken, selectCurrentUserId, setUserInfo } from "../../../store/AuthSlice"
import userService from "../../../infrastructure/services/api/user/UserInstance"
import { SignupInputs } from "../../../types/RecipeAuthInterface"

// Define form data type
interface LoginProps {
    handleClose: () => void,
    switchToLogin:() => void,
    userInfo:keyof typeof userInfoLabels
}
  
const userInfoLabels: Record<"login" | "signup" | "addRecipe" | "updateUser", string> = {
    login: "Login",
    signup: "Sign Up",
    addRecipe: "Add Recipe",
    updateUser: "Update User"
}

const SECRET_KEY = import.meta.env.VITE_SECRET_KEY

const UserManagement: React.FC<LoginProps> = ({ handleClose, switchToLogin, userInfo }) => {
    const [message, setMessage] = useState<string>('')
    const [severity, setSeverity] = useState<AlertColor>('success')
    const dispatch = useDispatch()
    const token = useSelector(selectCurrentToken)
    const userId = useSelector(selectCurrentUserId)
    const {
        register,
        setValue,
        handleSubmit,
        formState: { errors },
    } = useForm<SignupInputs>()

    const encryptPassword = (password: string) => {
        return CryptoJS.AES.encrypt(password, SECRET_KEY).toString()
    }

    const onSubmit: SubmitHandler<SignupInputs> = async (data) => {
        const encryptedPassword = encryptPassword(data.password)
        const requestBody = {
            ...data,
            password: encryptedPassword,
            ...(userInfo === "updateUser" && userId ? { userId } : {}), // Add userId if updating
        }

        const response = await userService.userManagement(`${userInfo}`,requestBody)
        if(response.success){
            setMessage(response?.success?.message)
            setSeverity("success")
            if(userInfo === 'signup'){
                setTimeout(() => {
                    switchToLogin()
                }, 3000)
            }else{
                setTimeout(() => {
                    handleClose()
                }, 1000)
            }
        } else {
            setMessage(response?.error?.message)
            setSeverity("error")
        }
    }
    useEffect(() => {
        if (!token) return
        
        const fetchUser = async () => {
            const response = await userService.getUserDetail()
            if (response.success) {
                dispatch(setUserInfo(response.success.userExist))
                setValue("email", response.success.userExist.email)
                setValue("username", response.success.userExist.username)
            } else {
                setMessage("An unexpected error occurred")
                setSeverity("error")
            }
        }
    
        fetchUser()
    }, [token,dispatch,setValue])
    
    return (
        <div>
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
                {message && <Alert severity={severity}>{message}</Alert>}
                
                <Typography variant="h5" gutterBottom textAlign="center">
                {userInfoLabels[userInfo]}
                </Typography>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <TextField
                    fullWidth
                    label={userInfo === "signup" ? "Enter Username" : ""}
                    variant="outlined"
                    margin="normal"
                    {...register("username", {
                        required: "Username is required",
                        pattern: {
                        value: /^[a-zA-Z]{4,}$/,
                        message: "Invalid username format",
                        },
                    })}
                    error={!!errors.username}
                    helperText={errors.username?.message}
                    />

                    <TextField
                    fullWidth
                    label={userInfo === "signup" ? "Enter Email" : ""}
                    variant="outlined"
                    margin="normal"
                    {...register("email", {
                        required: "Email is required",
                        pattern: {
                        value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                        message: "Invalid email format",
                        },
                    })}
                    error={!!errors.email}
                    helperText={errors.email?.message}
                    />

                    {/* Password Field with Detailed Validation */}
                    <TextField
                    fullWidth
                    label="Enter Password"
                    type="password"
                    variant="outlined"
                    margin="normal"
                    {...register("password", {
                        required: "Password is required",
                        validate: (value) => {
                        const errors: string[] = []
                        if (value.length < 8 || value.length > 16) {
                            errors.push("Password must be between 8 to 16 characters long.")
                        }
                        if (!/[A-Z]/.test(value)) {
                            errors.push("Password must include one uppercase letter.")
                        }
                        if (!/[a-z]/.test(value)) {
                            errors.push("Password must include one lowercase letter.")
                        }
                        if (!/\d/.test(value)) {
                            errors.push("Password must include one number.")
                        }
                        if (!/[@$!%*?&]/.test(value)) {
                            errors.push("Password must include one special character.")
                        }
                        return errors.length > 0 ? errors.join(' ') : true
                        },
                    })}
                    error={!!errors.password}
                    helperText={errors.password?.message}
                    />

                    {/* Submit Button */}
                    <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
                        {userInfoLabels[userInfo]}
                    </Button>
                </form>
                {userInfo === 'signup' && <p>Have an account.<span onClick={switchToLogin} style={{ color: "blue", cursor: "pointer" }}> Log-In</span> to continue</p>}
            </Box>
        </div>
    )
}

export default UserManagement
