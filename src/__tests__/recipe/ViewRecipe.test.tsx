import { render, screen } from "@testing-library/react"
import { Provider } from "react-redux"
import { MemoryRouter } from "react-router-dom"
import ViewRecipe from "../../views/pages/receipe/ViewRecipe"
import { mockRecipe,mockStore } from "../mocks/MockRecipeData"

describe("ViewRecipe Component", () => {
    const renderWithStore = (storeData: any) => {
    const store = mockStore(storeData)

    render(
        <Provider store={store}>
        <MemoryRouter>
            <ViewRecipe />
        </MemoryRouter>
        </Provider>
    )
    }

    it("renders RecipeReviewCard when recipes are available", () => {
    renderWithStore({
        recipe: {
        recipes: mockRecipe,
        searchRecipeByIngredient: [],
        },
    })

    expect(screen.getByText(/Test Recipe/i)).toBeInTheDocument()
    expect(screen.queryByText(/No recipes found/i)).not.toBeInTheDocument()
    })

    it("renders searched recipes when searchRecipeByIngredient is not empty", () => {
    renderWithStore({
        recipe: {
        recipes: [],
        searchRecipeByIngredient: mockRecipe,
        },
    })

    expect(screen.getByText(/Test Recipe/i)).toBeInTheDocument()
    expect(screen.queryByText(/No recipes found/i)).not.toBeInTheDocument()
    })

    it("shows 'No recipes found' when both recipe lists are empty", () => {
    renderWithStore({
        recipe: {
        recipes: [],
        searchRecipeByIngredient: [],
        },
    })

    expect(screen.getByText(/No recipes found/i)).toBeInTheDocument()
    })
})
