import Slider from 'react-slick'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import { useNavigate } from 'react-router-dom'
import 'react-lazy-load-image-component/src/effects/blur.css'
import { useSelector } from 'react-redux'
import { RootState } from '../../../store/Store'
import {
    CenteredTextDiv,
    ResponsiveContainer,
    FlexCenterDiv,
    StyledLazyLoadImage,
} from '../../styles/styles'

const API_URL = import.meta.env.VITE_API_URL

const RecipeSlider = () => {
    //  Properly destructured
    const navigate = useNavigate()
    const recipes = useSelector((state: RootState) => state.recipe.recipes)
    const settings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 1000,
    }

    const handleClick = (id: string) => {
        navigate(`/recipe/${id}`)
    }

    return (
        <FlexCenterDiv>
            <ResponsiveContainer>
                <Slider {...settings}>
                    {recipes?.map((recipe, index) => (
                        <CenteredTextDiv key={index} onClick={() => handleClick(recipe?._id)}>
                            <h3>{recipe.title}</h3>
                            <StyledLazyLoadImage
                                src={
                                    recipe.image
                                        ? `${API_URL}/uploads/${recipe.image}`
                                        : 'placeholder.jpg'
                                }
                                height="500px"
                                width="100%"
                                effect="blur" //  Apply blur effect while loading
                            />
                            <p>Preparation Time: {recipe.preparationTime} mins</p>
                        </CenteredTextDiv>
                    ))}
                </Slider>
            </ResponsiveContainer>
        </FlexCenterDiv>
    )
}

export default RecipeSlider
