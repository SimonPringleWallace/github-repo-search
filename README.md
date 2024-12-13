# Github Repo Searcher

## Getting Started

- To interact with this project you will first need a github API key. Fine grained tokens are recommended and more information on them can be found [here](https://github.blog/security/application-security/introducing-fine-grained-personal-access-tokens-for-github/).

- One you have setup a token, create a new env file in the project root called `.env.local` and add the token with the key of `NEXT_PUBLIC_GITHUB_API_KEY`.


- Install dependencies with `pnpm install` 
- Run the project with `pnpm dev`
- Run tests with `pnpm test`


## Technologies
This app was created using the following technologies:

#### [Next.js](https://nextjs.org/): 
At this scale we can't take advantage of many of the core features of next 
but it provides a easy way to bootstrap a new project and would grow with the application over time.

#### [Shadcn Components](https://ui.shadcn.com/)
Shadcn/ui provide a nice light-weight UI with the advantage that it does not require extensive compoenent library and, with the code becoming native to the project. Style overrides are less of a concern during development as the componenets can be tailored to our purposes out-of-the-box and maintained with the rest of the code

#### [Tailwindcss](https://tailwindcss.com/)
Tailwind provides an really fast and effecient way of styling components. Helps to keep the bundle light and plays well with shadcn

#### [Jest](https://jestjs.io/)
A standard library for Javascrip as well as react

## Approach
The application, though simple, was designed with an eye towards user convenience. To begin with, we take advatage of the GitHub api search features to proactively search for github users that match the users input into the text input (of course the searching is debounced). This saves the user needing to know the exact username their searching for

Pagination, sorting and filtering are provided as well allow for fine-grain observations of the data for individual users.

## Future Work
- The GitHub Rest Api return a great deal of data not useful to this project this is something that GraphQL was designed to handle and interacting with GitHub GraphQl api instead would speed up query response times due to the smaller payloads

- Caching was not implemented in this initial approach but certainly should be in the future. Potential libraries include Apollo if GraphQl is implemented, or Redux, and others.

- The current Sorting UI, while functioal, could be improved but toggling the icon on the table to point in the direction of the sort


