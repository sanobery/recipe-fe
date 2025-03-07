import { useDispatch } from "react-redux"
import { setRecipe } from "../../../components/redux/Slice"
import React,{ useState,useCallback, useEffect } from "react"
import { useParams } from "react-router-dom"
import "react-lazy-load-image-component/src/effects/blur.css"
import recipeService from "../../../infrastructure/services/api/recipe/RecipeInstance"
import { Typography } from "@mui/material"
import RecipeDetailPage from "./RecipeDetailPage"

const RecipeDetail = React.memo(() => {
    const { id } = useParams()
    const dispatch = useDispatch()
    const [message, setMessage] = useState<string>('')
    

    const getRecipe = useCallback(async () => {
        const response = await recipeService.getDetail(id)
        if(response.success) {
            dispatch(setRecipe(response?.success))
        }
        else{
            setMessage(response?.error?.message)
        }
    },[id])


    useEffect(() => {
        getRecipe()
    }, [])

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
