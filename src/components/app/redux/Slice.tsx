import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Recipe {
    _id: string;
    title: string;
    ingredients: string[];
    steps: string[];
    preparationTime:number;
    image:string,
    userId:{username:string,_id:string}
}

interface RecipeState {
    recipes: Recipe[];
    selectedRecipe: Recipe | null
    currentUserRecipe: Recipe[],
    searchRecipeByIngredient:Recipe[]
}

const initialState: RecipeState = {
    recipes: [],
    selectedRecipe: null,
    currentUserRecipe: [],
    searchRecipeByIngredient:[]
};

const recipeSlice = createSlice({
    name: "recipe",
    initialState,
    reducers: {
        setRecipes: (state, action: PayloadAction<Recipe[]>) => {
            state.recipes = action.payload;
        },
        setRecipe:(state,action:PayloadAction<Recipe>) =>{
            state.selectedRecipe = action.payload;
        },
        setCurrentUserRecipe:(state,action:PayloadAction<Recipe[]>) =>{
            state.currentUserRecipe = action.payload;
        },
        setSearchRecipeByIngredient:(state,action:PayloadAction<Recipe[]>)=>{
            state.searchRecipeByIngredient = action.payload;
        }
    }
});

export const { setRecipes,setRecipe,setCurrentUserRecipe,setSearchRecipeByIngredient } = recipeSlice.actions;

export default recipeSlice.reducer;
