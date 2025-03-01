import { Box, Typography, Select, MenuItem, FormControl, InputLabel } from "@mui/material";
import { useState } from "react";
import config from "../../components/app/api/config/config";
import {  useSelector } from "react-redux";
import { selectCurrentToken } from "../../components/app/redux/AuthSlice";
import RecipeCard from "./RecipeCard";

const ingredients = ["Rating", "PreparationTime"];
const ratingOptions = [1, 2, 3, 4, 5];
const timeOptions = ["0-10 min", "10-20 min", "20-30 min", "30-45 min", "45-60 min", "1-2 hours"];

const RecipeHeader = () => {
    const [selectedFilter, setSelectedFilter] = useState("");
    const [selectedValue, setSelectedValue] = useState("");
    const token = useSelector(selectCurrentToken)
    const [recipes, setRecipes] = useState<Recipe>([]);

  const handleFilterChange = (event) => {
    const newKey = (event.target.value).toLowerCase();
    setSelectedFilter(newKey);
    setSelectedValue(""); // Reset value when filter changes
  };

  const handleValueChange = async (event) => {
    const newValue = event.target.value; // Store the selected value immediately
    setSelectedValue(newValue); // Update the state asynchronously
  
    console.log(selectedFilter, newValue, "19"); // Use newValue instead of selectedValue
  
    try {
        const feedback = await fetch(`${config.apiUrl}/recipe/filter?${selectedFilter}=${newValue}`, {
            method: "GET",
            credentials: "include",
            headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            },
        });
        let response = await feedback.json();
        if(feedback.status === 200){
            setRecipes(response?.recipes)
       }
        else{
            alert('No recipe Found !')
        }
    } catch (e) {
      console.log(e);
    }
  };
    
  console.log(recipes);
  return (
    <>
    {recipes.length > 0 ? (
        recipes.map((recipe) => <RecipeCard key={recipe?._id} recipe={recipe} />)
    ):
    (   
    <Box 
      display="flex" 
      justifyContent="space-between" 
      alignItems="center" 
      p={2} 
      bgcolor="#f5f5f5" 
      borderRadius={2} 
      boxShadow={2}
    >
      {/* Heading */}
      <Typography variant="h5" fontWeight="bold">List of Recipes</Typography>

      {/* Filter Dropdown */}
      <FormControl variant="outlined" size="small" sx={{ minWidth: 150 }}>
        <InputLabel>Filter By</InputLabel>
        <Select value={selectedFilter} onChange={handleFilterChange} label="Filter By">
          {ingredients.map((ingredient) => (
            <MenuItem key={ingredient} value={ingredient}>
              {ingredient}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Dynamic Dropdown */}
      {selectedFilter && (
        <FormControl variant="outlined" size="small" sx={{ minWidth: 150 }}>
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

      {/* Display selected values */}
      {selectedFilter && selectedValue && (
        <Typography variant="body1">
          Selected: {selectedFilter} - {selectedValue}
        </Typography>
      )}
    </Box>
    )}
    </>
  )}

export default RecipeHeader;
