import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import SearchFilterRecipe from "../views/pages/receipe/SearchFilterRecipe";

const mockStore = configureStore([]);
const store = mockStore({});

jest.mock('../infrastructure/services/api/config', () => ({
  getApiUrl: jest.fn(() => 'http://localhost:3500')
}));

describe("SearchFilterRecipe Component", () => {
  it("renders search input and filter dropdown", () => {
    render(
      <Provider store={store}>
        <SearchFilterRecipe />
      </Provider>
    );

    // Check if search input is present
    const searchInput = screen.getByPlaceholderText(/search by Ingr/i);
    expect(searchInput).toBeInTheDocument();

    // Check if filter select is present
    const filterLabels = screen.getAllByText(/Filter By/i);
    expect(filterLabels[0]).toBeInTheDocument();

  });
});
