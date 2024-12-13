'use client'
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useDebouncedCallback } from "use-debounce";
import { useEffect, useRef, useState } from "react";
import { UserSearchResults } from "./components";
import RepositoryTable from './RepositoryTable';
import { IPaginationData, ISort, ITableFilterValue } from "./interfaces";
import {Github} from 'lucide-react';

const formSchema = z.object({
  name: z.string().nonempty({
    message: "User name is required",
  }),
});

export default function Home() {
  const [userResults, setUserResults] = useState([]);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [repositories, setRepositories] = useState([]);
  const [paginationData, setPaginationData] = useState<IPaginationData | null>(null);
  const [filterValue, setFilterValue] = useState<ITableFilterValue>("all");
  const [queryString, setQueryString] = useState<string>("");
  const [isUserSearchMenuOpen, setIsUserSearchMenuOpen] = useState(false);
  const userSearchMenuRef = useRef<HTMLDivElement>(null);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  function parseLinkHeader(header: string | null): IPaginationData {
    let totalPages = paginationData?.totalPages ?? 1;
    let currentPage = paginationData?.totalPages ?? 1;

    if (!header) return {} as IPaginationData;
    // this needs to be made easier to read - and there may not be a 'link' header
    const paginationLinksText = header.split(",");

    for(let i = 0; i < paginationLinksText.length; i++) {
      const match = paginationLinksText[i].match(/<([^>]+)>;\s*rel="([^"]+)"/);
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
      }
    }

    return { totalPages, currentPage };
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
    if(page > paginationData!.totalPages) return;

    const searchParams = new URLSearchParams(queryString.split("?")[1]);
    searchParams.set("page", page.toString());
    setQueryString(`${queryString.split("?")[0]}?${searchParams.toString()}`);
  };

  const searchForUsers = useDebouncedCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
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
      const handleClickOutside = (event: MouseEvent) => {
        if (
          userSearchMenuRef.current &&
          !userSearchMenuRef.current.contains(event.target as Node)
        ) {
          setIsUserSearchMenuOpen(false);
        }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, []);

    useEffect(() => {
      setIsUserSearchMenuOpen(userResults?.length > 0);
    }, [userResults?.length]);

  useEffect(() => {
    if (!queryString) return;
    console.log('query string', queryString);
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
      setPaginationData(paginationData);
      setRepositories(resJson);
    };
    fetchRepositories();
  }, [queryString])

  // TODO: we likely don't need all these seperate functions for different sorts and such
  // should be able to stash these all in an object and just pull relevant data when it changes
  // useReducer would be a good fit for this
  useEffect(() => {
    const searchParams = new URLSearchParams(queryString.split("?")[1]);
    searchParams.set("type", filterValue);
    setQueryString(`${queryString.split("?")[0]}?${searchParams.toString()}`);
  }, [filterValue]);

  return (
    <div className="p-20">
      <div className="mb-10 flex flex-col justify-center align-items">
        <h1 className="text-xl">GitHub Repository Search</h1>
        <Github />
      </div>
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
                      placeholder="Start Entering a Username..."
                      {...rest}
                    />
                  </FormControl>
                  {isUserSearchMenuOpen && (
                    <UserSearchResults
                      ref={userSearchMenuRef}
                      setUser={onSelectUser}
                      users={userResults}
                    />
                  )}
                  <FormMessage />
                </FormItem>
              );
            }}
          />
          <Button className="my-8" type="submit">
            Fetch
          </Button>
        </form>
      </Form>
      {repositories.length > 0 && (
        <RepositoryTable
          onPaginate={onPaginate}
          paginationData={paginationData}
          repositories={repositories}
          onSort={onSort}
          filterValue={filterValue}
          onChangeFilter={setFilterValue}
        />
      )}
    </div>
  );
}
