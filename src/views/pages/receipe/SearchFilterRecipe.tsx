import { Box, FormControl, InputLabel, Select, MenuItem, Snackbar } from "@mui/material"
import { useState, useEffect } from "react"
import { useDispatch } from "react-redux"
import { setSearchRecipeByIngredient } from "../../../store/Slice"
import { styled } from "@mui/material/styles"
import InputBase from "@mui/material/InputBase"
import SearchIcon from "@mui/icons-material/Search"
import { SelectChangeEvent } from "@mui/material"
import recipeService from "../../../infrastructure/services/api/recipe/RecipeInstance"

const ingredients = ["None", "Rating", "PreparationTime"]
const ratingOptions = [1, 2, 3, 4, 5]
const timeOptions = ["0-10", "11-20", "21-30", "31-45", "41-60", "61-70", "71-80", "81-90", "91-100"]

const Search = styled("div")(({ theme }) => ({
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: "#1976d2",
    "&:hover": { backgroundColor: "#1565c0" },
    width: "100%",
    [theme.breakpoints.up("sm")]: { width: "300px" },
}))

const SearchIconWrapper = styled("div")(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: "100%",
    position: "absolute",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
}))

const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: "#fff",
    width: "100%",
    "& .MuiInputBase-input": {
        padding: theme.spacing(1, 1, 1, 0),
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        transition: theme.transitions.create("width"),
        [theme.breakpoints.up("sm")]: {
            width: "12ch",
            "&:focus": { width: "20ch" },
        },
    },
}))

const SearchFilterRecipe = () => {
    const [selectedFilter, setSelectedFilter] = useState<string>("")
    const [selectedValue, setSelectedValue] = useState<string>("")
    const dispatch = useDispatch()
    const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false)
    const [message, setMessage] = useState<string>("")
    const [searchTerm, setSearchTerm] = useState<string>("")

    useEffect(() => {
        const delayDebounceFn = setTimeout(async () => {
            if (searchTerm.trim() === "") {
                dispatch(setSearchRecipeByIngredient([]))
                return
            }
            const query = { ingredient: searchTerm }
            const response = await recipeService.search(query)
            if (response.success) {
                dispatch(setSearchRecipeByIngredient(response.success.recipes))
            } else {
                setSnackbarOpen(true)
                setMessage(response.error.message)
                dispatch(setSearchRecipeByIngredient([]))
            }
        }, 500)
        return () => clearTimeout(delayDebounceFn)
    }, [searchTerm, dispatch])

    const searchByIngredient = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value)
    }

    const handleFilterChange = (event: SelectChangeEvent<string>) => {
        const newKey = event.target.value.toLowerCase()
        setSelectedFilter(newKey)
        setSelectedValue("")
        if (newKey === "none") {
            dispatch(setSearchRecipeByIngredient([]))
        }
    }

    const handleValueChange = async (event: SelectChangeEvent<string>) => {
        const newValue = event.target.value
        setSelectedValue(newValue)
        const queryParams = { [selectedFilter]: newValue }
        const response = await recipeService.filter(queryParams)
        if (response.success) {
            dispatch(setSearchRecipeByIngredient(response.success.recipes))
        } else {
            setSnackbarOpen(true)
            setMessage(response.error.message)
            dispatch(setSearchRecipeByIngredient([]))
        }
    }

    return (
        <>
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={2000}
                onClose={() => setSnackbarOpen(false)}
                message={message}
                anchorOrigin={{ vertical: "top", horizontal: "center" }}
                ContentProps={{ sx: { backgroundColor: "#FF5722", color: "white" } }}
            />
            <Box display="flex" justifyContent="space-between" alignItems="center" p={2} bgcolor="#f5f5f5" borderRadius={2} boxShadow={2} flexWrap="wrap">
                <Search>
                    <SearchIconWrapper>
                        <SearchIcon sx={{ color: "#fff" }} />
                    </SearchIconWrapper>
                    <StyledInputBase
                        placeholder="Search by Ingredient"
                        inputProps={{ "aria-label": "search" }}
                        value={searchTerm}
                        onChange={searchByIngredient}
                    />
                </Search>

                <Box display="flex" gap={2} alignItems="center">
                   <FormControl variant="outlined" size="small" sx={{ minWidth: 120 }}>
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

{selectedFilter && selectedFilter !== "none" && (
  <FormControl variant="outlined" size="small" sx={{ minWidth: 120 }}>
    <InputLabel id="select-rating-label">
      {selectedFilter === "rating" ? "Select Rating" : "Select Time"}
    </InputLabel>
    <Select
      labelId="select-rating-label"
      id="select-rating-select"
      value={selectedValue}
      onChange={handleValueChange}
      label={selectedFilter === "rating" ? "Select Rating" : "Select Time"}
    >
      {(selectedFilter === "rating" ? ratingOptions : timeOptions).map(
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
