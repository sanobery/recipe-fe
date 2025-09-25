import React, { useState, useEffect } from "react"
import { useForm, SubmitHandler } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Alert, AlertColor, TextField, Button, Box, Typography } from "@mui/material"
import CryptoJS from "crypto-js"
import { useDispatch, useSelector } from "react-redux"
import { selectCurrentToken, selectCurrentUserId, setUserInfo } from "../../../store/AuthSlice"
import userService from "../../../infrastructure/services/api/user/UserInstance"
import { SignupInputs } from "../../../types/RecipeAuthInterface"
import { ConstantMessages, getMessage } from "../../../constants/ConstantMessages"
import * as z from "zod"

// Define form data type with Zod schema
const signupSchema = z.object({
  username: z.string()
    .min(4, { message: getMessage("username", "invalid") })
    .regex(/^[a-zA-Z]+$/, { message: getMessage("username", "invalid") }),
  email: z.string().email({ message: getMessage("email", "invalid") }),
  password: z.string()
    .min(8, { message: ConstantMessages.PASSWORD_LENGTH })
    .max(16, { message: ConstantMessages.PASSWORD_LENGTH })
    .regex(/[A-Z]/, { message: ConstantMessages.PASSWORD_UPPERCASE })
    .regex(/[a-z]/, { message: ConstantMessages.PASSWORD_LOWERCASE })
    .regex(/\d/, { message: ConstantMessages.PASSWORD_DIGIT })
    .regex(/[@$!%*?&]/, { message: ConstantMessages.PASSWORD_SPECIALCASE }),
})

// Props
interface LoginProps {
  handleClose: () => void
  switchToLogin: () => void
  userInfo: keyof typeof userInfoLabels
}

// Labels
const userInfoLabels: Record<"login" | "signup" | "addRecipe" | "updateUser", string> = {
  login: "Login",
  signup: "Sign Up",
  addRecipe: "Add Recipe",
  updateUser: "Update User",
}

const SECRET_KEY = import.meta.env.VITE_SECRET_KEY

const UserManagement: React.FC<LoginProps> = ({ handleClose, switchToLogin, userInfo }) => {
  const [message, setMessage] = useState<string>("")
  const [severity, setSeverity] = useState<AlertColor>("success")
  const dispatch = useDispatch()
  const token = useSelector(selectCurrentToken)
  const userId = useSelector(selectCurrentUserId)

  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupInputs>({
    resolver: zodResolver(signupSchema),
  })

  const encryptPassword = (password: string) => CryptoJS.AES.encrypt(password, SECRET_KEY).toString()

  const onSubmit: SubmitHandler<SignupInputs> = async (data) => {
    const encryptedPassword = encryptPassword(data.password)
    const requestBody = {
      ...data,
      password: encryptedPassword,
      ...(userInfo === "updateUser" && userId ? { userId } : {}),
    }

    const response = await userService.userManagement(`${userInfo}`, requestBody)
    if (response.success) {
      setMessage(response.success.message)
      setSeverity("success")
      if (userInfo === "signup") {
        setTimeout(() => switchToLogin(), 3000)
      } else {
        setTimeout(() => handleClose(), 1000)
      }
    } else {
      setMessage(response.error?.message || ConstantMessages.UNEXPECTED_ERROR)
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
        setMessage(ConstantMessages.UNEXPECTED_ERROR)
        setSeverity("error")
      }
    }

    fetchUser()
  }, [token, dispatch, setValue])

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
          {...register("username")}
          error={!!errors.username}
          helperText={errors.username?.message}
        />

        <TextField
          fullWidth
          label={userInfo === "signup" ? "Enter Email" : ""}
          variant="outlined"
          margin="normal"
          {...register("email")}
          error={!!errors.email}
          helperText={errors.email?.message}
        />

        <TextField
          fullWidth
          label="Enter Password"
          type="password"
          variant="outlined"
          margin="normal"
          {...register("password")}
          error={!!errors.password}
          helperText={errors.password?.message}
        />

        <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
          {userInfoLabels[userInfo]}
        </Button>
      </form>

      {userInfo === "signup" && (
        <p>
          Have an account.
          <span onClick={switchToLogin} style={{ color: "blue", cursor: "pointer" }}>
            {" "}
            Log-In
          </span>{" "}
          to continue
        </p>
      )}
    </Box>
  )
}

export default UserManagement
