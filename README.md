# React Showcase

## Dev

### Installation

Install [`pnpm`](https://pnpm.io/installation#using-a-standalone-script), then:

```bash
pnpm run requirements
```

> **Note**: [This script installs two global dependencies](./package.json#L7). Feel free to change [package.json](./package.json) scripts to not use them.

### Run

```bash
pnpm dev
```

Google Chrome will pop up if you're using Windows. Otherwise, navigate to http://localhost:5173

> **Note**: If there are issues with absolute links, you can view the code by using the build resource as `pnpm run server`. If not on Windows, then navigate to http://localhost:3000 as custom port per `.env` variables was not configured.

### Build and Deploy

```bash
pnpm build
```

You should then be able to deploy/containerize all contents under [`server`](server)

### Cleanup

The `requirements` script installs two global dependencies:

- [`concurrently`](https://www.npmjs.com/package/concurrently)
- [`babel-watch`](https://www.npmjs.com/package/babel-watch)

Feel free to uninstall them once you're done.

```bash
npm uninstall -g babel-watch
```

```bash
npm uninstall -g concurrently
```

## Documentation

### Structure

```raw
─ src
    ├─ api:
    ├─ assets: Images
    ├─ components
    │   ├─ data-table
    │   │  ├─ index: Named exports
    │   │  ├─ table-page: Business
    │   │  ├─ container: Named exports
    │   │  └─ ... rest of components ...
    │   └─ shadcn
    │      └─ ... Modified Radix + ShadCn components ...
    ├─ layouts
    ├─ lib
    └─ ... rest of regular React files ...
```

### Capacity Unit conversion

Capacity units get simplified to their nearest higher unit with two decimals above `1028GB` on the table. However, their raw values delimited by commas are still available once you hover over a row.

Maintain the raw data allows for future unit changes and migrations.

The max allowed by the UI due to  is `1.247 * 10<sup>24</sup> GB` as it becomes the first unit not that's *currently not globally defined*, `1028GeB => 1 "future unit name"`.

### Deep Search

The first input field in the table options row searches for *anything* within the `devices` data. This includes *both* raw and simplified capacity units.

### Query / Search Parameters

The `q=[value]` query parameter is attached to the table's filter

## Known imperfections

- The [imported components](/src/components/shadcn/) from [`shadcn`](https://ui.shadcn.com/) used on this project are a bit complex/voluminous for the task at hand. But they do look nice!
- There are a few naming / text inconsistencies between the "CRUD" initials and the values and the UI:
  - `Add` in the UI means `Create`
  - `Edit` in the UI mean `Update`
  - `Delete` in the UI used `remove` variable/prop names under the hood, as `delete` is a reserved keyword in JS. Camel case variables use `delete`: e.g. `deleteRestOfVariableName`
  - There might be too many uses of `memo` and `useCallback`. The app was flickering a lot at some point when using React/TanStack Query. I ended up scraping the use of RQ
- No other filter besides the deep-search/big-search-field is parametrized on the URL
- After you click on each table-options sorting button, the tooltip that shows the `Next filter: ...` will disappear Per research fixing this seemed seemed beyond its UX value
- The select dropdown for device types in dialogs/modals doesn't show the OS's icons like in the table options filter
- Didn't implement a Dark Mode - although there's a [Chrome extension that automatically forces dark mode on most websites](https://chromewebstore.google.com/detail/dark-reader/eimadpbcbfnmbkopoojfekhnkhdbieeh?hl=en-US3)