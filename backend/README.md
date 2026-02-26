# Order Management App - Backend

An Express.js REST API providing backend services for the Order Management Application.

## Features
- Provides Menu Items from the database
- Processes Orders and creates Order Items
- Simulates real-time order status tracking

## Tech Stack
- Node.js & Express.js
- PostgreSQL
- Drizzle ORM

## Local Setup

1. Make sure you have Docker installed (or a direct PostgreSQL installation).
2. Start the database using Docker Compose:
   ```bash
   docker compose up -d
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Push the database schema and seed initial data:
   ```bash
   npm run db:push
   npm run db:seed
   ```
5. Start the development server:
   ```bash
   npm run dev
   ```

The API will run at `http://localhost:5000`.

## Testing
Run Vitest API tests:
```bash
npm test
```

## Deployment (Render / Railway)
1. Push this repository to GitHub.
2. Connect your Git repository to Render or Railway.
3. Add a PostgreSQL Database service in your hosting provider to get a `DATABASE_URL`.
4. Set the `DATABASE_URL` as an environment variable in your web service.
5. Setup your build/start commands:
   - Build/Install Command: `npm install`
   - Start Command: `npm start`
6. Run migrations on the deployed database (`npm run db:push` and `npm run db:seed`).
