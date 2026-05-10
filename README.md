# Weather Forecast App

React + TypeScript + Vite weather forecast web application, users can:

- search for a city or location
- use current browser location
- view current weather of a location
- view a 7-day forecast of a location
- view hourly forecast for a selected day
- view recent search history

## Tech Stack

- React
- TypeScript
- Vite
- Sass
- Vitest + Testing Library
- GitHub Actions
- Vercel (deployment)

## Folder Structure

```text
corsearch-assignment/
├─ .github/
│  └─ workflows/
│     └─ ci.yml
├─ public/
├─ src/
│  ├─ api/
│  │  ├─ client.ts
│  │  └─ client.test.ts
│  ├─ app/
│  │  └─ App.tsx
│  ├─ assets/
│  ├─ features/
│  │  ├─ location-search/
│  │  │  ├─ __tests__/
│  │  │  ├─ components/
│  │  │  ├─ hooks/
│  │  │  ├─ api.ts
│  │  │  └─ types.ts
│  │  └─ weather/
│  │     ├─ __tests__/
│  │     ├─ components/
│  │     ├─ hooks/
│  │     ├─ model/
│  │     ├─ api.ts
│  │     └─ types.ts
│  ├─ shared/
│  │  ├─ components/
│  │  ├─ hooks/
│  │  └─ lib/
│  ├─ tests/
│  │  └─ setup.ts
│  └─ main.tsx
├─ package.json
└─ README.md
```

## Local Setup

1. Clone the repository:

```bash
git clone https://github.com/quanbui210/weather-forecast.git
cd weather-forecast
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

4. Open the app in your browser:

```text
http://localhost:5173
```

## Project Scripts

### Start development server

```bash
npm run dev
```

Runs the Vite dev server with hot reload.

### Run type checking

```bash
npm run typecheck
```

### Run linting

```bash
npm run lint
```

### Format code

```bash
npm run format
```

### Check formatting (CI-friendly)

```bash
npm run format:check
```

### Run tests in watch mode

````bash
npm test


### Run tests with coverage

```bash
npm run test:run
````

## CI

GitHub Actions workflow file:

- `.github/workflows/ci.yml`

The CI pipeline runs:

1. `npm ci`
2. `npm run lint`
3. `npm run typecheck`
4. `npm run format:check`
5. `npm run test:run`
6. `npm run build`
