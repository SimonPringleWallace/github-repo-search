export interface IPaginationData {
	links: {
		next?: string;
		last?: string;
		prev?: string;
		first?: string;
	};
	currentPage: number;
	totalPages: number;
}

export type ITableSortKeys = "created" | "updated" | "pushed" | "full_name";
export type ITableFilterValue = "all" | "owner" | "member";

export interface ISort {
	sortKey: ITableSortKeys;
	order: "asc" | "desc";
}
