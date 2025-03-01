import { useState } from "react";
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
} from "@mui/material";
import {
  Menu as MenuIcon,
  Person,
  PersonAdd,
  Close as CloseIcon,
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import Login from "../pages/auth/Login";
import Signup from "../pages/auth/Signup";
import { useSelector, useDispatch } from "react-redux";
import { logout, selectCurrentToken } from "./app/redux/AuthSlice";
import { fetchData } from "./utils/FetchData";
import Profile from "../pages/auth/Profile";
import AddRecipe from "../pages/receipe/AddRecipe";
import config from "./app/api/config/config";

const ModalBox = styled("div")(({ theme }) => ({
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(4),
    borderRadius: theme.shape.borderRadius,
    outline: "none",
}));

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
    }
}));

const NavbarNew = () => {
    const auth = useSelector(selectCurrentToken)
    const [modalOpen, setModalOpen] = useState(false);
    const [modalType, setModalType] = useState<"login" | "signup" | "addRecipe" | "viewProfile">("login");
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const dispatch = useDispatch()
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [message, setMessage] = useState('');

    const handleOpen = (type: "login" | "signup" | "addRecipe" | "viewProfile") => {
        setModalType(type);
        setModalOpen(true);
    };

    const handleClose = () => {
        setModalOpen(false);
    };

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = async () => {
        try {
            const response = await fetchData(`${config.apiUrl}/auth/logout`, "POST");
            setSnackbarOpen(true);
            setMessage(response?.message);
            dispatch(logout());
        } catch (error: any) {
            console.log(error);
        }
    };


    return (
        <Box sx={{ flexGrow: 1 }}>
            {/* Snackbar Notification */}
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
                            <IconButton color="inherit" onClick={() => handleOpen("login")}>
                                <Person />
                            </IconButton>
                            <IconButton color="inherit" onClick={() => handleOpen("signup")}>
                                <PersonAdd />
                            </IconButton>
                        </Box>
                    ) : (
                        <>
                            <IconButton color="inherit" onClick={handleMenuOpen}>
                                <Person />
                            </IconButton>
                            <Menu anchorEl={anchorEl} open={open} onClick={handleMenuClose}>
                                <MenuItem onClick={() => handleOpen("viewProfile")}>View Profile</MenuItem>
                                <MenuItem onClick={() => handleOpen("addRecipe")}>Add Recipe</MenuItem>
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
                        {modalType === "login" && <Login handleClose={handleClose} switchToSignup={() => setModalType("signup")} />}
                        {modalType === "signup" && <Signup handleClose={handleClose} switchToLogin={() => setModalType("login")} />}
                        {modalType === "addRecipe" && <AddRecipe handleClose={handleClose}/>}
                        {modalType === "viewProfile" && <Profile handleClose={handleClose} />}
                        </ModalContent>
                    </ModalBox>
                </Fade>
            </Modal>
        </Box>
    );
};

export default NavbarNew;
