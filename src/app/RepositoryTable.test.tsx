import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import RepositoryTable from "./RepositoryTable";
import "@testing-library/jest-dom"
import { IGitHubRepository } from "./interfaces";

describe("Repository Table component", () => {
  const onPaginate = jest.fn();
  const onSort = jest.fn();
  const setFilterValue = jest.fn();
  const repositories = [
    {
      name: "Repo1",
      updated_at: "2021-01-01",
      created_at: "2021-01-01",
      pushed_at: "2021-01-01",
      open_issues_count: 0,
      forks_count: 0,
      stargazers_count: 0,
      html_url: "https://github.com",
    },
  ] as IGitHubRepository[];
  const filterValue = "all";

  it("renders Repo Table", () => {
      const paginationData = { currentPage: 1, totalPages: 5 };
    render(
      <RepositoryTable
        onPaginate={onPaginate}
        paginationData={paginationData}
        repositories={repositories}
        onSort={onSort}
        filterValue={filterValue}
        onChangeFilter={setFilterValue}
      />
    );
    expect(screen.getByText("Repo1")).toBeInTheDocument();
  });

    it("renders Pagination when total pages is > 1", () => {
        const paginationData = { currentPage: 1, totalPages: 5 };
      render(
        <RepositoryTable
          onPaginate={onPaginate}
          paginationData={paginationData}
          repositories={repositories}
          onSort={onSort}
          filterValue={filterValue}
          onChangeFilter={setFilterValue}
        />
      );
      expect(screen.getByTestId("paginate-previous")).toBeInTheDocument();
    });
    it("does not render Pagination when total pages is equal to 1", () => {
        const paginationData = { currentPage: 1, totalPages: 1 };
      render(
        <RepositoryTable
          onPaginate={onPaginate}
          paginationData={paginationData}
          repositories={repositories}
          onSort={onSort}
          filterValue={filterValue}
          onChangeFilter={setFilterValue}
        />
      );
      expect(screen.queryByTestId("paginate-next")).not.toBeInTheDocument();
    });
});



// enter user name and click fetch button should call fetch with correct query
// changing value of filter shoud call fetch with correct query
// clicking on pagination item should call fetch with correct query
// clicking on sort should call fetch with correct query