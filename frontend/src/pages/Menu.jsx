import { useEffect, useState } from 'react';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { Plus, Search } from 'lucide-react';

export default function Menu() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const { addToCart } = useCart();

    useEffect(() => {
        async function fetchMenu() {
            try {
                const response = await axios.get('http://localhost:5000/api/menu');
                setItems(response.data);
            } catch (error) {
                console.error('Failed to fetch menu:', error);
            } finally {
                setLoading(false);
            }
        }
        fetchMenu();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
            </div>
        );
    }

    const filteredItems = items.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <h1 className="text-4xl font-extrabold text-gray-900 mb-8 tracking-tight">
                Our Menu
            </h1>

            {/* Search Bar */}
            <div className="mb-8 relative max-w-2xl">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                    type="text"
                    placeholder="Search for delicious meals..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition shadow-sm text-gray-900 bg-white placeholder-gray-400"
                />
            </div>

            {filteredItems.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
                    <Search className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-gray-900 mb-2">No items found</h3>
                    <p className="text-gray-500">We couldn't find anything matching "{searchQuery}"</p>
                    <button
                        onClick={() => setSearchQuery('')}
                        className="mt-6 text-orange-600 font-medium hover:text-orange-700 hover:underline"
                    >
                        Clear search
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredItems.map((item) => (
                        <div
                            key={item.id}
                            className="bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col hover:shadow-xl transition-shadow duration-300"
                        >
                            <div className="h-48 w-full overflow-hidden">
                                <img
                                    src={item.imageUrl}
                                    alt={item.name}
                                    className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
                                />
                            </div>
                            <div className="p-6 flex flex-col flex-grow">
                                <div className="flex justify-between items-start mb-2">
                                    <h2 className="text-xl font-bold text-gray-900">{item.name}</h2>
                                    <span className="text-lg font-bold text-orange-600">
                                        ₹{item.price.toFixed(2)}
                                    </span>
                                </div>
                                <p className="text-gray-600 flex-grow mb-6">{item.description}</p>

                                <button
                                    onClick={() => addToCart(item)}
                                    className="w-full bg-orange-600 text-white py-3 px-4 rounded-xl font-medium flex items-center justify-center space-x-2 hover:bg-orange-700 transition-colors focus:ring-4 focus:ring-orange-200"
                                >
                                    <Plus className="w-5 h-5" />
                                    <span>Add to Cart</span>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
