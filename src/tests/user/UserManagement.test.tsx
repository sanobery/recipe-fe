import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import { Provider } from 'react-redux'
import NavbarNew from '../../views/Navbar'
import userService from '../../infrastructure/services/api/user/UserInstance'
import { mockStore } from '../mocks/MockRecipeData'

jest.mock('../../infrastructure/services/api/user/UserInstance', () => ({
    login: jest.fn(),
    logout: jest.fn(),
}))

describe('NavbarNew Component', () => {
    it('renders Login and Sign Up icons when user is not authenticated', () => {
        const store = mockStore({ auth: { token: null } })
        render(
            <Provider store={store}>
                <NavbarNew />
            </Provider>
        )

        const loginIcon = screen.getByLabelText(/login/i)
        expect(loginIcon).toBeInTheDocument()

        const signUpIcon = screen.getByLabelText(/signup/i)
        expect(signUpIcon).toBeInTheDocument()
    })

    it('allows user to login and updates authentication state', async () => {
        const store = mockStore({ auth: { token: null } })

        ;(userService.login as jest.Mock).mockResolvedValue({
            success: { token: 'fake-jwt-token', message: 'Login successful' },
        })

        await act(async () => {
            render(
                <Provider store={store}>
                    <NavbarNew />
                </Provider>
            )
        })

        // Open login modal
        const loginIcon = screen.getByRole('button', { name: /login/i })
        await act(async () => {
            fireEvent.click(loginIcon)
        })

        // Fill in form
        const emailInput = screen.getByLabelText(/Email/i)
        const passwordInput = screen.getByLabelText(/Password/i)

        await act(async () => {
            fireEvent.change(emailInput, {
                target: { value: 'demo1@gmail.com' },
            })
            fireEvent.change(passwordInput, { target: { value: 'Demo@123' } })
        })

        // Click submit
        const submitButton = screen.getByRole('button', { name: /login/i })
        await act(async () => {
            fireEvent.click(submitButton)
        })

        // Wait for Redux actions
        await waitFor(() => {
            const actions = store.getActions()
            expect(actions).toContainEqual(expect.objectContaining({ type: 'auth/setCredentials' }))
        })
    })

    it('render menu list when user is authenticated', () => {
        const store = mockStore({ auth: { token: 'fake-jwt-token' } })
        render(
            <Provider store={store}>
                <NavbarNew />
            </Provider>
        )

        // Menu button should appear instead of Login/Signup
        const menuList = screen.getByLabelText(/menuList/i)
        expect(menuList).toBeInTheDocument()
    })
})
