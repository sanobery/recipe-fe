import { render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import { MemoryRouter } from 'react-router-dom'
import ViewRecipe from '../../views/pages/receipe/ViewRecipe'
import { mockRecipe } from '../mocks/MockRecipeData'
import configureStore from 'redux-mock-store'
import { Recipe } from '../../types/RecipeAuthInterface'

interface RecipeState {
    recipes: Recipe[]
    searchRecipeByIngredient: Recipe[]
}

interface RootStateMock {
    recipe: RecipeState
    auth: {
        token: string | null
    }
}

const mockStore = configureStore<Partial<RootStateMock>>() // Use Partial to avoid full typing

describe('ViewRecipe Component', () => {
    const renderWithStore = (storeData: Partial<RootStateMock>) => {
        const store = mockStore(storeData)

        render(
            <Provider store={store}>
                <MemoryRouter>
                    <ViewRecipe />
                </MemoryRouter>
            </Provider>
        )
    }

    it('renders RecipeReviewCard when recipes are available', () => {
        renderWithStore({
            recipe: {
                recipes: mockRecipe,
                searchRecipeByIngredient: [],
            },
            auth: { token: null },
        })

        expect(screen.getByText(/Test Recipe/i)).toBeInTheDocument()
        expect(screen.queryByText(/No recipes found/i)).not.toBeInTheDocument()
    })

    it('renders searched recipes when searchRecipeByIngredient is not empty', () => {
        renderWithStore({
            recipe: {
                recipes: [],
                searchRecipeByIngredient: mockRecipe,
            },
            auth: { token: null },
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
            auth: { token: null },
        })

        expect(screen.getByText(/No recipes found/i)).toBeInTheDocument()
    })
})
