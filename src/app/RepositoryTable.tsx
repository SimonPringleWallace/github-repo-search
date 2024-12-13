import { PaginationItem, PaginationLink, Pagination, PaginationContent, PaginationPrevious, PaginationEllipsis, PaginationNext } from "@/components/ui/pagination";
import { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { dateFormatter } from "@/utils";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { ArrowUpDown } from "lucide-react";
import { useState, useEffect } from "react";
import { IPaginationData, ITableFilterValue, ISort, ITableSortKeys, IGitHubRepository } from "./interfaces";



interface ITablePaginationProps {
  paginationData: IPaginationData | null;
  onPaginate: (page: number) => void;
}

const TablePagination = ({
  paginationData,
  onPaginate,
}: ITablePaginationProps) => {
  const { currentPage, totalPages } = paginationData ?? {
    currentPage: 1,
    totalPages: 1,
  };

  const generatePaginationOptions = () => {
    // display either the first page or page before the current page
    const startPage = Math.max(1, currentPage - 1);
    // display either the last page or 2 pages beyond the current page
    const endPage = Math.min(totalPages, currentPage + 2);
    const items = [];

    for (let i = startPage; i <= endPage; i++) {
      // we never want to display more than 3 items
      if (items.length === 3) break;

      items.push(
        <PaginationItem onClick={() => onPaginate(i)} key={i}>
          <PaginationLink isActive={i === currentPage}>{i}</PaginationLink>
        </PaginationItem>
      );
    }
    return items;
  };

  if (totalPages === 1) return null;

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            data-testid="paginate-previous"
            onClick={() => onPaginate(currentPage - 1)}
          />
        </PaginationItem>
        {generatePaginationOptions()}
        {currentPage !== totalPages && (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        )}
        <PaginationItem>
          <PaginationNext
            data-testid="paginate-next"
            onClick={() => onPaginate(currentPage + 1)}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};


interface IRepositoryTableProps {
  repositories: IGitHubRepository[];
  paginationData: IPaginationData | null;
  filterValue: ITableFilterValue;
  onPaginate: (page: number) => void;
  onSort: (sort: ISort) => Promise<void>;
  onChangeFilter: (filter: ITableFilterValue) => void;
}

//gotta track teh current pagination
export const RepositoryTable = ({
  repositories,
  paginationData,
  filterValue,
  onChangeFilter,
  onPaginate,
  onSort,
}: IRepositoryTableProps) => {
 
  const [sortDirection, setSortDirection] = useState<ISort>({} as ISort);

  const onClickSort = (sortKey: ITableSortKeys) => {
    if (sortDirection.sortKey !== sortKey) {
      setSortDirection({ sortKey, order: "asc" });
    } else {
      setSortDirection((previousSort) => ({
        sortKey,
        order: previousSort.order === "asc" ? "desc" : "asc",
      }));
    }
  };

  useEffect(() => {
    const sortContents = async () => {
      await onSort(sortDirection);
    };
    sortContents();
  }, [sortDirection]);

  return (
    <div className="flex flex-col align-end">
      <Select
        value={filterValue}
        onValueChange={(value) => onChangeFilter(value as ITableFilterValue)}
      >
        <SelectTrigger className="w-[200px] my-4" id="repo-type">
          <SelectValue placeholder="Select Repository Type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All</SelectItem>
          <SelectItem value="owner">Owner</SelectItem>
          <SelectItem value="member">Member</SelectItem>
        </SelectContent>
      </Select>
      <Table className="w-[800px]">
        <TableHeader>
          <TableRow>
            <TableHead
              className="w-[100px] flex justify-between"
              onClick={() => onClickSort("full_name")}
            >
              Name
              {<ArrowUpDown />}
            </TableHead>
            <TableHead>Open Issues</TableHead>
            <TableHead>Forks</TableHead>
            <TableHead className="text-right">Stars</TableHead>
            <TableHead onClick={() => onClickSort("updated")}>
              Last Updated {<ArrowUpDown />}
            </TableHead>

            <TableHead onClick={() => onClickSort("created")}>
              Created At {<ArrowUpDown />}
            </TableHead>

            <TableHead onClick={() => onClickSort("pushed")}>
              Last Push {<ArrowUpDown />}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {repositories.map((repo) => (
            <TableRow key={repo.name}>
              <TableCell className="font-medium">
                <a key={repo.name} target="_blank" href={repo.html_url}>
                  {repo.name}
                </a>
              </TableCell>
              <TableCell>{repo.open_issues_count}</TableCell>
              <TableCell>{repo.forks_count}</TableCell>
              <TableCell>{repo.stargazers_count}</TableCell>
              <TableCell>{dateFormatter(repo.updated_at)}</TableCell>
              <TableCell>{dateFormatter(repo.created_at)}</TableCell>
              <TableCell>{dateFormatter(repo.pushed_at)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <TablePagination
        paginationData={paginationData}
        onPaginate={onPaginate}
      />
    </div>
  );
};

export default RepositoryTable;
