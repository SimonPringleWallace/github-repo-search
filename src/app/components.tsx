import { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";

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

interface IGitHubRepository {
	name: string;
	updated_at: string;
	stargazers_count: number;
	open_issues_count: number;
	forks_count: number;
	archived: boolean;
	html_url: string;
	owner: {
		login: string;
		avatar_url: string;
	}
}

export const RepositoryTable = ({ repositories }: { repositories: IGitHubRepository[] }) => {
	return (
    <Table>
      <TableCaption>Repositories</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Name</TableHead>
          <TableHead>Open Issues</TableHead>
          <TableHead>Forks</TableHead>
          <TableHead className="text-right">Stars</TableHead>
          <TableHead className="text-right">Last Updated</TableHead>
          <TableHead className="text-right">Url</TableHead>
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
            <TableCell>{repo.updated_at}</TableCell>
            </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

// pagination, sorting and filtering

// sort - stars, forks, help-wanted-issues, updated
// pagination
	// per_page 30