import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import { Provider } from "react-redux"
import RateComment from "../../views/pages/receipe/RateComment"
import recipeService from "../../infrastructure/services/api/recipe/RecipeInstance"
import { MemoryRouter } from "react-router-dom"
import { mockStore} from "../mocks/MockRecipeData"

jest.mock("../../infrastructure/services/api/recipe/RecipeInstance", () => ({
    feedback: jest.fn(),
}))

describe("RateComment - Authorized User", () => {
    const renderWithStore = (type: "rate" | "comment" | "delete") => {
        const store = mockStore({
            auth: { token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyaW5mbyI6eyJ1c2VySWQiOiI2OGQyNzU4NzU5NmI0MTc5ODg4MzhiZWYifSwiaWF0IjoxNzU4NzA3MDM2LCJleHAiOjE3NTg3MDcwNDJ9.7XzMAPtI4BfnprUHZDqQ_RoAQvzj8YF41XqG11lGjE0", userId: "68d27587596b417988838bef" },
            recipe: { recipeId: "67d2822161410b166dd89e78" },
        })
        return render(
            <Provider store={store}>
            <MemoryRouter>
                <RateComment open={true} onClose={jest.fn()} type={type} />
            </MemoryRouter>
            </Provider>
        )
    }

    it("submits a valid rating payload", async () => {
    ;(recipeService.feedback as jest.Mock).mockResolvedValue({
        success: { message: "Rating submitted successfully" },
    })

    renderWithStore('rate')

    // select rating = 4
    const stars = screen.getAllByRole("radio") // MUI Rating renders stars as radios
    fireEvent.click(stars[3]) // 0-based index, 3 => rating=4

    // click Submit
    const submitButton = screen.getByRole("button", { name: /submit/i })
    fireEvent.click(submitButton)

    await waitFor(() => {
        expect(recipeService.feedback).toHaveBeenCalledWith("rate", {
        userId: "68d27587596b417988838bef",
        recipeId: "67d2822161410b166dd89e78",
        rate: 4,
        })
    })

    // check success alert
    expect(await screen.findByText(/Rating submitted successfully/i)).toBeInTheDocument()
    })

    it("shows error when user already rated the recipe", async () => {
    (recipeService.feedback as jest.Mock).mockResolvedValue({
    error: { message: "User has already rated this recipe." },
    })

    renderWithStore('rate')

    // select rating = 4 again
    const stars = screen.getAllByRole("radio")
    fireEvent.click(stars[3]) // index 3 => 4 stars

    // click Submit
    const submitButton = screen.getByRole("button", { name: /submit/i })
    fireEvent.click(submitButton)

    // Wait for the error alert
    const alert = await screen.findByText(/User has already rated this recipe./i)
    expect(alert).toBeInTheDocument()
    })

    it("submits a valid comment payload", async () => {

    (recipeService.feedback as jest.Mock).mockResolvedValue({
        success: { message: "Comment submitted successfully" },
    })

    renderWithStore('comment')

    // Type a comment
    const commentInput = screen.getByRole("textbox")
    // const commentInput = screen.getByRole("textbox", { name: /your comment/i })
    fireEvent.change(commentInput, { target: { value: "This recipe is awesome!" } })

    // click Submit
    const submitButton = screen.getByRole("button", { name: /submit/i })
    fireEvent.click(submitButton)

    await waitFor(() => {
        expect(recipeService.feedback).toHaveBeenCalledWith("comment", {
        userId: "68d27587596b417988838bef",
        recipeId: "67d2822161410b166dd89e78",
        comment: "This recipe is awesome!",
        })
    })

    // check success alert
    expect(await screen.findByText(/Comment submitted successfully/i)).toBeInTheDocument()
    })

})
