import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useSelector } from "react-redux";
import { RootState } from "../../components/app/redux/Store";
import config from "../../components/app/api/config/config";
import { useNavigate } from "react-router-dom";

const RecipeSlider = () => {
    const settings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 1000
    };

    const recipes = useSelector((state: RootState) => state.recipe.recipes);
    const navigate = useNavigate();

    const handleClick = (id:string)=>{
        navigate(`/recipe/${id}`);
    }

    return (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }} >
            <div style={{ maxWidth: "90%", width: "600px" }}>
                <Slider {...settings}>
                    {recipes.map((recipe, index) => (
                        <div key={index} style={{ textAlign: "center" }} onClick={()=>handleClick(recipe?._id)}>
                            <h3>{recipe.title}</h3>
                            <img
                                src={recipe.image ? `${config.apiUrl}/uploads/${recipe.image}` : "placeholder.jpg"}
                                alt={recipe.title}
                                style={{ width: "100%", height: "500px", borderRadius: "10px", objectFit: "cover" }}
                            />
                            <p>Preparation Time: {recipe.preparationTime} mins</p>
                        </div>
                    ))}
                </Slider>
            </div>
        </div>
    );
};

export default RecipeSlider;
