import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchProducts } from '../../../features/ProductReducer';
import { IconButton, Tooltip } from '@mui/material';
import { FaPrint } from 'react-icons/fa';
import { fetchAllStocks } from '../../../features/StockReducer';

const BASE_URL = (import.meta.env.VITE_ECOMMERCE_API_ENDPOINT || "").replace('/api/v1', '');

function Inventory() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [filter, setFilter] = useState('all');
    const printRef = useRef();

    const { products, loading: productsLoading, error: productsError } = useSelector((state) => state.product);
    const { stocks, loading: stockLoading, error: stockError } = useSelector((state) => state.stock);

    useEffect(() => {
        dispatch(fetchProducts());
        dispatch(fetchAllStocks());
    }, [dispatch]);

    const handlePrint = () => {
        const printContent = printRef.current;
        const originalContent = document.body.innerHTML;
        const originalTitle = document.title;

        document.title = `inventory ${new Date().toLocaleDateString()}.pdf`;
        
        document.body.innerHTML = printContent.innerHTML;
        window.print();

        document.body.innerHTML = originalContent;
        document.title = originalTitle;
        window.location.reload();
    };

    const filteredTableData = stocks?.filter((item) => {
        const matchesSearch = item.product?.name?.toLowerCase().includes(searchQuery.toLowerCase());
        return filter === 'all'
            ? matchesSearch
            : filter === 'stock'
                ? item.currentStock < 10 && matchesSearch
                : matchesSearch;
    });

    if (productsLoading || stockLoading)
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="h-20 w-20 animate-spin rounded-full border-8 border-gray-300 border-t-green-600"></div>
            </div>
        );

    if (productsError || stockError) {
        return (
            <div className="px-2 text-center">
                <div className="flex flex-col justify-center items-center">
                    <h1 className="text-3xl font-extrabold text-red-500">Session Expired!</h1>
                    <p className="text-xl mt-5 font-medium text-gray-800">Please login again</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-6 py-5">
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-extrabold bg-gradient-to-r from-[#5A9A7A] to-[#2DD4BF] bg-clip-text text-transparent">
                Inventory Stock
            </h2>
            <Tooltip title="Print">
                <IconButton 
                    onClick={handlePrint}
                    className="bg-gradient-to-r from-[#5A9A7A] to-[#2DD4BF] text-white p-2 rounded-lg shadow-md hover:from-[#2DD4BF] hover:to-[#5A9A7A] transform hover:scale-105 transition-all duration-200"
                >
                    <FaPrint className="text-white" />
                </IconButton>
            </Tooltip>
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
                        className="w-full py-2.5 pl-10 pr-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#2DD4BF] focus:border-transparent outline-none transition-all duration-200"
                        type="search"
                        placeholder="Search Product Stock..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <select
                    className="w-full md:w-48 py-2.5 px-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#2DD4BF] focus:border-transparent outline-none transition-all duration-200 bg-white"
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                >
                    <option value="all">All Items</option>
                    <option value="name">Sort by Name</option>
                    <option value="stock">Low Stock</option>
                </select>
            </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
            <div ref={printRef}>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-200">
                            <tr>
                                {['SL', 'Product', 'Current Stock'].map((header) => (
                                    <th key={header} className="p-4 text-left text-sm font-semibold text-gray-700 tracking-wide">
                                        {header}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredTableData?.length > 0 ? filteredTableData.map((item, index) => (
                                <tr 
                                    key={item.id} 
                                    className="hover:bg-gray-100 transition-all duration-200 transform"
                                >
                                    <td className="p-4 text-gray-600">{index + 1}</td>
                                    <td className="p-4">
                                        <div>
                                            <p className="font-medium text-gray-800">{item.product?.name}</p>
                                            <p className="text-xs text-gray-500">{item.product?.brand}</p>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                            item.currentStock < 10 
                                                ? 'bg-red-100 text-red-800' 
                                                : 'bg-green-100 text-green-800'
                                        }`}>
                                            {item.currentStock}
                                        </span>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="3" className="p-8 text-center text-gray-500">
                                        <div className="flex flex-col items-center gap-2">
                                            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                                            </svg>
                                            <span>No inventory stocks found</span>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
    );
}

export default Inventory;
