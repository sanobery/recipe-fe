import { useState } from 'react'
import { Typography, Tooltip, Box } from '@mui/material'
import { CustomTypography, StyledButton, StyledRecipeDetailBox } from '../../styles/styles'

interface IngredientListProps {
    ingredients: string[]
}

const IngredientList: React.FC<IngredientListProps> = ({ ingredients }) => {
    const [showFull, setShowFull] = useState<boolean>(false)

    // Ensure at least 2 ingredients or fill with empty spaces
    const ingredient = [ingredients[0] || '\u00A0']

    return (
        <StyledRecipeDetailBox>
            <Typography variant="h6" mt={2}>
                Ingredients
            </Typography>

            <Box>
                {showFull ? (
                    <>
                        {ingredients.map((ingredient, index) => (
                            <Tooltip key={index} title={ingredient} arrow>
                                <CustomTypography>
                                    {index + 1}. {ingredient}
                                </CustomTypography>
                            </Tooltip>
                        ))}
                    </>
                ) : (
                    <>
                        {ingredient.map((ingredient, index) => (
                            <Tooltip key={index} title={ingredient} arrow>
                                <CustomTypography>
                                    {index + 1}. {ingredient}
                                </CustomTypography>
                            </Tooltip>
                        ))}
                    </>
                )}
            </Box>
            {/* Show more/less button */}
            <Tooltip title={showFull ? 'Show less' : 'Show more'}>
                <StyledButton size="small" onClick={() => setShowFull(!showFull)}>
                    ...
                </StyledButton>
            </Tooltip>
        </StyledRecipeDetailBox>
    )
}

export default IngredientList
