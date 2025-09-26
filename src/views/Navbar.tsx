import { useState,lazy,Suspense } from "react"
import {
AppBar,
Toolbar,
Typography,
IconButton,
Box,
Modal,
Backdrop,
Fade,
Menu,
MenuItem,
Snackbar,
Alert
} from "@mui/material"
import {
Menu as MenuIcon,
Person,
PersonAdd,
Close as CloseIcon,
} from "@mui/icons-material"
import { styled } from "@mui/material/styles"
import { useSelector, useDispatch } from "react-redux"
import { logout, selectCurrentToken } from "../store/AuthSlice"
import userService from "../infrastructure/services/api/user/UserInstance"
import { ReactNode } from 'react'

const Login = lazy(()=>import("./pages/auth/Login"))
const AddRecipe = lazy(()=>import("./pages/receipe/AddRecipe"))
const MyRecipe = lazy(()=>import("./pages/receipe/MyRecipe"))
const UserManagement = lazy(()=>import("./pages/auth/UserManagement"))

const ModalBox = styled(Box)(({ theme }) => ({
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "90%", // Adjust width for small screens
    maxWidth: "600px", // Limit width for larger screens
    backgroundColor: "white",
    borderRadius: "10px",
    boxShadow: theme.shadows[5],
    padding: "16px",
    [theme.breakpoints.up("sm")]: {
        width: "80%", // Medium screens
        maxWidth: "500px",
    },
    [theme.breakpoints.up("md")]: {
        width: "50%", // Large screens
        maxWidth: "600px",
    },
}))

const ModalContent = styled("div")(() => ({
    maxHeight: "80vh",   // Adjust height as needed
    overflowY: "auto",   // Enable vertical scrolling for content
    scrollbarWidth: "thin", // For Firefox
    scrollbarColor: "transparent transparent", // Hide scrollbar for Firefox
    "&::-webkit-scrollbar": {
        width: "0.4px", // Thin scrollbar
    },
    "&::-webkit-scrollbar-thumb:hover": {
        backgroundColor: "rgba(0,0,0,0.3)", // Visible when hovered
    },
    marginBottom:"15px"
}))

interface ReduxProviderProps{
    children:ReactNode
}

const NavbarNew = () => {
    const auth = useSelector(selectCurrentToken)
    const [modalOpen, setModalOpen] = useState<boolean>(false)
    const [modalType, setModalType] = useState<"login" | "signup" | "addRecipe" | "updateUser" | "myRecipe">("login")
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
    const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false)
    const [message, setMessage] = useState<string>("")
    const open = Boolean(anchorEl)
    const dispatch = useDispatch()

    const LazyLoadWrapper = ( props:ReduxProviderProps) => (
        <Suspense fallback={<div>Loading...</div>}>{props.children}</Suspense>
    );

    const handleOpen = (type: "login" | "signup" | "addRecipe" | "updateUser"|"myRecipe") => {
        setModalType(type)
        setModalOpen(true)
    }

    const handleClose = () => {
        setModalOpen(false)
    }

    const handleMenuOpen = (event:React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget)
    }

    const handleMenuClose = () => {
        setAnchorEl(null)
    }

    //to Logout
    const handleLogout = async () => {
        const response = await userService.logout()        
        if(response.success){
            setSnackbarOpen(true)
            setMessage(response?.success?.message)
            dispatch(logout())
        }
        else{
            setSnackbarOpen(true)
            setMessage("Error!!")
        }
    }
    

    return (
        <Box sx={{ flexGrow: 1 }}>
            <Snackbar 
                open={snackbarOpen} 
                autoHideDuration={3000} 
                onClose={() => setSnackbarOpen(false)}
                anchorOrigin={{ vertical: "top", horizontal: "center" }}
            >
                <Alert onClose={() => setSnackbarOpen(false)} severity="success">
                    {message}
                </Alert>
            </Snackbar>

            <AppBar position="static">
                <Toolbar>
                    <IconButton size="large" edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        RECIPE BLOG
                    </Typography>

                    {!auth ? (
                        <Box>
                            <IconButton color="inherit" onClick={() => handleOpen("login")} aria-label="login">
                                <Person />
                            </IconButton>
                            <IconButton color="inherit" onClick={() => handleOpen("signup")} aria-label="signup">
                                <PersonAdd />
                            </IconButton>
                        </Box>
                    ) : (
                        <>
                            <IconButton color="inherit" onClick={handleMenuOpen} aria-label="menuList">
                                <Person />
                            </IconButton>
                            <Menu anchorEl={anchorEl} open={open} onClick={handleMenuClose}>
                                <MenuItem onClick={() => handleOpen("updateUser")}>View Profile</MenuItem>
                                <MenuItem onClick={() => handleOpen("addRecipe")}>Add Recipe</MenuItem>
                                <MenuItem onClick={() => handleOpen("myRecipe")}>My Recipe</MenuItem>
                                <MenuItem onClick={handleLogout}>Logout</MenuItem>
                            </Menu>
                        </>
                    )}
                </Toolbar>
            </AppBar>

            {/* Modal */}
            <Modal open={modalOpen} onClose={handleClose} closeAfterTransition BackdropComponent={Backdrop} BackdropProps={{ timeout: 500 }}>
                <Fade in={modalOpen}>
                    <ModalBox>
                        <IconButton sx={{ position: "absolute", top: 8, right: 8 }} onClick={handleClose}>
                            <CloseIcon />
                        </IconButton>
                        <ModalContent>
                            {modalType === "login" && (
                                <Login handleClose={handleClose} switchToSignup={() => setModalType("signup")} />
                            )}
                            {modalType === "signup" && (
                                <LazyLoadWrapper>
                                    <UserManagement handleClose={handleClose} switchToLogin={() => setModalType("login")} userInfo={modalType}/>
                                </LazyLoadWrapper>
                            )}
                            {modalType === "addRecipe" && (
                                <LazyLoadWrapper>
                                    <AddRecipe handleClose={handleClose}/>
                                </LazyLoadWrapper>
                            )}
                            {modalType === "myRecipe" && (
                                <LazyLoadWrapper>
                                    <MyRecipe handleClose={handleClose}/>
                                </LazyLoadWrapper>
                            )}
                            {modalType === "updateUser" && (
                                <LazyLoadWrapper>
                                    <UserManagement handleClose={handleClose} switchToLogin={() => setModalType("login")} userInfo={modalType}/>
                                </LazyLoadWrapper>
                            )}
                        </ModalContent>
                    </ModalBox>
                </Fade>
            </Modal>
        </Box>
    )
}

export default NavbarNew
