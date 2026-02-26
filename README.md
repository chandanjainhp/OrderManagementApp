# Order Management Application

A full-stack, containerized application designed to handle restaurant or e-commerce orders. It features a modern React frontend for browsing a menu and placing orders, paired with a robust Node.js and Express backend backed by a PostgreSQL database for order processing and tracking.

![App Demo](/path-to-your-image.png) <!-- Update later to actual screenshot -->

## Features

- **Modern UI**: Aesthetically pleasing interface built with React, Vite, and Tailwind CSS v4.
- **Menu Browsing**: View available items fetched dynamically from the database.
- **Shopping Cart**: Manage your current selection with the Context API.
- **Order Placement**: Check out seamlessly to create a backend order record.
- **Order Tracking**: Simulate real-time order status tracking with a clean timeline UI.
- **Containerized**: Fully dockerized frontend, backend, and PostgreSQL database for easy local setup and deployment.
- **End-to-End Type Safety (mostly)**: Uses Zod for schema validation on the backend.

## Tech Stack

### Frontend
- **React 19 & Vite**: Ultra-fast development and build suite.
- **Tailwind CSS v4**: Utility-first styling with modern paradigms.
- **Lucide React**: Beautiful icons.
- **Vitest**: Fast unit and component testing.
- **Axios**: HTTP client.

### Backend
- **Node.js & Express 5**: Fast and unopinionated web framework.
- **PostgreSQL**: Relational database under the hood.
- **Drizzle ORM**: Lightweight and performant TypeScript/JavaScript ORM.
- **Zod**: Declarative payload validation.
- **Nodemailer**: Email processing.
- **Vitest & Supertest**: Backend integration testing.

## Prerequisites

- **Docker** and **Docker Compose** installed on your machine.
- Optional: Node.js 20+ if running outside of Docker.

## Running Locally with Docker (Recommended)

The easiest way to get the app running is to use Docker Compose, which spins up the database, backend, and frontend containers automatically.

1. Clone the repository
   ```bash
   git clone <your-repo-url>
   cd order-management-app
   ```

2. Start the application
   ```bash
   docker compose up -d --build
   ```
   > [!NOTE] 
   > The `--build` flag ensures both the React and Node images are built using their respective `Dockerfile`s.

3. Initialize the Database
   Because the PostgreSQL container starts fresh, you need to run the database migrations and seed the initial menu data.
   
   Execute these commands inside the running backend container:
   ```bash
   # Enter the backend container
   docker exec -it order_management_backend sh

   # Run migrations
   npm run db:push

   # Seed the database
   npm run db:seed

   # Type 'exit' to leave the container
   ```

4. Access the App
   - **Frontend**: [http://localhost](http://localhost) (Served via Nginx on port 80)
   - **Backend API**: [http://localhost:5000](http://localhost:5000)
   - **Database**: `localhost:5432`

## Running Locally without Docker

If you prefer to run the Node and React apps natively, you will still need a running PostgreSQL database.

1. Start just the database:
   ```bash
   docker compose up -d postgres
   ```
2. Open a terminal for the **Backend**:
   ```bash
   cd backend
   npm install
   npm run db:push
   npm run db:seed
   npm run dev
   ```
3. Open another terminal for the **Frontend**:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
   *The Vite frontend will start on port 5173.*

## Project Structure

```text
order-management-app/
├── backend/                  # Express.js API
│   ├── src/                  # Controllers, Models, Routes
│   ├── tests/                # API integration tests
│   ├── .env                  # Environment variables 
│   ├── docker-compose.yml    # Database-only isolated compose
│   ├── Dockerfile            # Container definition for the API
│   └── package.json
├── frontend/                 # React application
│   ├── src/                  # Pages, Components, Context
│   ├── tests/                # React component tests
│   ├── Dockerfile            # Multi-stage Nginx build definition
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── package.json
└── docker-compose.yml        # Root compose file for the entire stack
```

## Testing

Both the frontend and backend utilize Vitest for testing.
To run tests, navigate into the respective folder (`cd frontend` or `cd backend`) and run:
```bash
npm test
```

## Deployment


