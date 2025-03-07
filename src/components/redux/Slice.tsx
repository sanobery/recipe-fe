import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { Recipe } from "../../utils/RecipeAuthInterface"

interface RecipeRatingComment {
    _id: string,
    title: string,
    ingredients: string[],
    steps: string[],
    preparationTime:number,
    image:string,
    userId:{username:string,_id:string},
    comments:{username:string,_id:string},
    averageRating:number,
    ratings:{
        _id:number,
        userId:{
            id:number,
            username:string
        }
    }
}

interface RecipeState {
    recipes: Recipe[]
    selectedRecipe: RecipeRatingComment | null
    currentUserRecipe: Recipe[],
    searchRecipeByIngredient:Recipe[]
    recipeId:string|""
}

const initialState: RecipeState = {
    recipes: [],
    selectedRecipe: null,
    currentUserRecipe: [],
    searchRecipeByIngredient:[],
    recipeId:""
}

const recipeSlice = createSlice({
    name: "recipe",
    initialState,
    reducers: {
        setRecipes: (state, action: PayloadAction<Recipe[]>) => {
            state.recipes = action.payload
        },
        setRecipeId:(state,action:PayloadAction<string>)=>{
            state.recipeId = action.payload
        },
        setRecipe:(state,action:PayloadAction<RecipeRatingComment>) =>{
            state.selectedRecipe = action.payload
        },
        setCurrentUserRecipe:(state,action:PayloadAction<Recipe[]>) =>{
            state.currentUserRecipe = action.payload
        },
        setSearchRecipeByIngredient:(state,action:PayloadAction<Recipe[]>)=>{
            state.searchRecipeByIngredient = action.payload
        }
    }
})

export const { setRecipes,setRecipe,setCurrentUserRecipe,setSearchRecipeByIngredient,setRecipeId } = recipeSlice.actions

export default recipeSlice.reducer
