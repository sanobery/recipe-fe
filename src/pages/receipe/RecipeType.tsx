export interface RecipeProps {
    _id: string;
    title: string;
    image: string;
    ingredients: string[];
    steps: string[];
    preparationTime: number;
    userId: number;
    username: string;
    onViewChange: (view: "profile" | "recipeDetails" | "addRecipe", recipe: RecipeProps) => void;
}