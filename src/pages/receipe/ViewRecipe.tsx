import { useState,useEffect } from "react";
import Grid from "@mui/material/Grid2";
import { RootState } from "../../components/app/redux/Store";
import { useDispatch,useSelector } from "react-redux";
import { setRecipe, setRecipes, setSearchRecipeByIngredient } from "../../components/app/redux/Slice";
import withAuth from "../auth/WithAuthCheck";
import { selectCurrentToken } from "../../components/app/redux/AuthSlice";
import NavbarNew from "../../components/NavbarNew";
import Profile from "../auth/Profile";
import { IconButton,Pagination} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AddRecipe from "./AddRecipe";
import RecipeDetail from "./RecipeDetail";
import UserRecipe from "./UserRecipe";
import config from "../../components/app/api/config/config";
import RecipeHeader from "./RecipeHeader";
import RecipeReviewCard from "./RecipeReviewCard";

const viewRecipe =() =>{
    const recipes = useSelector((state: RootState) => state.recipe.recipes);
    const [filteredRecipes, setFilteredRecipes] = useState(recipes);
    const dispatch = useDispatch();
    const token = useSelector(selectCurrentToken);
    const [selectedView, setSelectedView] = useState<null | "profile" | "recipeDetails" | "addRecipe" | "rateComment"| "userRecipe">(null);
    const [page, setPage] = useState(1);
    const recipesPerPage = 4;
    const [totalRecipes, setTotalRecipes] = useState(0);
    const [isSearching,setIsSearching] = useState<boolean>(false)

    const getRecipes = async () => {
        try {
            const res = await fetch(`${config.apiUrl}/recipe?page=${page}&limit=${recipesPerPage}`,{
                method: "GET",
                credentials: "include",
            });            
          const data = await res.json();
          
          dispatch(setRecipes(data?.recipes));
          setTotalRecipes(data?.total);
          setIsSearching(false);
        } catch (error) {
          console.error(error);
        }
      };
    useEffect(() => {
        getRecipes();
      }, [page]);

    // Sync filteredRecipes when recipes update
    useEffect(() => {
        setFilteredRecipes(recipes)
    }, [recipes])

    // Handle search filtering
    const handleSearch = async (ingredient: string) => {
        if (!ingredient) {
            setPage(1);
            setIsSearching(false);
            //setFilteredRecipes(recipes); // Reset when empty
            getRecipes();
            return;
        }        
        try {
            const res = await fetch(`${config.apiUrl}/recipe/search`,{
                method: "POST",
                body:JSON.stringify({ingredient}),
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`, // ✅ Send token in Authorization header
                },
            });
            
            const data = await res.json();
            setFilteredRecipes(data?.recipe);
            dispatch(setSearchRecipeByIngredient(data?.recipe));
            setTotalRecipes(data?.total);
            setIsSearching(true);
          } catch (error) {
            console.error(error);
          }
        // const filtered = recipes.filter((recipe) =>
        // recipe.ingredients.some((ingredient: string) =>
        //     ingredient.toLowerCase().includes(ingredient.toLowerCase())
        // )
        // );

        // setFilteredRecipes(filtered);
    };

    const handleViewChange = (view: "profile" | "addRecipe"|"recipeDetails" | "rateComment" |"userRecipe", recipe:[]) => {
        setSelectedView(view);        
        if (view === "recipeDetails" || view === "rateComment" ) {
            dispatch(setRecipe(recipe));
        }

        if( view === "rateComment"){
            setSelectedView(null);
        }
    };

    const handlePageChange = (event,value:number) => {
        setPage(value);
    };    
    
    return(
        <>
        {/* <NavbarNew onSearch={handleSearch} onViewChange={handleViewChange}/> */}
        {/* <RecipeHeader/> */}
        <div style={{ display: "flex", width: "100%" }}>
            {/* Left Side: Recipe List (Full Width or Half Width Based on Selection) */}
            <div style={{ flex: selectedView ? 0.7 : 1, transition: "0.3s ease-in-out" }}>
                <Grid container spacing={3} justifyContent="center">
                    {filteredRecipes?.length > 0 ? (
                        filteredRecipes.map((recipe, index) => (
                            <Grid item key={index} xs={12} sm={6} md={6}>
                                <RecipeReviewCard {...recipe} onViewChange={handleViewChange}/>
                            </Grid>
                        ))
                    ) : (
                        <p>No recipes found for the given ingredient.</p>
                    )}
                </Grid>
                {/* Pagination UI at Bottom */}
                {<Pagination 
                    count={Math.ceil(totalRecipes / recipesPerPage)} // ⬅️ Dynamically adjust page count
                    page={page} 
                    onChange={handlePageChange} 
                    sx={{ display: "flex", justifyContent: "center", marginTop: 2 }} 
                />}
            </div>

            {/* Right Side: Detail View (Only Shows When a View is Selected) */}
            {selectedView && (
                <div
                    style={{
                        flex: 0.3,
                        transition: "0.3s ease-in-out",
                        padding: "10px",
                        borderLeft: "1px solid #ccc",
                        position: "relative", // Ensures absolute positioning works
                        display: "flex",
                        flexDirection: "column",
                    }}
                >
                    {/* Close Button Positioned at Extreme Right */}
                    <IconButton
                        sx={{
                            position: "absolute",
                            top: 10,
                            right: 8,
                            color: "grey.600",
                        }}
                        onClick={() => setSelectedView(null)}
                    >
                        <CloseIcon />
                    </IconButton>

                    {/* Conditional Views */}
                    {selectedView === "profile" && <Profile />}
                    {selectedView === "recipeDetails" && <RecipeDetail />}
                    {selectedView === "userRecipe" && <UserRecipe />}
                    {/* {selectedView === "addRecipe" && <AddRecipe />}  */}
                </div>
            )}
        </div>
        </>
      );
}

export default (viewRecipe )