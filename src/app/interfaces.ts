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