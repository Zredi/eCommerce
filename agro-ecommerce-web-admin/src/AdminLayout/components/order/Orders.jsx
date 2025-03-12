import { IconButton, MenuItem, Select, Tab, Tabs, Tooltip } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { FaEye } from 'react-icons/fa'
import { useDispatch, useSelector } from 'react-redux'
import { fetchOrders, setSelectedOrder } from '../../../features/OrderReducer';
import { fetchAddressById } from '../../../features/checkoutReducer';
import { useNavigate } from 'react-router-dom';
import { getAllReturns, updateReturnStatus } from '../../../features/ReturnReducer';


const ORDER_STATUSES = {
    PENDING: 'pending',
    PROCESSING: 'processing',
    SHIPPED: 'shipped',
    DELIVERED: 'delivered',
    CANCELED: 'canceled'
};

const RETURN_STATUSES = {
    PENDING: 'pending',
    APPROVED: 'approved',
    COMPLETED: 'completed'
};

const ORDER_FILTERS = [
    { value: 'all', label: 'All Orders' },
    { value: 'new', label: 'New Orders' },
    ...Object.entries(ORDER_STATUSES).map(([key, value]) => ({
        value,
        label: value.charAt(0).toUpperCase() + value.slice(1)
    }))
];

const RETURN_FILTERS = [
    { value: 'all', label: 'All Returns' },
    { value: 'new', label: 'New Returns' },
    ...Object.entries(RETURN_STATUSES).map(([key, value]) => ({
        value,
        label: value.charAt(0).toUpperCase() + value.slice(1)
    }))];

function Order() {

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { orders, loading, error } = useSelector((state) => state.order);
    const { returns } = useSelector((state) => state.return);

    const [filter, setFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [filteredReturns, setFilteredReturns] = useState([]);
    const [addressCache, setAddressCache] = useState({});
    const [activeTab, setActiveTab] = useState(0);
    useEffect(() => {
        dispatch(fetchOrders());
        dispatch(getAllReturns());
    }, [dispatch]);

    console.log(orders);
    console.log(returns);

    useEffect(() => {
        if (activeTab === 0) {
            let result = [...orders];

            if (Object.values(ORDER_STATUSES).includes(filter)) {
                result = result.filter((order) => order.status.toLowerCase() === filter);
            }

            if (filter === 'new') {
                result.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));
            }

            if (searchQuery.trim() !== '') {
                result = result.filter((order) =>
                    order.id.toString().includes(searchQuery)
                );
            }

            setFilteredOrders(result);
        } else {
            let result = [...returns];

            if (Object.values(RETURN_STATUSES).includes(filter)) {
                result = result.filter((ret) => ret.status === filter);
            }
            if (filter === 'new') {
                result.sort((a, b) => new Date(b.requestDate) - new Date(a.requestDate));
            }

            if (searchQuery.trim() !== '') {
                result = result.filter((ret) =>
                    ret.orderId.toString().includes(searchQuery) ||
                    ret.userId.toString().includes(searchQuery)
                );
            }

            setFilteredReturns(result);
        }

    }, [orders, returns, filter, searchQuery, activeTab]);

    useEffect(() => {
        orders?.forEach((order) => {
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
    }, [orders, dispatch]);

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

    const handleStatusChange = async (returnId, newStatus) => {
        try {
            await dispatch(updateReturnStatus({ returnId, status: newStatus })).unwrap();
            dispatch(getAllReturns());
        } catch (error) {
            console.error('Failed to update return status:', error);
        }
    };


    const handleViewOrder = (order) => {
        dispatch(setSelectedOrder(order));
        navigate('/admin/view-order');
    }

    const handleViewReturn = (returnItem) => {
        dispatch(setSelectedOrder(returnItem));
        navigate('/admin/view-order');
    }

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
    };

    if (loading)
        return <div className="flex justify-center items-center h-screen">
            <div className="h-20 w-20 animate-spin rounded-full border-8 border-gray-300 border-t-green-600"></div>
        </div>;
    if (error)
        return (
            <div className="px-2 text-center">
                <div className="flex flex-col justify-center items-center">
                    <h1 className="text-3xl font-extrabold text-red-500">Session Expired!</h1>
                    <p className="text-xl mt-5 font-medium text-gray-800">Please login again</p>
                </div>
            </div>
        );

    return (
        <div className="container mx-auto px-6 py-5">
            <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-extrabold bg-gradient-to-r from-[#5A9A7A] to-[#2DD4BF] bg-clip-text text-transparent">
                Order Management
            </h2>
            </div>
            <Tabs
                value={activeTab}
                onChange={handleTabChange}
                aria-label="Orders and Returns Tabs"
                sx={{
                    '& .MuiTabs-indicator': { backgroundColor: '#2DD4BF' },
                    '& .Mui-selected': { color: '#2DD4BF !important', fontWeight: 'bold' },
                    '& .MuiTab-root': { textTransform: 'none', fontSize: '1rem', padding: '10px 20px' },
                }}
                className="bg-gray-50 rounded-lg shadow-sm mb-2"
            >
                <Tab label="Orders" />
                <Tab label="Returns" />
            </Tabs>

            <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border border-gray-100">
                <div className="flex flex-col md:flex-row gap-4 items-center">
                    <div className="relative flex-1">
                        <svg className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" 
                             xmlns="http://www.w3.org/2000/svg" 
                             viewBox="0 0 20 20" 
                             fill="currentColor">
                            <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                        </svg>
                        <input
                            className="w-full py-2.5 pl-10 pr-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#2DD4BF] focus:border-transparent outline-none transition-all duration-200"
                            type="search"
                            placeholder={`Search ${activeTab === 0 ? 'Orders' : 'Returns'}...`}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <select
                        className="w-full md:w-48 py-2.5 px-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#2DD4BF] focus:border-transparent outline-none transition-all duration-200 bg-white"
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                    >
                        {(activeTab === 0 ? ORDER_FILTERS : RETURN_FILTERS).map(({ value, label }) => (
                            <option key={value} value={value}>{label}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-200">
                            <tr>
                                {activeTab === 0
                                    ? ['SL', 'Order ID', 'Order Date', 'Products', 'Total Amount', 'Address', 'Status', 'Actions'].map(header => (
                                        <th key={header} className="p-4 text-left text-sm font-semibold text-gray-700 tracking-wide">
                                            {header}
                                        </th>
                                    ))
                                    : ['SL', 'Order ID', 'User ID', 'Reason', 'Requested Date', 'Status'].map(header => (
                                        <th key={header} className="p-4 text-left text-sm font-semibold text-gray-700 tracking-wide">
                                            {header}
                                        </th>
                                    ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {activeTab === 0 ? (
                                filteredOrders.map((order, index) => (
                                    <tr 
                                        key={order.id} 
                                        className="hover:bg-gray-100 transition-all duration-200 transform"
                                    >
                                        <td className="p-4 text-gray-600">{index + 1}</td>
                                        <td className="p-4 text-gray-800">{order.id}</td>
                                        <td className="p-4 text-gray-600">{new Date(order.orderDate).toLocaleDateString()}</td>
                                        <td className="p-4 text-gray-800">{order.items.map(product => product.productName).join(', ')}</td>
                                        <td className="p-4 font-medium text-gray-800">₹{order.totalAmount}</td>
                                        <td className="p-4 text-gray-600">{renderAddress(order.addressId)}</td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 rounded-full text-xs ${
                                                order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
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
                                                <IconButton onClick={() => handleViewOrder(order)} className="hover:bg-purple-100">
                                                    <FaEye className="text-blue-600" />
                                                </IconButton>
                                            </Tooltip>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                filteredReturns.map((returnItem, index) => (
                                    <tr 
                                        key={returnItem.id} 
                                        className="hover:bg-gray-50 transition-all duration-200 transform hover:-translate-y-0.5"
                                    >
                                        <td className="p-4 text-gray-600">{index + 1}</td>
                                        <td className="p-4 text-gray-800">{returnItem.orderId}</td>
                                        <td className="p-4 text-gray-600">{returnItem.userId}</td>
                                        <td className="p-4 text-gray-600">{returnItem.reason}</td>
                                        <td className="p-4 text-gray-600">
                                            {new Date(returnItem.requestDate).toLocaleString('en-GB', { 
                                                day: '2-digit', month: '2-digit', year: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true 
                                            })}
                                        </td>
                                        <td className="p-4">
                                            <Select
                                                value={returnItem.status}
                                                onChange={(e) => handleStatusChange(returnItem.id, e.target.value)}
                                                size="small"
                                                sx={{
                                                    width: 130,
                                                    '& .MuiSelect-select': {
                                                        padding: '8px 12px',
                                                        borderRadius: '4px',
                                                        backgroundColor: returnItem.status === 'pending' ? '#FEF9C3' :
                                                                         returnItem.status === 'approved' ? '#DCFCE7' :
                                                                         returnItem.status === 'completed' ? '#DBEAFE' : '#F3F4F6',
                                                        color: returnItem.status === 'pending' ? '#854D0E' :
                                                               returnItem.status === 'approved' ? '#166534' :
                                                               returnItem.status === 'completed' ? '#1E40AF' : '#1F2937'
                                                    }
                                                }}
                                            >
                                                {Object.values(RETURN_STATUSES).map(status => (
                                                    <MenuItem
                                                        key={status}
                                                        value={status}
                                                        sx={{ textTransform: 'capitalize' }}
                                                    >
                                                        {status.charAt(0).toUpperCase() + status.slice(1)}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </td>
                                    </tr>
                                ))
                            )}
                            {((activeTab === 0 && filteredOrders.length === 0) || (activeTab === 1 && filteredReturns.length === 0)) && (
                                <tr>
                                    <td colSpan={activeTab === 0 ? 8 : 6} className="p-8 text-center text-gray-500">
                                        <div className="flex flex-col items-center gap-2">
                                            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                                            </svg>
                                            <span>No {activeTab === 0 ? 'orders' : 'returns'} found</span>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default Order