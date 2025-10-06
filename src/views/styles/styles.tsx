import {
    Paper,
    SnackbarContent,
    styled,
    Typography,
    InputBase,
    CardContent,
    Theme,
    Rating,
    Pagination,
    ListItem,
    Grid,
    Card,
    Stack,
} from '@mui/material'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import { Box, Button, ButtonProps } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import FavoriteIcon from '@mui/icons-material/Favorite'
import CommentIcon from '@mui/icons-material/Comment'
import InfoIcon from '@mui/icons-material/Info'
import { CSSObject } from '@mui/material/styles'
import StarIcon from '@mui/icons-material/Star'
import IconButton, { IconButtonProps } from '@mui/material/IconButton'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import MenuBookIcon from '@mui/icons-material/MenuBook'
import Avatar from '@mui/material/Avatar'
import AccessTimeIcon from '@mui/icons-material/AccessTime'

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

interface SubmitButtonProps extends ButtonProps {
    marginX?: number
}

const SubmitButton = styled(Button)<SubmitButtonProps>(({ marginX }) => ({
    marginTop: 16,
    ...(marginX !== undefined && {
        marginLeft: marginX,
        marginRight: marginX,
    }),
}))

const StyledBox = styled(Box)({
    maxWidth: '400px',
    margin: '24px auto',
    padding: '24px',
    boxShadow: '4px 4px 4px 4px rgba(0,0,0,0.1)',
    borderRadius: '16px',
    backgroundColor: 'white',
})

const ClickableText = styled('span')(({ theme }) => ({
    color: theme.palette.primary.main,
    cursor: 'pointer',
}))

const StyledPaper = styled(Paper)({
    padding: 3,
    maxWidth: '600px',
    margin: 'auto',
    marginTop: '24px',
})

const StyleBoxContent = styled(Box)({
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '16px',
})

const CustomSnackbarContent = styled(SnackbarContent)(({ theme }) => ({
    backgroundColor: theme.palette.error.main, // or use a custom color
    color: theme.palette.common.white,
}))

const CustomTypography = styled(Typography)(() => ({
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    maxWidth: '200px',
    display: 'block',
    transition: 'all 0.3s ease-in-out',
}))

const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: '#1976d2',
    '&:hover': { backgroundColor: '#1565c0' },
    width: '100%',
    [theme.breakpoints.up('sm')]: { width: '300px' },
}))

const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
}))

const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: '#fff',
    width: '100%',
    '& .MuiInputBase-input': {
        padding: theme.spacing(1, 1, 1, 0),
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        transition: theme.transitions.create('width'),
        [theme.breakpoints.up('sm')]: {
            width: '12ch',
            '&:focus': { width: '20ch' },
        },
    },
}))

const StyledSearchIcon = styled(SearchIcon)(() => ({
    color: '#fff',
}))

const getCommonStyles = (options: {
    color?: string
    textAlign?: 'center' | 'left' | 'right' | 'justify'
    marginTop?: string
    marginBottom?: string
    minHeight?: string
    backgroundColor?: string
    display?: 'flex' | 'block' | 'inline-block' | 'inline-flex'
    justifyContent?: 'center' | 'space-between'
    alignItems?: 'center'
    gap?: number
    width?: string
    flex?: number
    transition?: string
    maxWidth?: string
    border?: string
    borderRadius?: string
    boxShadow?: string
    padding?: string
}) => ({
    ...(options.color && { color: options.color }),
    ...(options.textAlign && { textAlign: options.textAlign }),
    ...(options.marginTop && { marginTop: options.marginTop }),
    ...(options.marginBottom && { marginBottom: options.marginBottom }),
    ...(options.minHeight && { minHeight: options.minHeight }),
    ...(options.backgroundColor && { backgroundColor: options.backgroundColor }),
    ...(options.display && { display: options.display }),
    ...(options.justifyContent && { justifyContent: options.justifyContent }),
    ...(options.alignItems && { alignItems: options.alignItems }),
    ...(options.gap && { gap: options.gap }),
    ...(options.width && { width: options.width }),
    ...(options.flex && { flex: options.flex }),
    ...(options.transition && { transition: options.transition }),
    ...(options.maxWidth && { maxWidth: options.maxWidth }),
    ...(options.border && { border: options.border }),
    ...(options.borderRadius && { borderRadius: options.borderRadius }),
    ...(options.boxShadow && { boxShadow: options.boxShadow }),
    ...(options.padding && { padding: options.padding }),
})

const StyledIngredientBox = styled(Box)(({ theme }) =>
    getCommonStyles({
        marginTop: theme.spacing(2), // Margin top
        padding: '16px', // Padding
        border: '1px solid #ccc', // Border
        borderRadius: '8px', // Rounded corners
        backgroundColor: '#f9f9f9', // Light background color
        maxWidth: '400px', // Limit width
        boxShadow: theme.shadows[2],
    })
)

const CustomLazyLoadImage = styled(LazyLoadImage)(() =>
    getCommonStyles({
        width: '100%',
        maxWidth: '400px',
        borderRadius: '10px',
        boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
    })
)

const StyledDiv = styled('div')(() => getCommonStyles({ display: 'flex', width: '100%' }))

const StyledPageDiv = styled('div')(() =>
    getCommonStyles({ flex: 1, transition: '0.3s ease-in-out' })
)

const StyledRecipeBox = styled(Box)(() =>
    getCommonStyles({
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        justifyContent: 'space-between',
    })
)

const StyledImageBox = styled(Box)(({ theme }) =>
    getCommonStyles({
        display: 'flex',
        justifyContent: 'center',
        marginBottom: theme.spacing(2),
        marginTop: theme.spacing(2),
    })
)

const StyledCardBox = styled(Box)(({}) =>
    getCommonStyles({ display: 'inline-flex', alignItems: 'center', gap: 1 })
)

const StyledGrid = styled(Grid)(({ theme }) =>
    getCommonStyles({ justifyContent: 'space-between', marginTop: theme.spacing(2) })
)

const StyledListItem = styled(ListItem)(({}) =>
    getCommonStyles({ display: 'flex', justifyContent: 'space-between' })
)

const StyledButton = styled(Button)(({ theme }) =>
    getCommonStyles({ minHeight: '24px', marginTop: theme.spacing(1) })
)

const StyledAvatar = styled(Avatar)(() => getCommonStyles({ backgroundColor: 'blue' }))

const StyledFavoriteIcon = styled(FavoriteIcon)(() => getCommonStyles({ color: '#FF9800' }))

const StyledCommentIcon = styled(CommentIcon)(({ theme }) =>
    getCommonStyles({ color: '#333', marginTop: theme.spacing(0.5) })
)

const StyledStarIcon = styled(StarIcon)(() => getCommonStyles({ color: '#FF9800' }))

const StyledInfoIcon = styled(InfoIcon)(({ theme }) =>
    getCommonStyles({ color: 'blue', marginTop: theme.spacing(1) })
)

const StyledTypographyMargin = styled(Typography)(({ theme }) =>
    getCommonStyles({ marginTop: theme.spacing(1), textAlign: 'center' })
)

const getStyles = (options: {
    fontSize?: string
    verticalAlign?: 'center' | 'left' | 'right' | 'middle'
    marginRight?: string
}) => ({
    ...(options.fontSize && { fontSize: options.fontSize }),
    ...(options.verticalAlign && { verticalAlign: options.verticalAlign }),
    ...(options.marginRight && { marginRight: options.marginRight }),
})

const StyledAccessTimeIcon = styled(AccessTimeIcon)(({ theme }) =>
    getStyles({ marginRight: theme.spacing(1) })
)

const StyledShoppingCartIcon = styled(ShoppingCartIcon)(({ theme }) =>
    getStyles({ verticalAlign: 'middle', marginRight: theme.spacing(1), fontSize: '1.2em' })
)

const StyledMenuBookIcon = styled(MenuBookIcon)(({}) =>
    getStyles({ verticalAlign: 'middle', fontSize: '1.2em' })
)

const CustomIconButton = styled(IconButton)(({ theme }) =>
    getStyles({ marginRight: theme.spacing(2) })
)

const commonCenteredStyles = (theme: Theme): CSSObject => ({
    color: theme.palette.text.secondary,
    textAlign: 'center',
    display: 'block',
})

const StyledCardContent = styled(CardContent)(({ theme }) => commonCenteredStyles(theme))

const StyledTypography = styled(Typography)(({ theme }) => commonCenteredStyles(theme))

interface CustomRatingProps {
    mt?: number
    me?: number
}

const StyledRating = styled(Rating, {
    shouldForwardProp: (prop) => prop !== 'mt' && prop !== 'me',
})<CustomRatingProps>(({ theme, mt, me }) => ({
    ...(mt !== undefined && { marginTop: theme.spacing(mt) }),
    ...(me !== undefined && { marginRight: theme.spacing(me) }),
}))

const StyledRecipeDetailBox = styled(Box)(() => ({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    textAlign: 'center',
}))

const StyledPagination = styled(Pagination)(({theme})=>
    getCommonStyles({
    display: 'flex',
    justifyContent: 'center',
    marginTop: theme.spacing(2)
}))

interface ExpandMoreProps extends IconButtonProps {
    expand: boolean
}

const ExpandMore = styled((props: ExpandMoreProps) => {
    const { ...other } = props
    return <IconButton {...other} />
})(({ theme }) => ({
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
        duration: theme.transitions.duration.shortest,
    }),
    variants: [
        {
            props: ({ expand }) => !expand,
            style: {
                transform: 'rotate(0deg)',
            },
        },
        {
            props: ({ expand }) => !!expand,
            style: {
                transform: 'rotate(180deg)',
            },
        },
    ],
}))

const PopupBody = styled('div')(
    ({ theme }) => `
    width: max-content;
    padding: 12px 16px;
    margin: 8px;
    border-radius: 8px;
    border: 1px solid #fff;
    background-color:#fff};
    box-shadow: ${
        theme.palette.mode === 'dark'
            ? `0px 4px 8px rgb(0 0 0 / 0.7)`
            : `0px 4px 8px rgb(0 0 0 / 0.1)`
    };
    font-family: "IBM Plex Sans", sans-serif;
    font-weight: 500;
    font-size: 0.875rem;
    z-index: 1;
  `
)

const flexGrowStyles = {
    flexGrow: 1,
}

const FlexTypography = styled(Typography)(() => flexGrowStyles)
const FlexBox = styled(Box)(() => flexGrowStyles)

const StyledIconButton = styled(IconButton)(() => ({
    position: 'absolute',
    top: 8,
    right: 8,
}))

const StyledStack = styled(Stack)(() => ({ maxWidth: '800px', marginLeft: 'auto' ,marginRight:'auto'}))

const StyledMyRecipe = styled(Typography)(() => ({
    fontWeight: 'bold',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: 'block',
    maxWidth: '100%',
    height: 32,
}))

const StyledCard = styled(Card)(({ theme }) => ({
    maxWidth: '100%',
    transition: '0.3s',
    '&:hover': {
        transform: 'scale(1.05)',
    },
    boxShadow: theme.shadows[3], // ✅ use theme shadow
    borderRadius: theme.shape.borderRadius, // ✅ or theme.spacing(x)
}))

const ResponsiveCard = styled(Card)(({ theme }) => ({
    maxWidth: 345,
    marginTop: theme.spacing(2), // default for xs

    [theme.breakpoints.up('md')]: {
        marginTop: theme.spacing(5), // applies from md and up
    },
}))

const StyledLazyLoadImage = styled(LazyLoadImage)(() => ({
    objectFit: 'cover',
}))

const FlexCenterDiv = styled('div')(() => ({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
}))

const ResponsiveContainer = styled('div')(() => ({
    maxWidth: '90%',
    width: '600px',
}))

const CenteredTextDiv = styled('div')(() => ({
    textAlign: 'center',
}))

export {
    ModalBox,
    ModalContent,
    SubmitButton,
    StyledBox,
    ClickableText,
    StyledPaper,
    StyleBoxContent,
    CustomSnackbarContent,
    CustomTypography,
    Search,
    StyledInputBase,
    SearchIconWrapper,
    StyledSearchIcon,
    StyledFavoriteIcon,
    StyledCommentIcon,
    StyledInfoIcon,
    StyledCardContent,
    StyledTypography,
    StyledStarIcon,
    StyledRating,
    StyledRecipeDetailBox,
    StyledPagination,
    PopupBody,
    ExpandMore,
    FlexTypography,
    FlexBox,
    StyledTypographyMargin,
    StyledIconButton,
    StyledShoppingCartIcon,
    StyledMenuBookIcon,
    CustomIconButton,
    StyledButton,
    StyledAvatar,
    StyledAccessTimeIcon,
    StyledListItem,
    StyledRecipeBox,
    StyledCardBox,
    StyledGrid,
    StyledMyRecipe,
    StyledCard,
    StyledImageBox,
    ResponsiveCard,
    StyledDiv,
    StyledPageDiv,
    FlexCenterDiv,
    ResponsiveContainer,
    CenteredTextDiv,
    StyledLazyLoadImage,
    CustomLazyLoadImage,
    StyledIngredientBox,
    StyledStack,
}
