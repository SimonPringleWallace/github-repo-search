'use client'
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useDebouncedCallback } from "use-debounce";
import { useState } from "react";

const formSchema = z.object({
  name: z.string().nonempty({
    message: "User name is required",
  }),
});

interface IUser {
  login: string;
  avatar_url: string;
}

interface IUserSearchResult {
  users: IUser[];
  setUser: (user: string) => void;
}

const UserSearchResults = ({ users, setUser }: IUserSearchResult) => {
  return (
    <div className="h-96 w-64 overflow-x-auto absolute z-30 bg-slate-50">
      {users.map((user) => (
        <div className="flex justify-start items-center cursor-pointer my-4" key={user.login} onClick={() => setUser(user.login)}>
          <img className="rounded-full h-10 w-10 mr-4" src={user.avatar_url} alt={user.login} />
          <p>{user.login}</p>
        </div>
      ))}
    </div>
  );
};

export default function Home() {
  const [userResults, setUserResults] = useState([]);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    console.log(data);
  };

  const onSelectUser = (user: string) => {
    setSelectedUser(user);
    form.setValue("name", user);
    setUserResults([]);
  }

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

  return (
    <div className="mt-20">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            name="name"
            control={form.control}
            render={({field: { onChange, ...field }}) => {
               
              const {value, ...rest } = field;
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
                  {userResults.length > 0 && (
                    <UserSearchResults
                      setUser={onSelectUser}
                      users={userResults}
                    />
                  )}
                  <FormMessage />
                </FormItem>
              );}
            }
          />
          <Button type="submit">Fetch</Button>
        </form>
      </Form>
    </div>
  );
}
