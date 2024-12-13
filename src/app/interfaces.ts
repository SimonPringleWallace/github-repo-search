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

export type ISortKeys = "created" | "updated" | "pushed" | "full_name";

export interface ISort {
	sortKey: ISortKeys;
	order: "asc" | "desc";
}
