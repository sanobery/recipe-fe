import { Box, FormControl, InputLabel, Select, MenuItem, Snackbar } from "@mui/material";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { selectCurrentToken } from "../../components/app/redux/AuthSlice";
import { setSearchRecipeByIngredient } from "../../components/app/redux/Slice";
import config from "../../components/app/api/config/config";
import { styled } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';
import { fetchData } from "../../components/utils/FetchData";
import { SelectChangeEvent } from "@mui/material";

const ingredients = ["None", "Rating", "PreparationTime"];
const ratingOptions = [1, 2, 3, 4, 5];
const timeOptions = ["0-10", "11-20", "21-30", "31-45", "41-60", "61-70", "71-80", "81-90", "91-100"];

const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: '#1976d2',
    '&:hover': {
        backgroundColor: '#1565c0',
    },
    width: '100%',
    [theme.breakpoints.up('sm')]: {
        width: '300px',
    },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: '#fff',
    width: '100%',
    '& .MuiInputBase-input': {
        padding: theme.spacing(1, 1, 1, 0),
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        transition: theme.transitions.create('width'),
        [theme.breakpoints.up('sm')]: {
            width: '12ch',
            '&:focus': {
                width: '20ch',
            },
        },
    },
}));

const RecipeHeader = () => {
    const [selectedFilter, setSelectedFilter] = useState("");
    const [selectedValue, setSelectedValue] = useState("");
    const token = useSelector(selectCurrentToken);
    const dispatch = useDispatch();
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [message, setMessage] = useState("");
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const delayDebounceFn = setTimeout(async () => {
            if (searchTerm.trim() === "") {
                dispatch(setSearchRecipeByIngredient([]));
                return;
            }
            try {
                const response = await fetchData(`${config.apiUrl}/recipe/search`, "POST", { ingredient: searchTerm });
                dispatch(setSearchRecipeByIngredient(response?.recipes));
            } catch (error) {
                if(error instanceof Error){
                    setSnackbarOpen(true)
                    setMessage(error.message);
                    dispatch(setSearchRecipeByIngredient([]));
                }
            }
        }, 500);
        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm,dispatch]);

    const searchByIngredient = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };

    const handleFilterChange = async (event: SelectChangeEvent<string>) => {
        const newKey = event.target.value.toLowerCase();
        setSelectedFilter(newKey);
        setSelectedValue("");
        if (newKey === "none") {
            dispatch(setSearchRecipeByIngredient([]));
            return;
        }
    };

    const handleValueChange = async (event: SelectChangeEvent<string>) => {
        const newValue = event.target.value;
        setSelectedValue(newValue);
        try {
            const feedback = await fetch(`${config.apiUrl}/recipe/filter?${selectedFilter}=${newValue}`, {
                method: "GET",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });
            const response = await feedback.json();
            if (feedback.status === 200) {
                dispatch(setSearchRecipeByIngredient(response?.recipes));
            } else {
                setSnackbarOpen(true)
                setMessage(response?.message)
                dispatch(setSearchRecipeByIngredient([]));
            }
        } catch (error) {
            if(error instanceof Error ){
                setSnackbarOpen(true)
                setMessage(error.message)
                dispatch(setSearchRecipeByIngredient([]));
            }       
        }
    };

    return (
        <>
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={2000}
                onClose={() => setSnackbarOpen(false)}
                message={message}
                anchorOrigin={{ vertical: "top", horizontal: "center" }}
                ContentProps={{
                    sx: { backgroundColor: "#FF5722", color: "white" },
                }}
            />
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
                        <SearchIcon sx={{ color: "#fff" }} />
                    </SearchIconWrapper>
                    <StyledInputBase
                        placeholder="Search by Ingredient"
                        inputProps={{ "aria-label": "search" }}
                        sx={{ color: "white" }}
                        onChange={searchByIngredient}
                    />
                </Search>

                <Box display="flex" gap={2} alignItems="center">
                    <FormControl variant="outlined" size="small" sx={{ minWidth: 120 }}>
                        <InputLabel>Filter By</InputLabel>
                        <Select value={selectedFilter} onChange={handleFilterChange} label="Filter By">
                            {ingredients.map((ingredient) => (
                                <MenuItem key={ingredient} value={ingredient}>
                                    {ingredient}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    {selectedFilter && selectedFilter !== "none" && (
                        <FormControl variant="outlined" size="small" sx={{ minWidth: 120 }}>
                            <InputLabel>{selectedFilter === "rating" ? "Select Rating" : "Select Time"}</InputLabel>
                            <Select value={selectedValue} onChange={handleValueChange} label="Select">
                                {(selectedFilter === "rating" ? ratingOptions : timeOptions).map((option) => (
                                    <MenuItem key={option} value={option}>
                                        {option}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    )}
                </Box>
            </Box>
        </>
    );
};

export default RecipeHeader;
