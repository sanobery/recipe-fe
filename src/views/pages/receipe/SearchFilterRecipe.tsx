import { Box, FormControl, InputLabel, Select, MenuItem, Snackbar } from '@mui/material'
import { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setSearchRecipeByIngredient } from '../../../store/Slice'
import { SelectChangeEvent } from '@mui/material'
import recipeService from '../../../infrastructure/services/api/recipe/RecipeInstance'
import useSWR from 'swr'
import { ConstantMessages } from '../../../constants/ConstantMessages'
import {
    CustomSnackbarContent,
    StyledSearchIcon,
    Search,
    SearchIconWrapper,
    StyledInputBase,
} from '../../styles/styles'

const ingredients = ['None', 'Rating', 'PreparationTime']
const ratingOptions = [1, 2, 3, 4, 5]
const timeOptions = [
    '0-10',
    '11-20',
    '21-30',
    '31-45',
    '41-60',
    '61-70',
    '71-80',
    '81-90',
    '91-100',
]

// =============================================
// Debounce Hook
// =============================================
// - Custom React hook to delay execution of a function
// - Useful for optimizing performance in search inputs, filters, etc.
// - Prevents excessive API calls by waiting until user stops typing
// - Improves responsiveness and reduces server load
// - Returns the debounced value after the specified delay
// - Enhances overall user experience in dynamic UIs
// =============================================
const useDebounce = (value: string, delay: number) => {
    const [debouncedValue, setDebouncedValue] = useState(value)
    useEffect(() => {
        const handler = setTimeout(() => setDebouncedValue(value), delay)
        return () => clearTimeout(handler)
    }, [value, delay])
    return debouncedValue
}

const SearchFilterRecipe = () => {
    const [selectedFilter, setSelectedFilter] = useState<string>('')
    const [selectedValue, setSelectedValue] = useState<string>('')
    const dispatch = useDispatch()
    const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false)
    const [message, setMessage] = useState<string>('')
    const [searchTerm, setSearchTerm] = useState<string>('')

    const debouncedSearchTerm = useDebounce(searchTerm, 500)

    const { data: searchData, error: searchError } = useSWR(
        debouncedSearchTerm.trim() ? ['search', debouncedSearchTerm] : null,
        async ([, term]) => {
            const response = await recipeService.search({ ingredient: term })
            if (response.success) {
                return response.success
            } else {
                throw new Error(response.error?.message || ConstantMessages.NO_RECIPE)
            }
        }
    )

    const { data: filterData, error: filterError } = useSWR(
        selectedFilter && selectedValue ? ['filter', selectedFilter, selectedValue] : null,
        async ([, key, value]) => {
            const response = await recipeService.filter({ [key]: value })
            if (response.success) {
                return response.success
            } else {
                throw new Error(response.error?.message || ConstantMessages.NO_RECIPE)
            }
        }
    )

    useEffect(() => {
        if (searchData) {
            dispatch(setSearchRecipeByIngredient(searchData.recipes))
        }
        if (searchError) {
            setSnackbarOpen(true)
            setMessage(ConstantMessages.NO_RECIPE)
            dispatch(setSearchRecipeByIngredient([]))
        }
    }, [searchData, searchError, dispatch])

    useEffect(() => {
        if (filterData) {
            dispatch(setSearchRecipeByIngredient(filterData.recipes))
        }
        if (filterError) {
            setSnackbarOpen(true)
            setMessage(ConstantMessages.NO_RECIPE)
            dispatch(setSearchRecipeByIngredient([]))
        }
    }, [filterData, filterError, dispatch])

    const searchByIngredient = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value)
    }

    const handleFilterChange = (event: SelectChangeEvent<string>) => {
        const newKey = event.target.value.toLowerCase()
        setSelectedFilter(newKey)
        setSelectedValue('')
        if (newKey === 'none') {
            dispatch(setSearchRecipeByIngredient([]))
        }
    }

    const handleValueChange = (event: SelectChangeEvent<string>) => {
        setSelectedValue(event.target.value)
    }

    return (
        <>
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={2000}
                onClose={() => setSnackbarOpen(false)}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <CustomSnackbarContent message={message} />
            </Snackbar>

            <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                p={2}
                bgcolor="#f5f5f5"
                borderRadius={2}
                boxShadow={2}
                flexWrap="wrap"
            >
                <Search>
                    <SearchIconWrapper>
                        <StyledSearchIcon />
                    </SearchIconWrapper>
                    <StyledInputBase
                        placeholder="Search by Ingredient"
                        inputProps={{ 'aria-label': 'search' }}
                        value={searchTerm}
                        onChange={searchByIngredient}
                    />
                </Search>

                <Box display="flex" gap={2} alignItems="center">
                    <FormControl variant="outlined" size="small" className="formWidth">
                        <InputLabel id="filter-by-label">Filter By</InputLabel>
                        <Select
                            labelId="filter-by-label"
                            id="filter-by-select"
                            value={selectedFilter}
                            onChange={handleFilterChange}
                            label="Filter By"
                        >
                            {ingredients.map((ingredient) => (
                                <MenuItem key={ingredient} value={ingredient}>
                                    {ingredient}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    {selectedFilter && selectedFilter !== 'none' && (
                        <FormControl variant="outlined" size="small" className="formWidth">
                            <InputLabel id="select-rating-label">
                                {selectedFilter === 'rating' ? 'Select Rating' : 'Select Time'}
                            </InputLabel>
                            <Select
                                labelId="select-rating-label"
                                id="select-rating-select"
                                value={selectedValue}
                                onChange={handleValueChange}
                                label={
                                    selectedFilter === 'rating' ? 'Select Rating' : 'Select Time'
                                }
                            >
                                {(selectedFilter === 'rating' ? ratingOptions : timeOptions).map(
                                    (option) => (
                                        <MenuItem key={option} value={option}>
                                            {option}
                                        </MenuItem>
                                    )
                                )}
                            </Select>
                        </FormControl>
                    )}
                </Box>
            </Box>
        </>
    )
}

export default SearchFilterRecipe
