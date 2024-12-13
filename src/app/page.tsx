'use client'
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useDebouncedCallback } from "use-debounce";
import { useEffect, useState } from "react";
import { RepositoryTable, UserSearchResults } from "./components";
import { IPaginationData, ISort, ITableFilterValue } from "./interfaces";

const formSchema = z.object({
  name: z.string().nonempty({
    message: "User name is required",
  }),
});

export default function Home() {
  const [userResults, setUserResults] = useState([]);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [repositories, setRepositories] = useState([]);
  const [paginationLinks, setPaginationLinks] = useState<IPaginationData | null>(null);
  const [filterValue, setFilterValue] = useState<ITableFilterValue>("all");
  const [queryString, setQueryString] = useState<string>("");
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

// TODO: we actually aren't really using links here- should be removed
  function parseLinkHeader(header: string | null): IPaginationData {
    let totalPages = paginationLinks?.totalPages ?? 1;
    let currentPage = paginationLinks?.totalPages ?? 1;

    if (!header) return {} as IPaginationData;
    // this needs to be made easier to read - and there may not be a 'link' header
    const paginationLinksText = header.split(",").reduce((acc, part) => {
      const match = part.match(/<([^>]+)>;\s*rel="([^"]+)"/);
      if (match) {
        const [_, url, rel] = match;
        if(rel === "last") {
          const urlParams = new URLSearchParams(url);
          totalPages = parseInt(urlParams.get("page") ?? "1");
        }
        if (rel === "next") {
          const urlParams = new URLSearchParams(url);
          currentPage = parseInt(urlParams.get("page") ?? "1") - 1;
        }
        acc[rel] = url;
      }
      return acc;
    }, {} as IPaginationData["links"]);

    return { totalPages, links: paginationLinksText, currentPage };
  }

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    if (!data) return;
    setQueryString(`https://api.github.com/users/${data.name}/repos?per_page=10`);
  };

  const onSelectUser = (user: string) => {
    setSelectedUser(user);
    form.setValue("name", user);
    setUserResults([]);
  }

  const onPaginate = async (page: number) => {
    if(page < 1) return;
    if(page > paginationLinks!.totalPages) return;

    const searchParams = new URLSearchParams(queryString.split("?")[1]);
    searchParams.set("page", page.toString());
    setQueryString(`${queryString.split("?")[0]}?${searchParams.toString()}`);
  };

  const searchForUsers = useDebouncedCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      console.log(e.target.value);
      const res = await fetch(`https://api.github.com/search/users?q=${e.target.value}`, {
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_GITHUB_API_KEY}`,
        },
      })
      const resJson = await res.json();
      setUserResults(resJson.items);
  }, 500)

  const onSort = async (sort: ISort) => {
    if (!selectedUser || !sort) return;
    const { sortKey, order} = sort;

    const searchParams = new URLSearchParams(queryString.split("?")[1]);
    searchParams.set("sort", sortKey);
    searchParams.set("direction", order);
    setQueryString(`${queryString.split("?")[0]}?${searchParams.toString()}`);
  }

  useEffect(() => {
    if (!queryString) return;
    const fetchRepositories = async () => {
      const res = await fetch(
        queryString,
        {
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_GITHUB_API_KEY}`,
          },
        }
      );
      const resJson = await res.json();
      // for pagination
      const linkHeader = res.headers.get("Link");
      const paginationData = parseLinkHeader(linkHeader);
      setPaginationLinks(paginationData);
      setRepositories(resJson);
    };
    fetchRepositories();
  }, [queryString])

  //TODO: we likely don't need all these seperate functions for different sorts and such
  useEffect(() => {
    const searchParams = new URLSearchParams(queryString.split("?")[1]);
    searchParams.set("type", filterValue);
    setQueryString(`${queryString.split("?")[0]}?${searchParams.toString()}`);
  }, [filterValue]);

  return (
    <div className="mt-20">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            name="name"
            control={form.control}
            render={({ field: { onChange, ...field } }) => {
              const { value, ...rest } = field;
              return (
                <FormItem>
                  <FormLabel>User name</FormLabel>
                  <FormControl>
                    <Input
                      value={selectedUser || value}
                      onChange={(e) => {
                        setSelectedUser(null);
                        searchForUsers(e);
                        onChange(e.target.value);
                      }}
                      className="w-60 relative"
                      placeholder="GitHub Username"
                      {...rest}
                    />
                  </FormControl>
                  {userResults?.length > 0 && (
                    <UserSearchResults
                      setUser={onSelectUser}
                      users={userResults}
                    />
                  )}
                  <FormMessage />
                </FormItem>
              );
            }}
          />
          <Button type="submit">Fetch</Button>
        </form>
      </Form>
      {repositories.length > 0 && (
        <RepositoryTable
          onPaginate={onPaginate}
          paginations={paginationLinks}
          repositories={repositories}
          onSort={onSort}
          filterValue={filterValue}
          onChangeFilter={setFilterValue}
        />
      )}
    </div>
  );
}
