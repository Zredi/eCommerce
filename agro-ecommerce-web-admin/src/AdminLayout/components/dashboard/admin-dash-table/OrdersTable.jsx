import { IconButton, Tooltip } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { FaEye } from 'react-icons/fa'
import { useDispatch, useSelector } from 'react-redux';
import { subDays } from 'rsuite/esm/internals/utils/date';
import { fetchAddressById } from '../../../../features/checkoutReducer';
import { setSelectedOrder } from '../../../../features/OrderReducer';
import { useNavigate } from 'react-router-dom';

function OrdersTable() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { orders, loading } = useSelector((state) => state.order);
    const [addressCache, setAddressCache] = useState({});

    const oneWeekAgo = subDays(new Date(), 7);
    const recentOrders = orders?.filter((order) => {
        const orderDate = new Date(order.orderDate);
        return orderDate >= oneWeekAgo;
    });

    useEffect(() => {
        recentOrders?.forEach((order) => {
            if (order.addressId && !addressCache[order.addressId]) {
                dispatch(fetchAddressById(order.addressId))
                    .unwrap()
                    .then(address => {
                        setAddressCache(prev => ({ ...prev, [order.addressId]: address }))
                    })
                    .catch(error => {
                        setAddressCache(prev => ({ ...prev, [order.addressId]: { error: 'Failed to load address' } }))
                    })
            }
        })
    }, [recentOrders, dispatch]);

    const renderAddress = (addressId) => {
        const address = addressCache[addressId];

        if (!address) {
            return <span className="text-gray-400">Loading...</span>;
        }

        if (address.error) {
            return <span className="text-red-500">Address not found</span>;
        }

        return (
            <div>
                <div className="font-semibold">{address.name}</div>
                <div>
                    {address.street}, {address.city}, {address.state}, {address.zipCode}
                </div>
            </div>
        );
    };

    const handleViewOrder = (order) => {
        dispatch(setSelectedOrder(order));
        navigate('/admin/view-order');
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="h-20 w-20 animate-spin rounded-full border-8 border-gray-300 border-t-green-600"></div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
            <div className="bg-gradient-to-r from-[#5A9A7A] to-[#2DD4BF] p-4">
                <h2 className="text-xl font-bold text-white">Recent Orders</h2>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-200">
                        <tr>
                            {['SL', 'Order ID', 'Order Date', 'Products', 'Total Amount', 'Address', 'Status', 'Actions'].map(header => (
                                <th key={header} className="p-4 text-left text-sm font-semibold text-gray-700 tracking-wide">
                                    {header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {recentOrders?.length > 0 ? recentOrders.map((order, index) => (
                            <tr
                                key={order.id}
                                className="hover:bg-gray-100 transition-all duration-200 transform"
                            >
                                <td className="p-4 text-gray-600">{index + 1}</td>
                                <td className="p-4 text-gray-800">{order.id}</td>
                                <td className="p-4 text-gray-600">{new Date(order.orderDate).toLocaleDateString()}</td>
                                <td className="p-4 text-gray-800">{order.items.map(product => product.productName).join(', ')}</td>
                                <td className="p-4 font-medium text-gray-800">₹{order.totalAmount}</td>
                                <td className="p-4">{renderAddress(order.addressId)}</td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 rounded-full text-xs ${order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                            order.status === 'processing' ? 'bg-orange-100 text-orange-800' :
                                                order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                                                    order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                                                        'bg-red-100 text-red-800'
                                        }`}>
                                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                    </span>
                                </td>
                                <td className="p-4">
                                    <Tooltip title="View">
                                        <IconButton onClick={() => handleViewOrder(order)} className="hover:bg-blue-100">
                                            <FaEye className="text-blue-600" />
                                        </IconButton>
                                    </Tooltip>
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan="8" className="p-8 text-center text-gray-500">
                                    <div className="flex flex-col items-center gap-2">
                                        <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                                        </svg>
                                        <span>No recent orders found</span>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default OrdersTable