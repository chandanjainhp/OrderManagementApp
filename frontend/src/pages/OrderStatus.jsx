import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { CheckCircle2, Clock, Truck, Home, MapPin, Timer } from 'lucide-react';

const STATUS_STEPS = [
    { id: 'Received', label: 'Order Received', icon: Clock },
    { id: 'Preparing', label: 'Preparing Food', icon: CheckCircle2 },
    { id: 'OutForDelivery', label: 'Out for Delivery', icon: Truck },
    { id: 'Delivered', label: 'Delivered', icon: Home },
];

export default function OrderStatus() {
    const { id } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [timeLeft, setTimeLeft] = useState('');

    useEffect(() => {
        let fetchIntervalId;
        let timerIntervalId;

        const updateTimer = (orderData) => {
            if (!orderData || orderData.status === 'Delivered') {
                setTimeLeft('Delivered');
                return;
            }

            // Estimate 30 minutes from order creation
            const orderTime = new Date(orderData.createdAt).getTime();
            const estimatedDeliveryTime = orderTime + (30 * 60 * 1000);
            const now = new Date().getTime();
            const difference = estimatedDeliveryTime - now;

            if (difference > 0) {
                const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((difference % (1000 * 60)) / 1000);
                setTimeLeft(`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
            } else {
                setTimeLeft('Arriving soon...');
            }
        };

        const fetchStatus = async () => {
            try {
                const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
                const response = await axios.get(`${baseUrl}/api/orders/${id}`);
                setOrder(response.data);
                updateTimer(response.data);
                setError('');
            } catch (err) {
                setError('Failed to fetch order status. Please check your order number.');
            } finally {
                setLoading(false);
            }
        };

        fetchStatus();

        // Data sync every 5 seconds
        fetchIntervalId = setInterval(fetchStatus, 5000);

        // Update countdown every second but do not re-fetch from API
        timerIntervalId = setInterval(() => {
            setOrder(prevOrder => {
                if (prevOrder) updateTimer(prevOrder);
                return prevOrder;
            });
        }, 1000);

        return () => {
            clearInterval(fetchIntervalId);
            clearInterval(timerIntervalId);
        };
    }, [id]);

    if (loading) {
        return (
            <div className="flex justify-center items-center py-32">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-2xl mx-auto px-4 py-20 text-center">
                <div className="bg-red-50 text-red-600 p-6 rounded-2xl mb-6">
                    <p className="font-medium text-lg">{error}</p>
                </div>
                <Link to="/" className="text-orange-600 font-medium hover:underline">
                    Return Home
                </Link>
            </div>
        );
    }

    const currentStepIndex = STATUS_STEPS.findIndex(step => step.id === order.status);

    return (
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="bg-white rounded-3xl shadow-xl overflow-hidden p-8">

                {/* Header Section with Timer */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-10 border-b border-gray-100 pb-8 gap-6">
                    <div>
                        <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Order Tracking</h1>
                        <p className="text-gray-500 font-medium">Order #{order.id}</p>
                    </div>

                    <div className="bg-orange-50 border border-orange-100 rounded-2xl p-4 flex items-center gap-4 transition-all duration-300 hover:shadow-md">
                        <div className="bg-orange-600 p-2.5 rounded-xl text-white shadow-sm">
                            <Timer className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-orange-900 mb-0.5 uppercase tracking-wider">Est. Delivery Time</p>
                            <p className="text-2xl font-bold text-orange-600 flex items-baseline gap-1">
                                {timeLeft} <span className="text-sm font-medium text-orange-500 opacity-80">{timeLeft !== 'Delivered' && !timeLeft.includes('Arriving') ? 'min' : ''}</span>
                            </p>
                        </div>
                    </div>
                </div>

                <div className="relative mt-12 mb-8">
                    <div className="absolute top-8 left-10 right-10 h-1 bg-gray-100 rounded">
                        <div
                            className="absolute top-0 left-0 h-full bg-orange-500 rounded transition-all duration-500 ease-in-out"
                            style={{ width: `${(Math.max(0, currentStepIndex) / (STATUS_STEPS.length - 1)) * 100}%` }}
                        />
                    </div>

                    <div className="relative flex justify-between">
                        {STATUS_STEPS.map((step, index) => {
                            const Icon = step.icon;
                            const isPast = index <= currentStepIndex;
                            const isCurrent = index === currentStepIndex;

                            return (
                                <div key={step.id} className="flex flex-col items-center">
                                    <div
                                        className={`w-16 h-16 rounded-full flex items-center justify-center relative z-10 transition-colors duration-300 ${isCurrent
                                            ? 'bg-orange-600 text-white ring-4 ring-orange-100'
                                            : isPast
                                                ? 'bg-orange-600 text-white'
                                                : 'bg-white text-gray-300 border-2 border-gray-100'
                                            }`}
                                    >
                                        <Icon className="w-7 h-7" />
                                    </div>
                                    <div className="mt-4 text-center w-24">
                                        <p className={`text-sm font-bold ${isCurrent ? 'text-orange-600' : isPast ? 'text-gray-900' : 'text-gray-400'
                                            }`}>
                                            {step.label}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="mt-16 bg-gray-50 rounded-2xl p-6">
                    <h3 className="font-bold text-gray-900 mb-4 text-lg">Delivery Details</h3>
                    <div className="space-y-2 text-sm text-gray-700 font-medium">
                        <p><span className="text-gray-500">Name:</span> {order.customerName}</p>
                        <p><span className="text-gray-500">Address:</span> {order.customerAddress}</p>
                        <p><span className="text-gray-500">Phone:</span> {order.customerPhone}</p>
                    </div>
                </div>

            </div>
        </div>
    );
}
