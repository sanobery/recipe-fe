import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import { Provider } from "react-redux"
import SearchFilterRecipe from "../../views/pages/receipe/SearchFilterRecipe"
import recipeService from "../../infrastructure/services/api/recipe/RecipeInstance"
import { mockStore } from "../mocks/MockRecipeData"

jest.mock("../../infrastructure/services/api/recipe/RecipeInstance", () => ({
    search: jest.fn(),
    filter: jest.fn(),
}))


describe("SearchFilterRecipe", () => {

    const store = mockStore({})
    store.dispatch = jest.fn()

    it("searches by ingredient and dispatches results", async () => {
        (recipeService.search as jest.Mock).mockResolvedValue({
            success: { recipes: [{ title: "Mock Recipe" }] },
        })

        render(
            <Provider store={store}>
            <SearchFilterRecipe />
            </Provider>
        )

        const input = screen.getByPlaceholderText(/search by ingredient/i)
        fireEvent.change(input, { target: { value: "sugar" } })

        await waitFor(() => {
            expect(recipeService.search).toHaveBeenCalledWith({ ingredient: "sugar" })
            expect(store.dispatch).toHaveBeenCalledWith(
            expect.objectContaining({
                type: "recipe/setSearchRecipeByIngredient",
                payload: [{ title: "Mock Recipe" }],
            })
            )
        })
    })

    it("filters by rating", async () => {
        (recipeService.filter as jest.Mock).mockResolvedValue({
            success: { recipes: [{ title: "Filtered by Rating" }] },
        })

        render(
            <Provider store={store}>
                <SearchFilterRecipe />
            </Provider>
        )

        // Open first dropdown
        const filterDropdown = screen.getByLabelText("Filter By")
        fireEvent.mouseDown(filterDropdown)

        // Wait and click "Rating" option
        const ratingOption = await screen.findByRole("option", { name: "Rating" })
        fireEvent.click(ratingOption)

        // Open second dropdown
        const ratingDropdown = screen.getByLabelText("Select Rating")
        fireEvent.mouseDown(ratingDropdown)

        // Click rating value "4"
        const ratingValue = await screen.findByRole("option", { name: "4" })
        fireEvent.click(ratingValue)

        // Assert
        await waitFor(() => {
        expect(recipeService.filter).toHaveBeenCalledWith({ rating: 4 })
        expect(store.dispatch).toHaveBeenCalledWith(
            expect.objectContaining({
            type: "recipe/setSearchRecipeByIngredient",
            payload: [{ title: "Filtered by Rating" }],
            })
        )
        })


    })

    it("shows snackbar on search error", async () => {
        (recipeService.search as jest.Mock).mockResolvedValue({
            error: { message: "Ingredient not found" },
        })

        render(
            <Provider store={store}>
            <SearchFilterRecipe />
            </Provider>
        )

        const input = screen.getByPlaceholderText(/search by ingredient/i)
        fireEvent.change(input, { target: { value: "unknown" } })

        await waitFor(() => {
            expect(screen.getByText(/ingredient not found/i)).toBeInTheDocument()
        })
    })
})

