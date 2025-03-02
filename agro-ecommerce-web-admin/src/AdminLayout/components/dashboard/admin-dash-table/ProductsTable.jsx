import { IconButton, Tooltip } from '@mui/material'
import React, { useEffect } from 'react'
import { FaEdit, FaEye } from 'react-icons/fa'
import { RiDeleteBin5Fill } from 'react-icons/ri'
import { useDispatch, useSelector } from 'react-redux'
import { deleteProduct, fetchProducts, setSelectedProduct } from '../../../../features/ProductReducer'
import { useNavigate } from 'react-router-dom'

const BASE_URL = (import.meta.env.VITE_ECOMMERCE_API_ENDPOINT || "").replace('/api/v1', '');

function ProductsTable() {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { products, loading } = useSelector((state) => state.product);

    useEffect(() => {
        dispatch(fetchProducts());
    }, [dispatch]);

    const popularProducts = products.filter((product) => product.isPopular === 'true');

    const handleDeleteProduct = (id) => {
        if (window.confirm('Are you sure you want to delete this Product?')) {
            dispatch(deleteProduct(id));
        }

    }

    const handleViewProduct = (product) => {
        dispatch(setSelectedProduct(product));
        navigate(`/view-product`);
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
        <h2 className="text-xl font-bold text-white">Popular Products</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-200">
            <tr>
              {['SL', 'Product', 'Category', 'Subcategory', 'Description', 'Price', 'Actions'].map(header => (
                <th key={header} className="p-4 text-left text-sm font-semibold text-gray-700 tracking-wide">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {popularProducts?.length > 0 ? popularProducts.map((product, index) => (
              <tr 
                key={product.id} 
                className="hover:bg-gray-100 transition-all duration-200 transform"
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
                <td className="p-4 text-gray-600">{product.category?.name || 'N/A'}</td>
                <td className="p-4 text-gray-600">{product.subCategory?.name || 'N/A'}</td>
                <td className="p-4 text-gray-600">
                  {product.description?.length > 45 ? `${product.description.slice(0, 45)}...` : product.description || 'N/A'}
                </td>
                <td className="p-4 font-medium text-gray-800">₹{product.price}</td>
                <td className="p-4">
                  <div className="flex gap-2">
                    <Tooltip title="View">
                      <IconButton onClick={() => handleViewProduct(product)} className="hover:bg-blue-100">
                        <FaEye className="text-blue-600" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton onClick={() => handleDeleteProduct(product.id)} className="hover:bg-red-100">
                        <RiDeleteBin5Fill className="text-red-600" />
                      </IconButton>
                    </Tooltip>
                  </div>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan="7" className="p-8 text-center text-gray-500">
                  <div className="flex flex-col items-center gap-2">
                    <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                    </svg>
                    <span>No popular products found</span>
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

export default ProductsTable