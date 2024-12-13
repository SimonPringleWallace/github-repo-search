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

export type ISortKeys = "stars" | "forks" | "help-wanted-issues" | "updated";

export interface ISort {
	sortKey: ISortKeys;
	order: "asc" | "desc";
}
