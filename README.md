# Senior Frontend Software Engineer Showcase

## Installation
Install [`pnpm`](https://pnpm.io/installation#using-a-standalone-script), then:
```bash
pnpm run requirements
```

## Cleanup
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

## Run

```bash
pnpm dev
```

Google Chrome will pop up if you're using Windows. Otherwise, navigate to http://localhost:5173

## Build and Deploy

```bash
pnpm build
```

Deploy all contents under [`server`](server)
