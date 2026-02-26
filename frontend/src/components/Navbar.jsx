import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { ShoppingCart, Utensils } from 'lucide-react';

export default function Navbar() {
    const { cartItems } = useCart();
    const itemCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

    return (
        <nav className="bg-white shadow-md sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    <Link to="/" className="flex items-center space-x-2 text-orange-600 font-bold text-2xl">
                        <Utensils className="h-8 w-8" />
                        <span>CraveBite</span>
                    </Link>

                    <Link
                        to="/cart"
                        className="relative flex items-center p-2 text-gray-700 hover:text-orange-600 transition-colors"
                    >
                        <ShoppingCart className="h-6 w-6" />
                        {itemCount > 0 && (
                            <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-orange-600 rounded-full">
                                {itemCount}
                            </span>
                        )}
                    </Link>
                </div>
            </div>
        </nav>
    );
}
