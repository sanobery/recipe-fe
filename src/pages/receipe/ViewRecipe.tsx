import { useState,useEffect } from "react";
import Grid from "@mui/material/Grid2";
import { RootState } from "../../components/app/redux/Store";
import { useDispatch, useSelector } from "react-redux";
import { setRecipes } from "../../components/app/redux/Slice";
import RecipeHeader from "./RecipeHeader";
import RecipeReviewCard from "./RecipeReviewCard";
import { Pagination } from "@mui/material";
import config from "../../components/app/api/config/config";
import RecipeSlider from "./RecipeSlider";

const ViewRecipe = () => {
    const recipes = useSelector((state: RootState) => state.recipe.recipes);
    const dispatch = useDispatch();
    const [page, setPage] = useState<number>(1);
    const recipesPerPage = 4;
    const [totalRecipes, setTotalRecipes] = useState<number>(0);
    const searchedRecipes = useSelector((state: RootState) => state.recipe.searchRecipeByIngredient);
    const displayedRecipes = searchedRecipes.length > 0 ? searchedRecipes : recipes;
    const search = searchedRecipes.length? false:true

    useEffect(() => {
        const getRecipes = async () => {
            try {
                const res = await fetch(`${config.apiUrl}/recipe?page=${page}&limit=${recipesPerPage}`, {
                    method: "GET",
                    credentials: "include",
                });
                const data = await res.json();
    
                dispatch(setRecipes(data?.recipes));
                setTotalRecipes(data?.total);
            } catch (error) {
                if(error instanceof Error){
                    setRecipes([]); // Optional: Set an empty array in case of failure
                    setTotalRecipes(0); 
                }
            }
        };
    
        getRecipes();
    }, [page, dispatch]); // ✅ Added 'dispatch' as well
    

    const handlePageChange = (_:unknown,value: number) => {
        setPage(value);
    };
    
    return (
        <>
            <RecipeHeader/>
            {search && <RecipeSlider/>}
            <div style={{ display: "flex", width: "100%" }}>
                <div style={{ flex: 1, transition: "0.3s ease-in-out" }}>
                    <Grid container spacing={3} justifyContent="center">
                        {displayedRecipes.length > 0 ? (
                            displayedRecipes.map((recipe, index) => (
                                <Grid item key={index} xs={12} sm={6} md={6}>
                                    <RecipeReviewCard {...recipe} />
                                </Grid>
                            ))
                        ) : (
                            <p>No recipes found.</p>
                        )}
                    </Grid>

                    {search && <Pagination
                        count={Math.ceil(totalRecipes / recipesPerPage)}
                        page={page}
                        onChange={handlePageChange}
                        sx={{ display: "flex", justifyContent: "center", marginTop: 2 }}
                    />}
                </div>
            </div>
        </>
    );
};

export default ViewRecipe;
