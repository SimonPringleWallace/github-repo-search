# Github Repo Searcher

## Getting Started

- To interact with this project you will first need a github API key. Fine grained tokens are recommended and more information on them can be found [here](https://github.blog/security/application-security/introducing-fine-grained-personal-access-tokens-for-github/).

- One you have setup a token, clone the repository and create a new env file in the project root called `.env.local` and add the token with the key of `NEXT_PUBLIC_GITHUB_API_KEY`.


- Install dependencies with `pnpm install` 
- Run the project with `pnpm dev`
- Run tests with `pnpm test`


## Technologies
This app was created using the following technologies:

#### [Next.js](https://nextjs.org/)
At this scale we can't take advantage of many of the core features of Next 
but it provides an easy way to bootstrap a new project and would grow with the application over time.

#### [Shadcn Components](https://ui.shadcn.com/)
Shadcn/ui provide a nice lightweight UI with the advantage that it does not require an extensive component library and, with the code becoming native to the project, style overrides are less of a concern during development as the component can be tailored to our purposes out-of-the-box and maintained with the rest of the code.

#### [Tailwindcss](https://tailwindcss.com/)
Tailwind provides an really fast and effecient way of styling components. Helps to keep the bundle light and plays well with shadcn.

#### [Jest](https://jestjs.io/)
A standard library for Javascript as well as React testing.

## Approach
The application, though simple, was designed with an eye towards user convenience. To begin with, we take advatage of the GitHub api search features to proactively search for github users that match the users input into the text input (of course the searching is debounced). This saves the user needing to know the exact username they're searching for.

Pagination, sorting and filtering are provided as well allow for fine-grain observations of the data for individual users. These features are provided by the Github API via specific search parameters on the requests.

## Future Work
- The GitHub Rest Api returns a great deal of data not useful to this project - this is something that GraphQL was designed to handle and interacting with GitHub GraphQL api instead would speed up query response times due to the smaller payloads.

- Caching was not implemented in this initial approach but certainly should be in the future to prevent repeat requests during pagination, sorting, filter and so on. A user moving from the first page to the second and then back to the first should see two cache misses and one hit, for example. Potential libraries include Apollo if GraphQL is implemented, Redux is fairly standard for use with REST, etc.

- The current Sorting UI, while functional, could be improved by toggling the icon on the table to point in the direction of the sort.

- Mobile responsive styling should be implemented. 

- End-to-End Testing (Playwright, Cypress)
Though admittedly overkill for an app this size, a test suite like Cypress or Playwright would allow really thorough testing of edge cases around sorting, filter, etc. While these are technically testable with a tool like Jest, the process of mocking the http requests can make for code that is cumbersome and difficult to read whereas the corresponding e2e tests are fairly straightforward. Of course we would still want to be intercepting and mocking requests within the e2e testing tool but this tends to be a straightforward process.



