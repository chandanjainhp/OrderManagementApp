import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import Menu from './pages/Menu';
import Cart from './pages/Cart';
import OrderStatus from './pages/OrderStatus';

function App() {
  return (
    <CartProvider>
      <Router>
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Menu />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/order/:id" element={<OrderStatus />} />
            </Routes>
          </main>

          <footer className="bg-white border-t border-gray-100 mt-20">
            <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
              <p className="text-center text-gray-400 text-sm font-medium">
                © 2026 CraveBite Order Management App.
              </p>
            </div>
          </footer>
        </div>
      </Router>
    </CartProvider>
  );
}

export default App;
