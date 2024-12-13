import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Home from "./page";
import "@testing-library/jest-dom"
import { z } from "zod";
import fetchMock from "jest-fetch-mock";

fetchMock.enableMocks();


jest.mock("./RepositoryTable", () => ({
  RepositoryTable: ({ repositories }: any) => (
    <div data-testid="repository-table">
      {repositories.length > 0 && <span>Repositories Found</span>}
    </div>
  ),
  UserSearchResults: ({ users, setUser }: any) => (
    <div data-testid="user-search-results">
      {users.map((user: any, index: number) => (
        <button key={index} onClick={() => setUser(user)}>
          {user}
        </button>
      ))}
    </div>
  ),
}));

describe("Home component", () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });

  it("renders the form and submit button", () => {
    render(<Home />);
    expect(screen.getByLabelText(/user name/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /fetch/i })).toBeInTheDocument();
  });

  it("searches for users when input changes", async () => {
    fetchMock.mockResponseOnce(JSON.stringify({ items: ["user1", "user2"] }));

    render(<Home />);

    const input = screen.getByPlaceholderText(/github username/i);
    fireEvent.change(input, { target: { value: "test" } });

    await waitFor(() => {
      expect(screen.getByTestId("user-search-results")).toBeInTheDocument();
    });
    expect(screen.getByText("user1")).toBeInTheDocument();
    expect(screen.getByText("user2")).toBeInTheDocument();
  });

  it("fetches repositories with the correct initial query", async () => {
    fetchMock.mockResponseOnce(JSON.stringify([]));

    render(<Home />);

    const input = screen.getByPlaceholderText(/github username/i);
    fireEvent.change(input, { target: { value: "testuser" } });

    const button = screen.getByRole("button", { name: /fetch/i });
    fireEvent.click(button);

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith(
        "https://api.github.com/users/testuser/repos?per_page=10",
        expect.any(Object)
      );
    });
  });
});
