import React, { useState } from 'react'
import { useForm, SubmitHandler } from 'react-hook-form'
import { TextField, Typography, Alert, AlertColor } from '@mui/material'
import CryptoJS from 'crypto-js'
import { setCredentials } from '../../../store/AuthSlice'
import { useDispatch } from 'react-redux'
import userService from '../../../infrastructure/services/api/user/UserInstance'
import { LoginFormInputs } from '../../../types/RecipeAuthInterface'
import { getSecretKey } from '../../../infrastructure/services/api/config'
import { ClickableText, StyledBox, SubmitButton } from '../../styles/styles'

const SECRET_KEY = getSecretKey()
interface LoginProps {
    handleClose: () => void
    switchToSignup: () => void
}

const Login: React.FC<LoginProps> = ({ handleClose, switchToSignup }) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormInputs>()
    const dispatch = useDispatch()
    const [message, setMessage] = useState<string>('')
    const [severity, setSeverity] = useState<AlertColor>('success')

    const encryptPassword = (password: string) => {
        return CryptoJS.AES.encrypt(password, SECRET_KEY).toString()
    }

    const onSubmit: SubmitHandler<LoginFormInputs> = async (data) => {
        const encryptedPassword = encryptPassword(data.password)
        const queryParams = { email: data.email, password: encryptedPassword }
        const response = await userService.login(queryParams)

        if (response.success) {
            dispatch(setCredentials({ accessToken: response?.success?.accessToken }))
            setMessage(response?.success?.message)
            setSeverity('success')
            setTimeout(() => {
                handleClose()
            }, 1000)
        } else {
            setMessage(response?.error?.message)
            setSeverity('error')
        }
    }

    return (
        <StyledBox>
            <Typography variant="h5" gutterBottom textAlign="center">
                Login
            </Typography>
            {message && <Alert severity={severity}>{message}</Alert>}
            <form onSubmit={handleSubmit(onSubmit)}>
                <TextField
                    fullWidth
                    label="Email"
                    variant="outlined"
                    inputProps={{ 'aria-label': 'Email' }}
                    margin="normal"
                    {...register('email', {
                        required: 'Email is required',
                        pattern: {
                            value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                            message: 'Invalid email format',
                        },
                    })}
                    error={!!errors.email}
                    helperText={errors.email?.message}
                />

                <TextField
                    fullWidth
                    label="Password"
                    type="password"
                    inputProps={{ 'aria-label': 'Password' }}
                    variant="outlined"
                    margin="normal"
                    {...register('password', {
                        required: 'Password is required',
                        validate: (value) => {
                            const errors: string[] = []
                            if (!/[A-Z]/.test(value))
                                errors.push('Must include an uppercase letter.')
                            if (!/[a-z]/.test(value))
                                errors.push('Must include a lowercase letter.')
                            if (!/\d/.test(value)) errors.push('Must include a number.')
                            if (!/[@$!%*?&]/.test(value))
                                errors.push('Must include a special character.')
                            return errors.length > 0 ? errors.join(' ') : true
                        },
                    })}
                    error={!!errors.password}
                    helperText={errors.password?.message}
                />

                <SubmitButton type="submit" variant="contained" color="primary" fullWidth>
                    Login
                </SubmitButton>
            </form>
            <p>
                Don't have an account?
                <ClickableText onClick={switchToSignup}> Sign Up</ClickableText>
            </p>
        </StyledBox>
    )
}

export default Login
