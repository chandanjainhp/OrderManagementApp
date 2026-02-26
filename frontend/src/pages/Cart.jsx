import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Trash2, Plus, Minus, ArrowRight } from 'lucide-react';

export default function Cart() {
    const { cartItems, removeFromCart, updateQuantity, cartTotal, clearCart } = useCart();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        customerName: '',
        customerEmail: '',
        customerAddress: '',
        customerPhone: '',
    });
    const [formErrors, setFormErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const validateForm = () => {
        const errors = {};

        if (!formData.customerName.trim() || formData.customerName.trim().length < 2) {
            errors.customerName = 'Name must be at least 2 characters long.';
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!formData.customerEmail || !emailRegex.test(formData.customerEmail)) {
            errors.customerEmail = 'Please enter a valid email address.';
        }

        if (!formData.customerAddress.trim() || formData.customerAddress.trim().length < 5) {
            errors.customerAddress = 'Please enter a complete delivery address.';
        }

        const phoneRegex = /^[\d\s\+\-\(\)]{7,20}$/;
        if (!formData.customerPhone || !phoneRegex.test(formData.customerPhone)) {
            errors.customerPhone = 'Please enter a valid phone number.';
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmitOrder = async (e) => {
        e.preventDefault();
        setError('');

        if (cartItems.length === 0) {
            setError('Your cart is empty');
            return;
        }

        if (!validateForm()) {
            return;
        }

        setLoading(true);
        try {
            const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
            const response = await axios.post(`${baseUrl}/api/orders`, {
                ...formData,
                items: cartItems,
            });

            clearCart();
            navigate(`/order/${response.data.orderId}`);
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to place order');
        } finally {
            setLoading(false);
        }
    };

    if (cartItems.length === 0) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
                <h2 className="text-3xl font-extrabold text-gray-900 mb-4">Your Cart is Empty</h2>
                <p className="text-gray-500 mb-8 max-w-md mx-auto">
                    Looks like you haven't added anything to your cart yet. Go ahead and explore our menu!
                </p>
                <button
                    onClick={() => navigate('/')}
                    className="bg-orange-600 text-white px-8 py-3 rounded-xl font-medium hover:bg-orange-700 transition"
                >
                    Browse Menu
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <h1 className="text-3xl font-extrabold text-gray-900 mb-8">Checkout</h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Cart Items */}
                <div className="space-y-6">
                    <div className="bg-white rounded-2xl shadow p-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-6 border-b pb-4">Order Summary</h2>
                        <ul className="divide-y divide-gray-100">
                            {cartItems.map((item) => (
                                <li key={item.id} className="py-4 flex gap-4">
                                    <img src={item.imageUrl} alt={item.name} className="w-20 h-20 object-cover rounded-lg" />
                                    <div className="flex-1">
                                        <div className="flex justify-between mb-1">
                                            <h3 className="font-bold text-gray-900">{item.name}</h3>
                                            <p className="font-medium text-orange-600">
                                                ₹{(item.price * item.quantity).toFixed(2)}
                                            </p>
                                        </div>

                                        <div className="flex items-center justify-between mt-4">
                                            <div className="flex items-center space-x-3 bg-gray-50 rounded-lg p-1">
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                    className="p-1 text-gray-500 hover:bg-gray-200 rounded"
                                                >
                                                    <Minus className="w-4 h-4" />
                                                </button>
                                                <span className="font-medium w-4 text-center">{item.quantity}</span>
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                    className="p-1 text-gray-500 hover:bg-gray-200 rounded"
                                                >
                                                    <Plus className="w-4 h-4" />
                                                </button>
                                            </div>

                                            <button
                                                onClick={() => removeFromCart(item.id)}
                                                className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>

                        <div className="mt-6 pt-6 border-t border-gray-100 flex justify-between items-center text-xl font-bold text-gray-900">
                            <span>Total</span>
                            <span>₹{cartTotal.toFixed(2)}</span>
                        </div>
                    </div>
                </div>

                {/* Checkout Form */}
                <div className="bg-white rounded-2xl shadow p-6 h-fit">
                    <h2 className="text-xl font-bold text-gray-900 mb-6 border-b pb-4">Delivery Details</h2>

                    {error && (
                        <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 text-sm flex items-center">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmitOrder} className="space-y-4">
                        <div>
                            <label htmlFor="customerName" className="block text-sm font-medium text-gray-700 mb-1">
                                Full Name
                            </label>
                            <input
                                type="text"
                                id="customerName"
                                name="customerName"
                                value={formData.customerName}
                                onChange={handleInputChange}
                                className={`w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition ${formErrors.customerName ? 'border-red-500' : 'border-gray-200'}`}
                            />
                            {formErrors.customerName && <p className="mt-1 text-sm text-red-600">{formErrors.customerName}</p>}
                        </div>

                        <div>
                            <label htmlFor="customerEmail" className="block text-sm font-medium text-gray-700 mb-1">
                                Email Address
                            </label>
                            <input
                                type="text"
                                id="customerEmail"
                                name="customerEmail"
                                value={formData.customerEmail}
                                onChange={handleInputChange}
                                className={`w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition ${formErrors.customerEmail ? 'border-red-500' : 'border-gray-200'}`}
                            />
                            {formErrors.customerEmail && <p className="mt-1 text-sm text-red-600">{formErrors.customerEmail}</p>}
                        </div>

                        <div>
                            <label htmlFor="customerAddress" className="block text-sm font-medium text-gray-700 mb-1">
                                Delivery Address
                            </label>
                            <textarea
                                id="customerAddress"
                                name="customerAddress"
                                value={formData.customerAddress}
                                onChange={handleInputChange}
                                rows={3}
                                className={`w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition resize-none ${formErrors.customerAddress ? 'border-red-500' : 'border-gray-200'}`}
                            />
                            {formErrors.customerAddress && <p className="mt-1 text-sm text-red-600">{formErrors.customerAddress}</p>}
                        </div>

                        <div>
                            <label htmlFor="customerPhone" className="block text-sm font-medium text-gray-700 mb-1">
                                Phone Number
                            </label>
                            <input
                                type="text"
                                id="customerPhone"
                                name="customerPhone"
                                value={formData.customerPhone}
                                onChange={handleInputChange}
                                className={`w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition ${formErrors.customerPhone ? 'border-red-500' : 'border-gray-200'}`}
                            />
                            {formErrors.customerPhone && <p className="mt-1 text-sm text-red-600">{formErrors.customerPhone}</p>}
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full mt-6 bg-orange-600 text-white py-4 px-6 rounded-xl font-bold text-lg flex items-center justify-center space-x-2 hover:bg-orange-700 transition disabled:opacity-70"
                        >
                            {loading ? (
                                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                            ) : (
                                <>
                                    <span>Place Order - ₹{cartTotal.toFixed(2)}</span>
                                    <ArrowRight className="w-5 h-5" />
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
