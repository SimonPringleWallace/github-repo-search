// converts date string such as '2016-01-27T19:50:46Z' to Jan 1, 2016 format
export const dateFormatter = (dateString: string): string => {
	const date = new Date(dateString);
	return new Intl.DateTimeFormat("en-US", {
		year: "numeric",
		month: "short",
		day: "2-digit",
	}).format(date);
}