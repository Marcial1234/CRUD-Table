# React Showcase

## Dev

### Quick Run

Using either `npm` or `pnpm` ([if installed](https://pnpm.io/installation#using-a-standalone-script)), you can run the server directly as built frontend application is included and available thru:

```bash
[p]npm i ; babel-node server/index.js
```

Then browse to [`http://localhost:3000`](http://localhost:3000)

### Installation

Install [`pnpm`](https://pnpm.io/installation#using-a-standalone-script), then:

```bash
[p]npm run requirements
```

> **Note**: [This script installs two global dependencies](./package.json#L7). Feel free to change [`package.json`](./package.json) scripts to not use them or set them as global.

### Run

```bash
[p]npm dev
```

Google Chrome will pop up if you're using Windows. Otherwise, navigate to [`http://localhost:5173`](http://localhost:5173)

> **Note**: If there are issues with absolute links, you can view the code by using the build resource as `[p]npm run server`. If not on Windows navigate to [`http://localhost:3000`](http://localhost:3000). Port is stable as `.env` variables were not configured.

### Build and Deploy

```bash
[p]npm build
```

You should then be able to deploy/containerize all contents under [`server`](server)

### Cleanup

The `requirements` script installs a global dependencies:

- [`concurrently`](https://www.npmjs.com/package/concurrently)

Feel free to uninstall it once you're done.

```bash
[p]npm rm -g babel-watch concurrently
```

## Documentation

### Structure

```raw
─ src
    ├─ api: axios wrapper on server endpoints
    ├─ assets: Images
    ├─ components
    │   ├─ data-table
    │   │  ├─ container.jsx: Container component that orchestrates table UI
    │   │  ├─ crud-dialogs.jsx: Presentational component for Dialogs/Popups/Modals
    │   │  ├─ index.js: Named exports
    │   │  └─ ... rest of the module's components ...
    │   └─ shadcn
    │      └─ ... Modified Radix + ShadCn components ...
    ├─ layouts
    ├─ lib
    ├─ table-page.jsx: Integrates API fetchers with UI loading state
    └─ ... rest of React files ...
```

### Responsiveness

The look and feel of the app should not be affected by device width. However, on slow connections the `Skeleton` animation will load longer.

### Capacity Units

Capacity units get simplified to their nearest higher unit with two decimals above `1028GB` on the table. However, their raw values delimited by commas are still available once you hover over a row.

Maintain the raw data allows for future unit changes and migrations.

The max allowed by the UI is: <pre>`1.247 * 10`<sup>`24`</sup>` GB`</pre> `1028GeB => 1 "future unit name"` as becomes the first unit that's _not currently defined_:

### Deep Search

The first input field in the table options row searches for _anything_ within the `devices` data. This includes _both_ raw and simplified capacity units. Also matches `apple` to Mac Workstations.

### Query / Search Parameters

The `q=[value]` query parameter is attached to the table's filter. It's removed when any of the filter two buttons are used. It persists on a hard reload / refresh.

### Search type when filtering

Filter dropdown has type search capabilities, and also shows faceted values (uniques rows post filters).

### Field specific sorting buttons

There are 3 field that can be uniquely sorted: `system_name`, `type`, or `hdd_capacity`. Each has its own button instead of a combined dropdown sort.

**Note**: Multi-sort was not implemented. When a new field's sort is toggled, the previous one is removed.

### Tooltips

Each row and filter button, and the reset table button will show useful content on hover.

## Known imperfections

- TypeScript wasn't used/added
- **Feature**: Server responses are purposely [slowed down on first render](./server/controllers/devices.js#L19) to show `Skeleton` animation

- The [imported components](/src/components/shadcn/) from [`shadcn`](https://ui.shadcn.com/) used on this project are a bit complex/voluminous for the task at hand. But they do look nice! A few are in TypeScript
- The endpoint `GET api/devices/:id` is not used
- The table options (filters + sorting) overflow into a new line if device is small
- There are a few naming / text inconsistencies between `CRUD` named-expansions and text / variable-names:
  - `Add` in the UI means `Create`
  - `Edit` in the UI mean `Update`
  - `Delete` in the UI uses `remove` as variable/prop names in the code, as `delete` is a reserved keyword in JS. Camel case variables however do start with `delete`.
- There might be an overuse of `memo` and `useCallback`. The app was flickering too much when using React/TanStack Query. RQ usage was scraped but the memoization hooks stayed. Premature optimizations might also include usage of `Object.freeze`.
- The styles in all `skeleton` components will need to be kept in sync manually
- After you click on each table-options sorting button, the tooltip that shows the `Next filter: ...` will disappear Per research fixing this seemed seemed beyond its UX value
- The select dropdown for device types in dialogs/modals doesn't show the OS's icons like in the table options filter
- No other filter besides the deep-search/big-search-field is parametrized on the URL
- Exceptions are not caught/resolved, and `ErrorBoundary`'s fallback is not useful
- Didn't implement a Dark Mode - although there's a [Chrome extension that automatically forces dark mode on most websites](https://chromewebstore.google.com/detail/dark-reader/eimadpbcbfnmbkopoojfekhnkhdbieeh?hl=en-US3)
