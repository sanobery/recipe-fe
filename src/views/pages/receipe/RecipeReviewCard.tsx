import { useState } from 'react'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import CardActions from '@mui/material/CardActions'
import Collapse from '@mui/material/Collapse'
import Typography from '@mui/material/Typography'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import { Unstable_Popup as BasePopup } from '@mui/base/Unstable_Popup'
import { Link, useNavigate } from 'react-router-dom'
import RateComment from './RateComment'
import { useDispatch, useSelector } from 'react-redux'
import { setRecipeId } from '../../../store/Slice'
import { Box, IconButton, Rating, Snackbar } from '@mui/material'
import { selectCurrentToken } from '../../../store/AuthSlice'
import IngredientList from './IngredientList'
import 'react-lazy-load-image-component/src/effects/blur.css'
import { Recipe } from '../../../types/RecipeAuthInterface'
import { getApiUrl } from '../../../infrastructure/services/api/config'
import {
    CustomSnackbarContent,
    PopupBody,
    ResponsiveCard,
    StyledAvatar,
    StyledCardBox,
    StyledCardContent,
    StyledLazyLoadImage,
    StyledTypography,
} from '../../styles/styles'
import { ConstantMessages } from '../../../constants/ConstantMessages'
import {
    StyledCommentIcon,
    StyledFavoriteIcon,
    StyledInfoIcon,
    ExpandMore,
} from '../../styles/styles'

const API_URL = getApiUrl()

const RecipeReviewCard = (props: Recipe) => {
    const [expanded, setExpanded] = useState<boolean>(false)
    const [open, setOpen] = useState<boolean>(false)
    const [modals, setModals] = useState<boolean>(false)
    const [anchor, setAnchor] = useState<null | HTMLElement>(null)
    const [popupType, setPopupType] = useState<'rate' | 'comment' | 'delete'>('rate')
    const dispatch = useDispatch()
    const token = useSelector(selectCurrentToken)
    const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false)
    const navigate = useNavigate()

    const handleMoreVertClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchor(event.currentTarget)
        setOpen((prev) => !prev)
    }

    const handleExpandClick = () => {
        setExpanded(!expanded)
    }

    const handleClick = (type: 'rate' | 'comment', recipe: Recipe) => {
        if (!token) {
            setSnackbarOpen(true)
        } else {
            setPopupType(type)
            setModals(true)
            dispatch(setRecipeId(recipe?._id))
        }
    }

    const handleImgClick = (id: string) => {
        navigate(`/recipe/${id}`)
    }

    return (
        <>
            <ResponsiveCard>
                <CardHeader
                    avatar={
                        <StyledAvatar aria-label="recipe">
                            {props?.userId?.username.charAt(0).toUpperCase()}
                        </StyledAvatar>
                    }
                    action={
                        <>
                            <IconButton
                                aria-label="settings"
                                id={props._id}
                                onClick={handleMoreVertClick}
                            >
                                <MoreVertIcon />
                            </IconButton>
                            <BasePopup id={props._id} open={open} anchor={anchor}>
                                <PopupBody>
                                    <Link to={`/recipe/${props?._id}`} className="link popup">
                                        View Details
                                    </Link>
                                    <p className="popup" onClick={() => handleClick('rate', props)}>
                                        Rate
                                    </p>
                                    <p
                                        className="popup"
                                        onClick={() => handleClick('comment', props)}
                                    >
                                        Comment
                                    </p>
                                </PopupBody>
                            </BasePopup>
                        </>
                    }
                    title={props.title}
                    subheader={props?.userId?.username}
                />

                <Snackbar
                    open={snackbarOpen}
                    autoHideDuration={2000}
                    onClose={() => setSnackbarOpen(false)}
                    anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                >
                    <CustomSnackbarContent message={ConstantMessages.LOGIN_FIRST} />
                </Snackbar>

                {modals && (
                    <RateComment
                        open={modals}
                        onClose={() => {
                            setModals(false)
                            setOpen(false)
                        }}
                        type={popupType}
                    />
                )}
                <StyledLazyLoadImage
                    src={props.image ? `${API_URL}/uploads/${props.image}` : 'placeholder.jpg'}
                    height="200px"
                    width="300px"
                    effect="blur" //  Apply blur effect while loading
                    onClick={() => handleImgClick(props?._id)}
                />
                <CardContent>
                    <Box display="flex" alignItems="center" mt={1}>
                        <Rating value={Math.ceil(props?.averageRating)} readOnly />
                        <Typography variant="body2" ml={1}>
                            ({Math.ceil(props?.averageRating)}/5)
                        </Typography>
                    </Box>
                    <IngredientList ingredients={props?.ingredients} />
                    <StyledTypography variant="body2">
                        Preparation Time - {props.preparationTime} mins
                    </StyledTypography>
                </CardContent>

                <CardActions disableSpacing>
                    <StyledCardBox>
                        <IconButton>
                            <StyledFavoriteIcon
                                aria-label="rate"
                                onClick={() => handleClick('rate', props)}
                            />
                        </IconButton>

                        {/* Comment Icon */}
                        <IconButton>
                            <StyledCommentIcon
                                aria-label="comment"
                                onClick={() => handleClick('comment', props)}
                            />
                        </IconButton>

                        {/* View Details Icon */}
                        <IconButton aria-label="view details">
                            <Link to={`/recipe/${props._id}`} className="link">
                                <StyledInfoIcon />
                            </Link>
                        </IconButton>
                    </StyledCardBox>
                    <ExpandMore
                        expand={expanded}
                        onClick={handleExpandClick}
                        aria-expanded={expanded}
                        aria-label="show more"
                    >
                        <ExpandMoreIcon />
                    </ExpandMore>
                </CardActions>

                <Collapse in={expanded} timeout="auto" unmountOnExit>
                    <StyledCardContent>
                        <Typography variant="h6">Steps:</Typography>
                        {props?.steps.map((step, index) => (
                            <Typography variant="body2" key={index}>
                                {index + 1}. {step}
                            </Typography>
                        ))}
                    </StyledCardContent>
                </Collapse>
            </ResponsiveCard>
        </>
    )
}

export default RecipeReviewCard
