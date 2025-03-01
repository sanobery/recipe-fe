import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectCurrentToken, setUserInfo } from "../../components/app/redux/AuthSlice";
import { useForm, SubmitHandler } from "react-hook-form";
import { TextField, Button, Box, Typography } from "@mui/material";
import CryptoJS from "crypto-js";

interface SignupInputs {
    userId:number;
    username:string,
    email: string;
    password: string;
}

const SECRET_KEY = "RECEIPE"

 const encryptPassword = (password: string) => {
    return CryptoJS.AES.encrypt(password, SECRET_KEY).toString();
  };


const Profile = () => {
    const token = useSelector(selectCurrentToken);
    const dispatch = useDispatch();
    const [message,setMessage] = useState("")
    
    // ✅ Initialize useForm and extract register & errors
    const { register, setValue,handleSubmit, formState: { errors } } = useForm<SignupInputs>();

    useEffect(() => {
        const getUserDetail = async () => {
            try {
                const res = await fetch(`http://localhost:3500/auth/user`, {
                    method: "GET",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`, // ✅ Send token in Authorization header
                    },
                });
                const data = await res.json();
                dispatch(setUserInfo(data?.userExist));                
                setValue("email", data?.userExist.email)
                setValue("username", data?.userExist.username)
            } catch (error) {
                console.error("Fetch Error:", error);
            }
        };
        getUserDetail();
    }, [dispatch, token]); // ✅ Corrected dependency array

    // Form submit handler
    const onSubmit: SubmitHandler<SignupInputs> = async (data) => {
        const encryptedPassword = encryptPassword(data.password);
        console.log(data);
        
        try {
          const response = await fetch("http://localhost:3500/user", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...data, password: encryptedPassword }),
          });
          
    
          const result = await response.json();
          console.log(result);
          
          if (response.ok) {
            setMessage("User updateds successfully!");
            
            // Redirect to Login page after 2 seconds
            setTimeout(() => {
              navigate("/login");
            }, 2000);
          } 
        } catch (error) {
          console.log("Something went wrong! Please try again.");
        }
        };

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
            <div>
                {message && <p>{message}</p>} {/* Display the success/error message */}
             </div>
            <Typography variant="h5" gutterBottom textAlign="center">
                Detail Information
            </Typography>
            <form onSubmit={handleSubmit(onSubmit)}>
                {/* Username Field */}
                <TextField
                    fullWidth
                    variant="outlined"
                    margin="normal"
                    {...register("username", {
                        required: "Username is required",
                        pattern: {
                            value: /^[a-zA-Z]{2,}$/,
                            message: "Invalid username format",
                        },
                    })}
                    error={!!errors.username}
                    helperText={errors.username?.message}
                />

                {/* Email Field */}
                <TextField
                    fullWidth
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
                    helperText={errors.email?.message || " "}
                />

                {/* Password Field */}
                <TextField
                    fullWidth
                    label="Enter Password"
                    type="password"
                    variant="outlined"
                    margin="normal"
                    {...register("password", {
                        required: "Password is required",
                        validate: (value) => {
                            const errors: string[] = [];
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
                            return errors.length > 0 ? errors.join(" ") : true;
                        },
                    })}
                    error={!!errors.password}
                    helperText={errors.password?.message}
                />

                {/* Submit Button */}
                <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
                    Update
                </Button>
            </form>
        </Box>
    );
};

export default Profile;
