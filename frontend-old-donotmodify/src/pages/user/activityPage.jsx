import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { orderService, authService, paymentService } from '../../services/api';
import { FaBox, FaHistory, FaReceipt, FaMotorcycle, FaCheckCircle, FaTimesCircle, FaSpinner, FaUtensils, FaArrowRight } from 'react-icons/fa';

function Activity() {
    const [activeTab, setActiveTab] = useState('orders');
    const [orders, setOrders] = useState([]);
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const currentUser = authService.getCurrentUser();

    useEffect(() => {
        const fetchUserActivity = async () => {
            if (!currentUser) {
                setLoading(false);
                return;
            }

            try {
                setLoading(true);

                // Fetch orders
                const ordersResponse = await orderService.getUserOrders(currentUser.id);
                setOrders(ordersResponse.data);

                // Fetch payment history
                const paymentsResponse = await paymentService.getPaymentHistory(currentUser.id);
                setPayments(paymentsResponse.data);
            } catch (err) {
                console.error('Error fetching user activity:', err);
                setError('Failed to load your activity. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchUserActivity();
    }, [currentUser]);

    // Helper function to format date
    const formatDate = (dateString) => {
        const options = {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    // Helper function to get status icon
    const getStatusIcon = (status) => {
        switch (status.toLowerCase()) {
            case 'completed':
            case 'delivered':
            case 'paid':
                return <FaCheckCircle className="text-green-500" />;
            case 'cancelled':
            case 'failed':
                return <FaTimesCircle className="text-red-500" />;
            case 'processing':
            case 'preparing':
            case 'in_transit':
                return <FaSpinner className="text-yellow-500 animate-spin" />;
            case 'ready_for_pickup':
                return <FaUtensils className="text-blue-500" />;
            default:
                return <FaBox className="text-gray-500" />;
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                <span className="block sm:inline">{error}</span>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">Your Activity</h1>

            {/* Tabs */}
            <div className="flex border-b border-gray-700 mb-8">
                <button
                    className={`px-4 py-2 font-medium ${
                        activeTab === 'orders'
                            ? 'text-indigo-400 border-b-2 border-indigo-400'
                            : 'text-gray-400 hover:text-gray-300'
                    }`}
                    onClick={() => setActiveTab('orders')}
                >
                    <div className="flex items-center">
                        <FaBox className="mr-2" />
                        Orders
                    </div>
                </button>
                <button
                    className={`px-4 py-2 font-medium ${
                        activeTab === 'payments'
                            ? 'text-indigo-400 border-b-2 border-indigo-400'
                            : 'text-gray-400 hover:text-gray-300'
                    }`}
                    onClick={() => setActiveTab('payments')}
                >
                    <div className="flex items-center">
                        <FaReceipt className="mr-2" />
                        Payments
                    </div>
                </button>
            </div>

            {/* Orders Tab */}
            {activeTab === 'orders' && (
                <div>
                    {orders.length === 0 ? (
                        <div className="bg-white bg-opacity-5 rounded-xl p-8 text-center">
                            <h2 className="text-xl font-bold mb-4">No Orders Yet</h2>
                            <p className="text-gray-400 mb-6">You haven't placed any orders yet.</p>
                            <Link
                                to="/restaurants"
                                className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-6 rounded-lg"
                            >
                                Browse Restaurants
                            </Link>
                        </div>
                    ) : (
                        <div className="grid gap-6">
                            {orders.map(order => (
                                <div
                                    key={order.id}
                                    className="bg-white bg-opacity-5 rounded-xl overflow-hidden shadow-lg border border-gray-800"
                                >
                                    <div className="p-6">
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <h3 className="text-xl font-bold">{order.restaurantName}</h3>
                                                <p className="text-gray-400 text-sm">
                                                    Order #{order.id} • {formatDate(order.createdAt)}
                                                </p>
                                            </div>
                                            <div className="flex items-center bg-gray-800 px-3 py-1 rounded-full">
                                                {getStatusIcon(order.status)}
                                                <span className="ml-2 text-sm font-medium capitalize">
                                                    {order.status.toLowerCase().replace('_', ' ')}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="mb-4">
                                            <h4 className="font-medium mb-2">Items:</h4>
                                            <div className="space-y-2">
                                                {order.items.map(item => (
                                                    <div key={item.id} className="flex justify-between">
                                                        <div>
                                                            <span className="text-gray-300">{item.quantity}x </span>
                                                            {item.name}
                                                        </div>
                                                        <span>${(item.price * item.quantity).toFixed(2)}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="flex justify-between border-t border-gray-700 pt-4">
                                            <div className="text-gray-400">
                                                <div className="flex items-center">
                                                    <FaMotorcycle className="mr-2" />
                                                    {order.deliveryAddress}
                                                </div>
                                            </div>
                                            <div className="font-bold">
                                                Total: ${order.totalAmount.toFixed(2)}
                                            </div>
                                        </div>

                                        <div className="mt-4 flex justify-end">
                                            <Link
                                                to={`/orders/${order.id}/confirmation`}
                                                className="text-indigo-400 hover:text-indigo-300 flex items-center"
                                            >
                                                View Details
                                                <FaArrowRight className="ml-1" />
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Payments Tab */}
            {activeTab === 'payments' && (
                <div>
                    {payments.length === 0 ? (
                        <div className="bg-white bg-opacity-5 rounded-xl p-8 text-center">
                            <h2 className="text-xl font-bold mb-4">No Payment History</h2>
                            <p className="text-gray-400">You don't have any payment records yet.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full bg-white bg-opacity-5 rounded-xl overflow-hidden">
                                <thead>
                                    <tr className="border-b border-gray-700">
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                            Date
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                            Order ID
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                            Amount
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                            Method
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                            Status
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-700">
                                    {payments.map(payment => (
                                        <tr key={payment.id}>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {formatDate(payment.createdAt)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <Link
                                                    to={`/orders/${payment.orderId}/confirmation`}
                                                    className="text-indigo-400 hover:text-indigo-300"
                                                >
                                                    #{payment.orderId}
                                                </Link>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap font-medium">
                                                ${payment.amount.toFixed(2)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap capitalize">
                                                {payment.paymentMethod.toLowerCase().replace('_', ' ')}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    {getStatusIcon(payment.status)}
                                                    <span className="ml-2 capitalize">
                                                        {payment.status.toLowerCase().replace('_', ' ')}
                                                    </span>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default Activity;