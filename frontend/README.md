# Order Management App - Frontend

A modern, fast, and aesthetically pleasing React application to display a menu, manage a cart, and track orders.

## Tech Stack
- React & Vite
- Tailwind CSS v4
- Context API
- Lucide React (Icons)
- Vitest & React Testing Library (TDD support)
- Axios

## Local Setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Run the development server:
   ```bash
   npm run dev
   ```

The app will run at `http://localhost:5173`. Make sure the Express backend server is running as well.

## Testing
Run unit tests with Vitest:
```bash
npm test
```

## Deployment (Vercel / Netlify)
To deploy this frontend application to Vercel:

1. Push this repository to GitHub.
2. Import the project into Vercel.
3. Vercel should automatically detect it's a Vite application.
4. Set the build command to `npm run build` and the output directory to `dist`.
5. Before deploying, you will need to update the base URL for API calls in `src/pages/Menu.jsx`, `Cart.jsx`, and `OrderStatus.jsx` from `http://localhost:5000` to the deployed layout URL of your backend. You can use environment variables (`import.meta.env.VITE_API_URL`) to manage this dynamic switching.
