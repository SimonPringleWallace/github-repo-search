'use client'
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useDebouncedCallback } from "use-debounce";

const formSchema = z.object({
  name: z.string().nonempty({
    message: "User name is required",
  }),
});

export default function Home() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    console.log(data);
  };

  const searchForUsers = useDebouncedCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      console.log(e.target.value);
      const res = await fetch(`https://api.github.com/search/users?q=${e.target.value}`, {
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_GITHUB_API_KEY}`,
        },
      })
      console.log(await res.json());
  }, 500)

  return (
    <div className="mt-20">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            name="name"
            control={form.control}
            render={({field: { onChange, ...field }}) => (
              <FormItem>
                <FormLabel>User name</FormLabel>
                <FormControl>
                  <Input
                    onChange={(e) => {
                      searchForUsers(e);
                      onChange(e);
                    }}
                    className="w-60"
                    placeholder="GitHub Username"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Fetch</Button>
        </form>
      </Form>
    </div>
  );
}
