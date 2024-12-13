'use client';

import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { IPaginationData, ISort, ISortKeys } from "./interfaces";
import { ArrowUpDown } from 'lucide-react';
import { useEffect, useState } from "react";
import { dateFormatter } from "@/utils";

interface IUser {
  login: string;
  avatar_url: string;
}

interface IUserSearchResult {
  users: IUser[];
  setUser: (user: string) => void;
}

export const UserSearchResults = ({ users, setUser }: IUserSearchResult) => {
  return (
    <div className="h-96 w-64 overflow-x-auto absolute z-30 bg-slate-50">
      {users.map((user) => (
        <div
          className="flex justify-start items-center cursor-pointer my-4"
          key={user.login}
          onClick={() => setUser(user.login)}
        >
          <img
            className="rounded-full h-10 w-10 mr-4"
            src={user.avatar_url}
            alt={user.login}
          />
          <p>{user.login}</p>
        </div>
      ))}
    </div>
  );
};

// sort - stars, forks, help-wanted-issues, updated
interface IGitHubRepository {
  name: string;
  updated_at: string;
	created_at: string;
	pushed_at: string;
  stargazers_count: number;
  open_issues_count: number;
  forks_count: number;
  archived: boolean;
  html_url: string;
  owner: {
    login: string;
    avatar_url: string;
  };
}

interface IRepositoryTableProps {
  repositories: IGitHubRepository[];
  paginations: IPaginationData | null;
  onPaginate: (page: number) => void;
  onSort: (sort: ISort) => Promise<void>;
}

//gotta track teh current pagination
export const RepositoryTable = ({ repositories, paginations, onPaginate, onSort }: IRepositoryTableProps) => {
	const { currentPage, totalPages } = paginations ?? { currentPage: 1, totalPages: 1 };
	const [sortDirection, setSortDirection] = useState<ISort>({} as ISort);

	const generatePaginationItems = () => {
    // display either the first page or page before the current page
    const startPage = Math.max(1, currentPage - 1);
    // display either the last page or 2 pages beyond the current page
    const endPage = Math.min(
      totalPages,
      currentPage + 2
    );
    const items = [];
    if (!paginations) return null;
    for (let i = startPage; i <= endPage; i++) {
			// we never want to display more than 3 items
			if(items.length === 3) break;

      items.push(
        <PaginationItem onClick={() => onPaginate(i)} key={i}>
          <PaginationLink isActive={i === currentPage}>
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }
    return items;
  }

	const onClickSort = (sortKey: ISortKeys) => {
    if(sortDirection.sortKey !== sortKey) {
			setSortDirection({sortKey, order: "asc"});
		} else {
			setSortDirection(previousSort => ({
				sortKey,
				order: previousSort.order === "asc" ? "desc" : "asc"
			}));
		}
	};

	useEffect(() => {
		const sortContents = async () => {
			await onSort(sortDirection);
		}
		sortContents();
	}, [sortDirection]);
// created updated pushed full_name
	return (
    <Table>
      <TableCaption>Repositories</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead
            className="w-[100px]"
            onClick={() => onClickSort("full_name")}
          >
            Name
            {<ArrowUpDown />}
          </TableHead>
          <TableHead>Open Issues</TableHead>
          <TableHead>Forks</TableHead>
          <TableHead className="text-right">Stars</TableHead>
          <TableHead
            className="text-right"
            onClick={() => onClickSort("updated")}
          >
            Last Updated {<ArrowUpDown />}
          </TableHead>
          <TableHead
            className="text-right"
            onClick={() => onClickSort("created")}
          >
            Created At {<ArrowUpDown />}
          </TableHead>
          <TableHead
            className="text-right"
            onClick={() => onClickSort("pushed")}
          >
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
      <TableFooter>
        {totalPages > 1 && (
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => onPaginate(currentPage - 1)}
                  href="#"
                />
              </PaginationItem>
              {generatePaginationItems()}
              {currentPage !== totalPages && (
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
              )}
              <PaginationItem>
                <PaginationNext
                  onClick={() => onPaginate(currentPage + 1)}
                  href="#"
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </TableFooter>
    </Table>
  );
};



// pagination, sorting and filtering

// sort - stars, forks, help-wanted-issues, updated
// pagination
	// per_page 30