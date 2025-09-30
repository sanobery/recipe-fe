import { useState } from 'react'
import { Typography, Button, Tooltip, Box } from '@mui/material'

interface IngredientListProps {
    ingredients: string[]
}

const IngredientList: React.FC<IngredientListProps> = ({ ingredients }) => {
    const [showFull, setShowFull] = useState<boolean>(false)

    // Ensure at least 2 ingredients or fill with empty spaces
    const ingredient = [ingredients[0] || '\u00A0']

    return (
        <Box sx={{
    display: 'flex',
    justifyContent: 'center',      // center horizontally
    alignItems: 'center',          // center vertically
    flexDirection: 'column',       // stack heading and list vertically
    textAlign: 'center',           // center text
  }}>
            <Typography variant="h6" mt={2}>
                Ingredients
            </Typography>

            <Box>
                {showFull ? (
                    <>
                        {ingredients.map((ingredient, index) => (
                            <Tooltip key={index} title={ingredient} arrow>
                                <Typography
                                    sx={{
                                        whiteSpace: 'nowrap',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        maxWidth: '200px',
                                        display: 'block',
                                        transition: 'all 0.3s ease-in-out',
                                    }}
                                >
                                    {index + 1}. {ingredient}
                                </Typography>
                            </Tooltip>
                        ))}
                    </>
                ) : (
                    <>
                        {ingredient.map((ingredient, index) => (
                            <Tooltip key={index} title={ingredient} arrow>
                                <Typography
                                    sx={{
                                        whiteSpace: 'nowrap',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        maxWidth: '200px',
                                        display: 'block',
                                        transition: 'all 0.3s ease-in-out',
                                    }}
                                >
                                    {index + 1}. {ingredient}
                                </Typography>
                            </Tooltip>
                        ))}
                    </>
                )}
            </Box>
            {/* Show more/less button */}
            <Tooltip title={showFull ? 'Show less' : 'Show more'}>
                <Button
                    size="small"
                    sx={{ minHeight: '24px', mt: 1 }}
                    onClick={() => setShowFull(!showFull)}
                >
                    ...
                </Button>
            </Tooltip>
        </Box>
    )
}

export default IngredientList
