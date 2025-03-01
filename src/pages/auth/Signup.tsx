import React,{useState} from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Alert, AlertColor, TextField, Button, Box, Typography } from "@mui/material";
import CryptoJS from "crypto-js";
import { fetchData } from "../../components/utils/FetchData";

const SECRET_KEY = import.meta.env.VITE_SECRET_KEY;

// Define form data type
interface SignupInputs {
    username:string,
    email: string;
    password: string;
}

interface LoginProps {
    handleClose: () => void;
    switchToLogin: () => void;
}
  

const Signup: React.FC<LoginProps> = ({ handleClose, switchToLogin }) => {
    const [message, setMessage] = useState('');
    const [severity, setSeverity] = useState<AlertColor>('success');

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<SignupInputs>();

    const encryptPassword = (password: string) => {
        return CryptoJS.AES.encrypt(password, SECRET_KEY).toString();
    };

    const onSubmit: SubmitHandler<SignupInputs> = async (data) => {
        const encryptedPassword = encryptPassword(data.password);
        try {
            const response = await fetchData("http://localhost:3500/user", "POST", { ...data, password: encryptedPassword });
            setMessage(response?.message);
            setSeverity("success");
            setTimeout(() => {
                switchToLogin();
            }, 3000);
        } catch (error: any) {
            setMessage(error.message);
            setSeverity("error");
        } 
    };

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
                Sign Up
            </Typography>
            <form onSubmit={handleSubmit(onSubmit)}>
                {/* Email Field with Validation */}
                <TextField
                fullWidth
                label="Username"
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

                {/* Password Field with Detailed Validation */}
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
                    if (value.length < 8 || value.length > 16) {
                        errors.push("Password must be between 8 to 16 characters long.");
                    }
                    if (!/[A-Z]/.test(value)) {
                        errors.push("Password must include one uppercase letter.");
                    }
                    if (!/[a-z]/.test(value)) {
                        errors.push("Password must include one lowercase letter.");
                    }
                    if (!/\d/.test(value)) {
                        errors.push("Password must include one number.");
                    }
                    if (!/[@$!%*?&]/.test(value)) {
                        errors.push("Password must include one special character.");
                    }
                    return errors.length > 0 ? errors.join(' ') : true;
                    },
                })}
                error={!!errors.password}
                helperText={errors.password?.message}
                />

                {/* Submit Button */}
                <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
                SignUp
                </Button>
            </form>
            <p>Have an account.<span onClick={switchToLogin} style={{ color: "blue", cursor: "pointer" }}> Log-In</span> to continue</p>

        </Box>
    </div>
  );
};

export default Signup;
