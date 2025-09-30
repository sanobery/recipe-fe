import { render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import { MemoryRouter } from 'react-router-dom'
import RecipeDetailPage from '../../views/pages/receipe/RecipeDetailPage'
import { Recipe } from '../../types/RecipeAuthInterface'
import { mockStore, mockRecipe } from '../mocks/MockRecipeData'

type ExtendedRecipe = Recipe & {
    ratings?: {
        _id: string
        rate: number
        userId?: { _id: string; username: string }
        createdAt?: string
    }[]
    comments?: {
        _id: string
        comment: string
        userId?: { _id: string; username: string }
    }[]
}

const extendedRecipe: ExtendedRecipe = {
    ...mockRecipe[0],
    ratings: [
        {
            _id: 'r1',
            rate: 4,
            userId: { _id: 'u1', username: 'rater1' },
            createdAt: '2023-01-01T12:00:00Z',
        },
    ],
    comments: [
        {
            _id: 'c1',
            comment: 'Great recipe!',
            userId: { _id: 'u2', username: 'commenter1' },
        },
    ],
}

describe('RecipeDetailPage', () => {
    const renderWithStore = (recipeData: Recipe | null) => {
        const store = mockStore({
            recipe: {
                selectedRecipe: recipeData,
            },
        })

        render(
            <Provider store={store}>
                <MemoryRouter>
                    <RecipeDetailPage />
                </MemoryRouter>
            </Provider>
        )
    }

    it('renders full recipe details when recipe is available', () => {
        renderWithStore(extendedRecipe)

        expect(screen.getByText(/Created By - testuser/i)).toBeInTheDocument()
        expect(screen.getByText(/Title of Recipe - Test Recipe/i)).toBeInTheDocument()
        expect(screen.getByText(/Preparation Time - 30 minutes/i)).toBeInTheDocument()
        expect(screen.getByText(/Ingredients:/i)).toBeInTheDocument()
        expect(screen.getByText(/Instructions:/i)).toBeInTheDocument()
        expect(screen.getByText(/Ratings:/i)).toBeInTheDocument()
        expect(screen.getByText(/Comments:/i)).toBeInTheDocument()
        expect(screen.getByText(/Great recipe!/i)).toBeInTheDocument()
    })

    it('shows loading message when recipe is not available', () => {
        renderWithStore(null)

        expect(screen.getByText(/Loading.../i)).toBeInTheDocument()
    })
})
