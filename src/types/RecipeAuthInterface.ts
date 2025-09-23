export interface Recipe {
    _id: string,
    title: string,
    ingredients: string[],
    steps: string[],
    preparationTime: number,
    image: string,
    userId: { username: string, _id: string },
    averageRating: number,
}

// RecipeInputs reuses Recipe but removes _id, userId, and averageRating, then changes image type
export type RecipeInputs = Omit<Recipe, "_id" | "userId" | "averageRating" | "image"> & {
    image: File | "",
}
export interface LoginFormInputs {
    email: string,
    password: string,
}

export interface SignupInputs extends LoginFormInputs {
    username: string,
}

export interface UserRecipeProps {
    handleClose: () => void
}
