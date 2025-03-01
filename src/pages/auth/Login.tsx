import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { TextField, Button, Box, Typography, Alert, AlertColor } from "@mui/material";
import CryptoJS from "crypto-js";
import { setCredentials } from "../../components/app/redux/AuthSlice";
import { useDispatch } from "react-redux";
import { fetchData } from "../../components/utils/FetchData";

const SECRET_KEY = import.meta.env.VITE_SECRET_KEY;

interface LoginFormInputs {
    email: string;
    password: string;
}

interface LoginProps {
    handleClose: () => void;
    switchToSignup: () => void;
}

const Login: React.FC<LoginProps> = ({ handleClose, switchToSignup }) => {
    const { register, handleSubmit, formState: { errors } } = useForm<LoginFormInputs>();
    const dispatch = useDispatch();
    const [message, setMessage] = useState('');
    const [severity, setSeverity] = useState<AlertColor>('success');


    const encryptPassword = (password: string) => {
        return CryptoJS.AES.encrypt(password, SECRET_KEY).toString();
    };

    const onSubmit: SubmitHandler<LoginFormInputs> = async (data) => {
        try {
            const encryptedPassword = encryptPassword(data.password);
    
            const response = await fetchData("http://localhost:3500/auth", "POST", {
                email: data.email,
                password: encryptedPassword,
            });
    
            dispatch(setCredentials({ accessToken: response.accessToken }));
            setMessage(response?.message);
            setSeverity("success");
            setTimeout(() => {
                handleClose();
            }, 1000);
        } catch (error: any) {
            setMessage(error.message);
            setSeverity("error");
        }
    };

    // const onSubmit: SubmitHandler<LoginFormInputs> = async (data) => {
    //     const encryptedPassword = encryptPassword(data.password);

    //     const res = await fetch("http://localhost:3500/auth", {
    //     method: "POST",
    //     headers: { "Content-Type": "application/json" },
    //     body: JSON.stringify({ email: data.email, password: encryptedPassword }),
    //     credentials: 'include',
    //     });

    //     let response = await res.json();
    //     console.log(response);
    //     if (res.status === 200) {
    //         dispatch(setCredentials({ accessToken: response.accessToken }))
    //         setMessage(response?.message)
    //         setSeverity('success')
    //         setTimeout(() => {
    //             handleClose();
    //         }, 3000);
    //     } else {
    //         setMessage(response?.message)
    //         setSeverity('error')
    //     }
    // };

    return (
        <Box sx={{ maxWidth: 400, mx: "auto", mt: 3, p: 3, boxShadow: 3, borderRadius: 2, bgcolor: "white" }}>
        <Typography variant="h5" gutterBottom textAlign="center">
            Login
        </Typography>
        {message && <Alert severity={severity}>{message}</Alert>}
        <form onSubmit={handleSubmit(onSubmit)}>
            <TextField
            fullWidth
            label="Email"
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

            <TextField
            fullWidth
            label="Password"
            type="password"
            variant="outlined"
            margin="normal"
            {...register("password", {
                required: "Password is required",
                validate: (value) => {
                const errors: string[] = [];
                if (!/[A-Z]/.test(value)) errors.push("Must include an uppercase letter.");
                if (!/[a-z]/.test(value)) errors.push("Must include a lowercase letter.");
                if (!/\d/.test(value)) errors.push("Must include a number.");
                if (!/[@$!%*?&]/.test(value)) errors.push("Must include a special character.");
                return errors.length > 0 ? errors.join(' ') : true;
                },
            })}
            error={!!errors.password}
            helperText={errors.password?.message}
            />

            <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
            Login
            </Button>
        </form>
        <p>
            Don't have an account?
            <span onClick={switchToSignup} style={{ color: "blue", cursor: "pointer" }}> Sign Up</span>
        </p>
        </Box>
    );
};

export default Login;
