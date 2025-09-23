import Slider from "react-slick"
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"
import { useNavigate } from "react-router-dom"
import { LazyLoadImage } from "react-lazy-load-image-component"
import "react-lazy-load-image-component/src/effects/blur.css"
import { useSelector } from "react-redux"
import { RootState } from "../../../store/Store"

const API_URL = import.meta.env.VITE_API_URL

const RecipeSlider = () => { //  Properly destructured
    const navigate = useNavigate()
    const recipes = useSelector((state: RootState) => state.recipe.recipes)
    const settings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 1000
    }

    const handleClick = (id: string) => {
        navigate(`/recipe/${id}`)
    }

    return (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
            <div style={{ maxWidth: "90%", width: "600px" }}>
                <Slider {...settings}>
                    {recipes?.map((recipe, index) => (
                        <div key={index} style={{ textAlign: "center" }} onClick={() => handleClick(recipe?._id)}>
                            <h3>{recipe.title}</h3>
                            <LazyLoadImage
                                src={recipe.image ? `${API_URL}/uploads/${recipe.image}` : "placeholder.jpg"}
                                height="500px"
                                width="100%"
                                effect="blur" //  Apply blur effect while loading
                                style={{ objectFit: "cover",borderRadius: "10px" }}
                            /> 
                            <p>Preparation Time: {recipe.preparationTime} mins</p>
                        </div>
                    ))}
                </Slider>
            </div>
        </div>
    )
}

export default RecipeSlider
