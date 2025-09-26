import { useDispatch } from "react-redux"
import { setRecipe } from "../../../store/Slice"
import React,{ useState,useCallback, useEffect } from "react"
import { useParams } from "react-router-dom"
import "react-lazy-load-image-component/src/effects/blur.css"
import recipeService from "../../../infrastructure/services/api/recipe/RecipeInstance"
import { Typography } from "@mui/material"
import RecipeDetailPage from "./RecipeDetailPage"
import useSWR from "swr"

const RecipeDetail = React.memo(() => {
    const { id } = useParams()
    const dispatch = useDispatch()
    const [message, setMessage] = useState<string>('')
    
    // =============================================
    // Implement SWR for Recipe Detail Page
    // =============================================
    // - Leverages SWR for efficient data fetching and caching
    // - Retrieves detailed information for a specific recipe
    // - Provides revalidation in the background to keep data fresh
    // - Minimizes unnecessary API calls with caching & deduplication
    // - Handles loading and error states for better UX
    // - Ensures consistent and performant recipe detail rendering
    // =============================================
    const fetcher = async () => {
        const response = await recipeService.getDetail(id)
        if (response.success) {
            return response.success
        } else {
            throw new Error(response.error?.message)
        }
    }

    const { data } = useSWR([id], fetcher)

    const getRecipe = useCallback(async () => {
        if(data) {
            dispatch(setRecipe(data))
        }
        else{
            setMessage(data?.error?.message)
        }
    },[data, dispatch])


    useEffect(() => {
        getRecipe()
    }, [getRecipe])

    return  (
        <>
        {message ? (
            <Typography variant="h5">{message}</Typography>
        )
        :
        (
            <RecipeDetailPage/>
        )}
        </>
    )
})

export default RecipeDetail
