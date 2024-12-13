export interface IPaginationData {
	currentPage: number;
	totalPages: number;
}

export interface ISort {
	sortKey: ITableSortKeys;
	order: "asc" | "desc";
}

export interface IGitHubRepository {
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


export type ITableSortKeys = "created" | "updated" | "pushed" | "full_name";
export type ITableFilterValue = "all" | "owner" | "member";