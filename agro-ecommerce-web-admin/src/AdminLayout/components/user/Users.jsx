import { IconButton, Tooltip } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { FaEdit, FaEye } from 'react-icons/fa'
import { RiDeleteBin5Fill } from 'react-icons/ri'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { fetchUsers, setSelectedUser } from '../../../features/userReducer'

function Users() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { users, loading, error } = useSelector((state) => state.user);

    const [filter, setFilter] = useState("all");
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        dispatch(fetchUsers());
    }, [dispatch]);

    useEffect(() => {
        let result = [...users];

        if (filter === 'name') {
            result = result.sort((a, b) => a.name.localeCompare(b.name));
        }

        if (searchQuery) {
            result = result.filter((user) => 
                user.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                user.lastName.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        setFilteredUsers(result);
    }, [users, filter, searchQuery]);

    const handleViewUser = (user) => {
        dispatch(setSelectedUser(user));
        navigate("/admin/view-user");
    }

    const handleEditUser = (user)=>{
        dispatch(setSelectedUser(user));
        navigate("/admin/edit-user")
    }

    const handleCreateUser = ()=>{
        dispatch(setSelectedUser(null));
        navigate("/admin/create-user")
    }

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
                    Customer Management
                </h2>
                <button
                    onClick={handleCreateUser}
                    className="bg-gradient-to-r from-[#5A9A7A] to-[#2DD4BF] text-white px-6 py-2 rounded-lg shadow-md hover:from-[#2DD4BF] hover:to-[#5A9A7A] transform cursor-pointer hover:scale-105 transition-all duration-200"
                >
                    + Add Customer
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border border-gray-100">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="relative flex-1">
                        <svg className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" 
                             xmlns="http://www.w3.org/2000/svg" 
                             viewBox="0 0 20 20" 
                             fill="currentColor">
                            <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                        </svg>
                        <input
                            className="w-full py-2.5 pl-10 pr-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#5A9A7A] focus:border-transparent outline-none transition-all duration-200"
                            type="search"
                            placeholder="Search Customers..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="w-full md:w-48 py-2.5 px-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#5A9A7A] focus:border-transparent outline-none transition-all duration-200 bg-white"
                    >
                        <option value="all">All Customers</option>
                        <option value="name">Sort by Name</option>
                    </select>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-200">
                            <tr>
                                {['SL', 'ID', 'Name', 'Email', 'Phone', 'Actions'].map(header => (
                                    <th key={header} className="p-4 text-left text-sm font-semibold text-gray-700 tracking-wide">
                                        {header}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredUsers.length > 0 ? filteredUsers.map((user, index) => (
                                <tr 
                                    key={user.id} 
                                    className="hover:bg-gray-100 transition-all duration-200 transform"
                                >
                                    <td className="p-4 text-gray-600">{index + 1}</td>
                                    <td className="p-4 text-gray-800">{user.id}</td>
                                    <td className="p-4 font-medium text-gray-800">{user.firstName} {user.lastName}</td>
                                    <td className="p-4 text-gray-600">{user.email}</td>
                                    <td className="p-4 text-gray-600">{user.phoneNo}</td>
                                    <td className="p-4">
                                        <div className="flex gap-2">
                                            <Tooltip title="View">
                                                <IconButton onClick={() => handleViewUser(user)} className="hover:bg-blue-100">
                                                    <FaEye className="text-blue-600" />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Edit">
                                                <IconButton onClick={() => handleEditUser(user)} className="hover:bg-blue-100">
                                                    <FaEdit className="text-blue-600" />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Delete">
                                                <IconButton className="hover:bg-red-100">
                                                    <RiDeleteBin5Fill className="text-red-600" />
                                                </IconButton>
                                            </Tooltip>
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="6" className="p-8 text-center text-gray-500">
                                        <div className="flex flex-col items-center gap-2">
                                            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                                            </svg>
                                            <span>No customers found</span>
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

export default Users