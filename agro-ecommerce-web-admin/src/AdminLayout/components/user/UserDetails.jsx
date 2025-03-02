import React from 'react'
import { FaEye } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom';
import { setSelectedOrder } from '../../../features/OrderReducer';

function UserDetails() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const user = useSelector((state) => state.user.selectedUser);

    const handleViewOrder = (order) => {
        dispatch(setSelectedOrder(order));
        navigate('/view-order');
    }

    if (!user) {
        return <div className="text-center mt-32">Loading user details...</div>;
    }

    return (
        <div className="container mx-auto mt-20 px-4 py-8 space-y-6">
            <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow">
                <h5 className="text-xl font-bold mb-4">
                    Personal Information
                </h5>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <p className="text-sm text-gray-600">First Name</p>
                        <p className="text-base font-medium">{user.firstName}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-600">Last Name</p>
                        <p className="text-base font-medium">{user.lastName}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-600">Email</p>
                        <p className="text-base font-medium">{user.email}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-600">Phone Number</p>
                        <p className="text-base font-medium">{user.phoneNo}</p>
                    </div>
                </div>
            </div>
            
            {user.role === "ROLE_USER" &&
            <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow">
                <h5 className="text-xl font-bold mb-4">
                    Order History
                </h5>
                <div className="overflow-x-auto">
                    <table className="min-w-full table-auto">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">SL</th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Order Id</th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Order Date</th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Total Amount</th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Address</th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Status</th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {user.orders.length > 0 ? user.orders.map((order, index) => (
                                <tr key={order.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 text-sm text-gray-900">{index + 1}</td>
                                    <td className="px-6 py-4 text-sm text-gray-900">{order.id}</td>
                                    <td className="px-6 py-4 text-sm text-gray-900">{order.orderDate}</td>
                                    <td className="px-6 py-4 text-sm text-gray-900">{order.totalAmount}</td>
                                    <td className="px-6 py-4 text-sm text-gray-900">{order.addressId}</td>
                                    <td className="px-6 py-4 text-sm text-gray-900">{order.status}</td>
                                    <td className="px-6 py-4">
                                        <button 
                                            onClick={() => handleViewOrder(order)}
                                            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                                            title="View"
                                        >
                                            <FaEye size={20} className="fill-black" />
                                        </button>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                                        No orders found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            }
        </div>
    )
}

export default UserDetails