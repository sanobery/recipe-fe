import { styled } from "@mui/material"
import {Box} from "@mui/material"

const ModalBox = styled(Box)(({ theme }) => ({
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '90%', // Adjust width for small screens
    maxWidth: '600px', // Limit width for larger screens
    backgroundColor: 'white',
    borderRadius: '10px',
    boxShadow: theme.shadows[5],
    padding: '16px',
    [theme.breakpoints.up('sm')]: {
        width: '80%', // Medium screens
        maxWidth: '500px',
    },
    [theme.breakpoints.up('md')]: {
        width: '50%', // Large screens
        maxWidth: '600px',
    },
}))

const ModalContent = styled('div')(() => ({
    maxHeight: '80vh', // Adjust height as needed
    overflowY: 'auto', // Enable vertical scrolling for content
    scrollbarWidth: 'thin', // For Firefox
    scrollbarColor: 'transparent transparent', // Hide scrollbar for Firefox
    '&::-webkit-scrollbar': {
        width: '0.4px', // Thin scrollbar
    },
    '&::-webkit-scrollbar-thumb:hover': {
        backgroundColor: 'rgba(0,0,0,0.3)', // Visible when hovered
    },
    marginBottom: '15px',
}))

export {ModalBox,ModalContent}