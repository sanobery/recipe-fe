import { useState } from "react";
import { Typography, Button } from "@mui/material";

interface IngredientListProps {
    ingredients: string[];
}

const IngredientList: React.FC<IngredientListProps> = ({ ingredients }) => {
    const [showFull, setShowFull] = useState<boolean>(false);
    const maxVisible = 3; // Number of ingredients to show before "..."

    // Ensure uniform height by filling missing lines with empty space
    const filledIngredients = [...ingredients.slice(0, maxVisible)];
    while (filledIngredients.length < maxVisible) {
        filledIngredients.push("\u00A0"); // Adding non-breaking space
    }

    return (
        <>
            {showFull ? (
                ingredients.map((ingredient, index) => (
                    <Typography key={index}>
                        {index + 1}. {ingredient}
                    </Typography>
                ))
            ) : (
                <>
                    {filledIngredients.map((ingredient, index) => (
                        <Typography key={index}>
                            {ingredient !== "\u00A0" ? `${index + 1}. ${ingredient}` : ingredient}
                        </Typography>
                    ))}
                    {ingredients.length >= maxVisible && (
                        <Button size="small" onClick={() => setShowFull(true)}>
                            ...
                        </Button>
                    )}
                </>
            )}
        </>
    );
};

export default IngredientList;
