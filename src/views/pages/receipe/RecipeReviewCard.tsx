import {useState} from "react"
import { styled } from "@mui/material/styles"
import Card from "@mui/material/Card"
import CardHeader from "@mui/material/CardHeader"
import CardContent from "@mui/material/CardContent"
import CardActions from "@mui/material/CardActions"
import Collapse from "@mui/material/Collapse"
import Avatar from "@mui/material/Avatar"
import IconButton, { IconButtonProps } from "@mui/material/IconButton"
import Typography from "@mui/material/Typography"
import { blue } from "@mui/material/colors"
import ExpandMoreIcon from "@mui/icons-material/ExpandMore"
import MoreVertIcon from "@mui/icons-material/MoreVert"
import { Unstable_Popup as BasePopup } from "@mui/base/Unstable_Popup"
import { Link, useNavigate } from "react-router-dom"
import RateComment from "./RateComment"
import CommentIcon from "@mui/icons-material/Comment";
import InfoIcon from "@mui/icons-material/Info";
import { useDispatch, useSelector } from "react-redux"
import { setRecipeId } from "../../../store/Slice"
import { Box, Rating, Snackbar } from "@mui/material"
import { selectCurrentToken } from "../../../store/AuthSlice"
import  FavoriteIcon  from "@mui/icons-material/Favorite"
import IngredientList from "./IngredientList"
import { LazyLoadImage } from "react-lazy-load-image-component"
import "react-lazy-load-image-component/src/effects/blur.css"
import { Recipe } from "../../../types/RecipeAuthInterface"
import { getApiUrl } from "../../../infrastructure/services/api/config"

const API_URL = getApiUrl()
interface ExpandMoreProps extends IconButtonProps {
  expand: boolean
}

const ExpandMore = styled((props: ExpandMoreProps) => {
  const { ...other } = props
  return <IconButton {...other} />
})(({theme }) => ({
  marginLeft: "auto",
  transition: theme.transitions.create("transform", {
    duration: theme.transitions.duration.shortest,
  }),
  variants: [
    {
      props: ({ expand }) => !expand,
      style: {
        transform: "rotate(0deg)",
      },
    },
    {
      props: ({ expand }) => !!expand,
      style: {
        transform: "rotate(180deg)",
      },
    },
  ],
}))

const PopupBody = styled("div")(
    ({ theme }) => `
    width: max-content;
    padding: 12px 16px;
    margin: 8px;
    border-radius: 8px;
    border: 1px solid #fff;
    background-color:#fff};
    box-shadow: ${
      theme.palette.mode === "dark"
        ? `0px 4px 8px rgb(0 0 0 / 0.7)`
        : `0px 4px 8px rgb(0 0 0 / 0.1)`
    };
    font-family: "IBM Plex Sans", sans-serif;
    font-weight: 500;
    font-size: 0.875rem;
    z-index: 1;
  `,
  )

const RecipeReviewCard = (props: Recipe) =>{ 
    const [expanded, setExpanded] = useState<boolean>(false) 
    const [open, setOpen] = useState<boolean>(false)
    const [modals, setModals] = useState<boolean>(false)
    const [anchor, setAnchor] = useState<null | HTMLElement>(null)
    const [popupType, setPopupType] = useState<"rate" | "comment" | "delete">("rate")
    const dispatch = useDispatch()
    const token = useSelector(selectCurrentToken)
    const [snackbarOpen,setSnackbarOpen] = useState<boolean>(false)
    const navigate = useNavigate()

    const handleMoreVertClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchor(event.currentTarget) 
        setOpen((prev) => !prev) 
    }

    const handleExpandClick = () => {
        setExpanded(!expanded)
    }

    const handleClick = (type: "rate" | "comment" ,recipe:Recipe) => {
        if(!token){
            setSnackbarOpen(true)
        }
        else{
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
        <Card sx={{ mt: { xs: 2, md: 5 }, maxWidth: 345 }}>
        
        <CardHeader
            avatar={
                <Avatar sx={{ bgcolor: blue[500] }} aria-label="recipe">
                    {props?.userId?.username.charAt(0).toUpperCase()}
                </Avatar>
            }
            action={
            <>
            <IconButton aria-label="settings" id={props._id} onClick={handleMoreVertClick}>
                <MoreVertIcon />
            </IconButton>
            <BasePopup id={props._id} open={open} anchor={anchor}>
                <PopupBody>
                    <Link to={`/recipe/${props?._id}`} className="link popup">View Details</Link>
                    <p className="popup" onClick={() => handleClick("rate",props)}>Rate</p>
                    <p className="popup" onClick={() => handleClick("comment",props)}>Comment</p>
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
            message="Please login first"
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
            ContentProps={{
                sx: { backgroundColor: "#FF5722", color: "white" }, // Apply styles here
            }}
            
        />
        {modals && <RateComment open={modals} onClose={() => { setModals(false); setOpen(false); }} type={popupType}/>}
        <LazyLoadImage
            src={props.image ? `${API_URL}/uploads/${props.image}` : "placeholder.jpg"}
            height="200px"
            width="300px"
            effect="blur" //  Apply blur effect while loading
            style={{ objectFit: "cover" }}
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
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
                Preparation Time - {props.preparationTime} mins
            </Typography>
        </CardContent>

        <CardActions disableSpacing>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <IconButton>
                    <FavoriteIcon aria-label="rate" onClick={() => handleClick("rate",props)} sx={{ color: "#FF9800" }}/>
                </IconButton>

                    {/* Comment Icon */}
                <IconButton>
                    <CommentIcon aria-label="comment" sx={{ color: "#333" ,mt:0.5}} onClick={() => handleClick("comment",props)}/>
                </IconButton>

                {/* View Details Icon */}
                <IconButton aria-label="view details">
                    <Link to={`/recipe/${props._id}`} className="link">
                    <InfoIcon sx={{ color: "blue" ,mt:1}}/>
                    </Link>
                </IconButton>
            </Box>
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
            <CardContent>
            <Typography variant="h6" sx={{ marginBottom: 2 }}>Steps:</Typography>
            {props?.steps.map((step, index) => (
                <Typography variant="body2" key={index}>
                    {index + 1}. {step}
                </Typography>
            ))}
            </CardContent>
        </Collapse>

        </Card>
        </>
    )
}

export default RecipeReviewCard
