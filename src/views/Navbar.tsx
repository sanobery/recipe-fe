import { useState, lazy, Suspense } from 'react'
import {
    AppBar,
    Toolbar,
    IconButton,
    Box,
    Modal,
    Backdrop,
    Fade,
    Menu,
    MenuItem,
    Snackbar,
    Alert,
} from '@mui/material'
import { Menu as MenuIcon, Person, PersonAdd, Close as CloseIcon } from '@mui/icons-material'
import { useSelector, useDispatch } from 'react-redux'
import { logout, selectCurrentToken } from '../store/AuthSlice'
import userService from '../infrastructure/services/api/user/UserInstance'
import { ReactNode } from 'react'
import {
    FlexBox,
    ModalBox,
    ModalContent,
    FlexTypography,
    StyledIconButton,
    CustomIconButton,
} from './styles/styles'

const Login = lazy(() => import('./pages/auth/Login'))
const AddRecipe = lazy(() => import('./pages/receipe/AddRecipe'))
const MyRecipe = lazy(() => import('./pages/receipe/MyRecipe'))
const UserManagement = lazy(() => import('./pages/auth/UserManagement'))
interface ReduxProviderProps {
    children: ReactNode
}

const NavbarNew = () => {
    const auth = useSelector(selectCurrentToken)
    const [modalOpen, setModalOpen] = useState<boolean>(false)
    const [modalType, setModalType] = useState<
        'login' | 'signup' | 'addRecipe' | 'updateUser' | 'myRecipe'
    >('login')
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
    const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false)
    const [message, setMessage] = useState<string>('')
    const open = Boolean(anchorEl)
    const dispatch = useDispatch()

    const LazyLoadWrapper = (props: ReduxProviderProps) => (
        <Suspense fallback={<div>Loading...</div>}>{props.children}</Suspense>
    )

    const handleOpen = (type: 'login' | 'signup' | 'addRecipe' | 'updateUser' | 'myRecipe') => {
        setModalType(type)
        setModalOpen(true)
    }

    const handleClose = () => {
        setModalOpen(false)
    }

    const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget)
    }

    const handleMenuClose = () => {
        setAnchorEl(null)
    }

    //to Logout
    const handleLogout = async () => {
        const response = await userService.logout()
        if (response.success) {
            setSnackbarOpen(true)
            setMessage(response?.success?.message)
            dispatch(logout())
        } else {
            setSnackbarOpen(true)
            setMessage('Error!!')
        }
    }

    return (
        <FlexBox>
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={3000}
                onClose={() => setSnackbarOpen(false)}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert onClose={() => setSnackbarOpen(false)} severity="success">
                    {message}
                </Alert>
            </Snackbar>

            <AppBar position="static">
                <Toolbar>
                    <CustomIconButton size="large" edge="start" color="inherit" aria-label="menu">
                        <MenuIcon />
                    </CustomIconButton>
                    <FlexTypography variant="h6">RECIPE BLOG</FlexTypography>

                    {!auth ? (
                        <Box>
                            <IconButton
                                color="inherit"
                                onClick={() => handleOpen('login')}
                                aria-label="login"
                            >
                                <Person />
                            </IconButton>
                            <IconButton
                                color="inherit"
                                onClick={() => handleOpen('signup')}
                                aria-label="signup"
                            >
                                <PersonAdd />
                            </IconButton>
                        </Box>
                    ) : (
                        <>
                            <IconButton
                                color="inherit"
                                onClick={handleMenuOpen}
                                aria-label="menuList"
                            >
                                <Person />
                            </IconButton>
                            <Menu anchorEl={anchorEl} open={open} onClick={handleMenuClose}>
                                <MenuItem onClick={() => handleOpen('updateUser')}>
                                    View Profile
                                </MenuItem>
                                <MenuItem onClick={() => handleOpen('addRecipe')}>
                                    Add Recipe
                                </MenuItem>
                                <MenuItem onClick={() => handleOpen('myRecipe')}>
                                    My Recipe
                                </MenuItem>
                                <MenuItem onClick={handleLogout}>Logout</MenuItem>
                            </Menu>
                        </>
                    )}
                </Toolbar>
            </AppBar>

            {/* Modal */}
            <Modal
                open={modalOpen}
                onClose={handleClose}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{ timeout: 500 }}
            >
                <Fade in={modalOpen}>
                    <ModalBox>
                        <StyledIconButton onClick={handleClose}>
                            <CloseIcon />
                        </StyledIconButton>
                        <ModalContent>
                            {modalType === 'login' && (
                                <Login
                                    handleClose={handleClose}
                                    switchToSignup={() => setModalType('signup')}
                                />
                            )}
                            {modalType === 'signup' && (
                                <LazyLoadWrapper>
                                    <UserManagement
                                        handleClose={handleClose}
                                        switchToLogin={() => setModalType('login')}
                                        userInfo={modalType}
                                    />
                                </LazyLoadWrapper>
                            )}
                            {modalType === 'addRecipe' && (
                                <LazyLoadWrapper>
                                    <AddRecipe handleClose={handleClose} />
                                </LazyLoadWrapper>
                            )}
                            {modalType === 'myRecipe' && (
                                <LazyLoadWrapper>
                                    <MyRecipe handleClose={handleClose} />
                                </LazyLoadWrapper>
                            )}
                            {modalType === 'updateUser' && (
                                <LazyLoadWrapper>
                                    <UserManagement
                                        handleClose={handleClose}
                                        switchToLogin={() => setModalType('login')}
                                        userInfo={modalType}
                                    />
                                </LazyLoadWrapper>
                            )}
                        </ModalContent>
                    </ModalBox>
                </Fade>
            </Modal>
        </FlexBox>
    )
}

export default NavbarNew
