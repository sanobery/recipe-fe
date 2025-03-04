export interface Recipe {
    _id: string;
    title: string;
    ingredients: string[];
    steps: string[];
    preparationTime:number;
    image:string,
    userId:{username:string,_id:string}
    averageRating:number
}

export interface RecipeInputs {
    title: string;
    ingredients: string[]; 
    steps: string[]; 
    image: File|null;
    preparationTime:number;
}