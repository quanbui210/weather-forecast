# Weather Forecast App

React + TypeScript + Vite weather forecast web application, users can:

- search for a city or location
- use current browser location
- view current weather of a location
- view a 7-day forecast of a location
- view hourly forecast for a selected day
- view recent search history
  
*Weather code referral: https://gist.github.com/stellasphere/9490c195ed2b53c707087c8c2db4ec0c*

## Tech Stack

- React
- TypeScript
- Vite
- Sass
- Vitest + Testing Library
- GitHub Actions
- Vercel (deployment)

## Folder Structure (feature-based)

```javascript
weather-forecast/
├─ .github/
│  └─ workflows/
│     └─ ci.yml
├─ public/
├─ src/
│  ├─ api/      //shared HTTP utilities
│  │  ├─ client.ts
│  │  └─ client.test.ts
│  ├─ app/      //Top level app shell
│  │  └─ App.tsx
│  ├─ assets/
│  ├─ features/
│  │  ├─ location-search/  // geocoding / location search
│  │  │  ├─ __tests__/
│  │  │  ├─ components/
│  │  │  ├─ hooks/
│  │  │  ├─ api.ts
│  │  │  └─ types.ts
│  │  └─ weather/     // forecast feature
│  │     ├─ __tests__/
│  │     ├─ components/
│  │     ├─ hooks/
│  │     ├─ model/
│  │     ├─ api.ts
│  │     └─ types.ts
│  ├─ shared/    // reusable helpers / hooks / components
│  │  ├─ components/
│  │  ├─ hooks/
│  │  └─ lib/
│  ├─ tests/    // test setup
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

4. Open in browser:

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






