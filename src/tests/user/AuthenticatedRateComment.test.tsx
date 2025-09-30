import { render, screen, fireEvent } from '@testing-library/react'
import { Provider } from 'react-redux'
import { MemoryRouter } from 'react-router-dom'
import RecipeReviewCard from '../../views/pages/receipe/RecipeReviewCard'
import { mockStore } from '../mocks/MockRecipeData'
import { Recipe } from '../../types/RecipeAuthInterface'

jest.mock('../../infrastructure/services/api/recipe/RecipeInstance', () => ({
    feedback: jest.fn(),
}))

const mockRecipe: Recipe = {
    _id: '1',
    title: 'Test Recipe',
    image: 'chicken-tikka.jpeg',
    preparationTime: 30,
    averageRating: 4,
    ingredients: ['sugar', 'milk'],
    steps: ['Boil milk', 'Add sugar'],
    userId: { _id: 'user1', username: 'sanober' },
}

describe('RecipeReviewCard - Unauthorized User', () => {
    const renderWithStore = () => {
        const store = mockStore({
            auth: { token: null },
            recipe: { recipeId: null },
        })

        render(
            <Provider store={store}>
                <MemoryRouter>
                    <RecipeReviewCard {...mockRecipe} />
                </MemoryRouter>
            </Provider>
        )
    }

    /**
     * Common helper to test unauthorized clicks
     * @param type "direct" for icon clicks, "popup" for MoreVert menu clicks
     * @param label label for icon OR text for popup option
     * @param parent optional parent element for popup options
     */
    const testUnauthorizedClick = async (type: 'direct' | 'popup', label: RegExp | string) => {
        renderWithStore()

        if (type === 'direct') {
            const button = screen.getByLabelText(label as RegExp)
            fireEvent.click(button)
        } else if (type === 'popup') {
            const moreVertButton = screen.getByLabelText(/settings/i)
            fireEvent.click(moreVertButton)
            const button = screen.getByLabelText(label as RegExp)
            fireEvent.click(button)
        }

        const snackbar = await screen.findByRole('alert')
        expect(snackbar).toHaveTextContent(/Please login first/i)
    }

    it('shows snackbar when clicking Rate without token', async () => {
        await testUnauthorizedClick('direct', /rate/i)
    })

    it('shows snackbar when clicking Comment without token', async () => {
        await testUnauthorizedClick('direct', /comment/i)
    })

    it('shows snackbar when clicking Rate from MoreVertIcon without token', async () => {
        await testUnauthorizedClick('popup', /rate/i)
    })

    it('shows snackbar when clicking Rate from MoreVertIcon without token', async () => {
        await testUnauthorizedClick('popup', /comment/i)
    })
})
