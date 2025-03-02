import { IconButton, Tooltip } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { FaEdit, FaEye } from 'react-icons/fa'
import { RiDeleteBin5Fill } from 'react-icons/ri'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { deleteProduct, fetchProducts, setSelectedProduct } from '../../../features/ProductReducer'

const BASE_URL = (import.meta.env.VITE_ECOMMERCE_API_ENDPOINT || "").replace('/api/v1', '');

function Products() {

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { products, loading, error } = useSelector((state) => state.product);

  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const [filteredProducts, setFilteredProducts] = useState([]);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);


  useEffect(() => {
    let result = [...products];

    if (filter === 'popular') {
      result = result.filter((product) => product.isPopular === 'true');
    } else if (filter === 'high') {
      result = result.sort((a, b) => b.price - a.price);
    } else if (filter === 'low') {
      result = result.sort((a, b) => a.price - b.price);
    } else if (filter === 'name') {
      result = result.sort((a, b) => a.name.localeCompare(b.name));
    }

    if (searchQuery) {
      result = result.filter((product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredProducts(result);
  }, [products, searchQuery, filter]);


  const handleDeleteProduct = (id) => {
    if (window.confirm('Are you sure you want to delete this Product?')) {
      dispatch(deleteProduct(id));
    }

  }

  const handleViewProduct = (product) => {
    dispatch(setSelectedProduct(product));
    navigate(`/admin/view-product`);
  }

  const handleAddProduct = () => {
    dispatch(setSelectedProduct(null));
    navigate(`/admin/add-product`);
  }

  if (loading)
    return <div className="flex justify-center items-center h-screen">
      <div className="h-20 w-20 animate-spin rounded-full border-8 border-gray-300 border-t-green-600"></div>
    </div>;
  if (error){
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
          Products
        </h2>
        <button
          onClick={handleAddProduct}
          className="bg-gradient-to-r from-[#5A9A7A] to-[#2DD4BF] text-white px-6 py-2 rounded-lg shadow-md hover:from-[#2DD4BF] hover:to-[#5A9A7A] transform hover:scale-105 transition-all duration-200 cursor-pointer"
        >
          + Add Product
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
              className="w-full py-2.5 pl-10 pr-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#2DD4BF] focus:border-transparent outline-none transition-all duration-200"
              type="search"
              placeholder="Search product..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <select
            className="w-full md:w-48 py-2.5 px-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#2DD4BF] focus:border-transparent outline-none transition-all duration-200 bg-white"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">All Products</option>
            <option value="name">Sort by Name</option>
            <option value="popular">Popular Items</option>
            <option value="high">Price: High to Low</option>
            <option value="low">Price: Low to High</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-200">
              <tr>
                {['SL', 'Product', 'Category', 'SubCategory', 'Description', 'Price', 'Popular', 'Actions'].map((header) => (
                  <th key={header} className="p-4 text-left text-sm font-semibold text-gray-700 tracking-wide">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredProducts.length > 0 ? filteredProducts.map((product, index) => (
                <tr 
                  key={product.id} 
                  className="hover:bg-gray-100 transition-all duration-200 transform "
                >
                  <td className="p-4 text-gray-600">{index + 1}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <img 
                        src={`${BASE_URL}${product.images[0]?.downloadUrl}`} 
                        alt={product.name} 
                        className="rounded-lg w-12 h-12 object-cover shadow-sm"
                        onError={(e) => e.target.src = "https://icrier.org/wp-content/uploads/2022/12/media-Event-Image-Not-Found.jpg"}
                      />
                      <div>
                        <p className="font-medium text-gray-800">{product.name}</p>
                        <p className="text-xs text-gray-500">{product.brand}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-gray-600">{product.subCategory.category.name}</td>
                  <td className="p-4 text-gray-600">{product.subCategory.name}</td>
                  <td className="p-4 text-gray-600">
                    {product.description.length > 45 ? `${product.description.slice(0, 45)}...` : product.description}
                  </td>
                  <td className="p-4 text-gray-600 font-medium">₹{product.price}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${product.isPopular === 'true' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                      {product.isPopular === 'true' ? 'Yes' : 'No'}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <Tooltip title="View">
                        <IconButton 
                          onClick={() => handleViewProduct(product)}
                          className="hover:bg-blue-100"
                        >
                          <FaEye className="text-blue-600" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton 
                          onClick={() => handleDeleteProduct(product.id)}
                          className="hover:bg-red-100"
                        >
                          <RiDeleteBin5Fill className="text-red-600" />
                        </IconButton>
                      </Tooltip>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="8" className="p-8 text-center text-gray-500">
                    <div className="flex flex-col items-center gap-2">
                      <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                      </svg>
                      <span>No products found</span>
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

export default Products