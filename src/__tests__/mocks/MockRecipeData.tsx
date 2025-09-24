import configureStore from "redux-mock-store"
import { Recipe } from "../../types/RecipeAuthInterface"


export const mockStore = configureStore([])

export const mockRecipe: Recipe[] = [
  {
    _id: "1",
    title: "Test Recipe",
    image: "test.jpg",
    preparationTime: 30,
    averageRating: 4,
    ingredients: ["sugar", "milk"],
    steps: ["Boil milk", "Add sugar"],
    userId: { _id: "u1", username: "testuser" },
  },
]
