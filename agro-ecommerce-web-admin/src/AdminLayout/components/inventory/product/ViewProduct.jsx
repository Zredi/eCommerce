import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const BASE_URL = (import.meta.env.VITE_ECOMMERCE_API_ENDPOINT || "").replace('/api/v1', '');

const ViewProduct = () => {
    const navigate = useNavigate();
    const selectedProduct = useSelector(state => state.product.selectedProduct);
    
    const images = selectedProduct?.images || [];

    const [currentIndex, setCurrentIndex] = useState(0);

    const handlePrev = () => {
        setCurrentIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1));
    };

    const handleNext = () => {
        setCurrentIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));
    };

    if (!selectedProduct) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-800">Product not found</h2>
                    <button
                        onClick={() => navigate('/products')}
                        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                    >
                        Back to Products
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="container mt-5 mx-auto px-4">
            <div className="bg-white rounded-lg shadow-lg max-w-4xl mx-auto">
                <div className="border-b border-gray-200 px-6 py-4">
                    <h2 className="text-2xl font-bold text-gray-800">Product Details</h2>
                </div>
                
                <div className="p-6">
                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="relative w-full">
                            <div className="overflow-hidden rounded-lg shadow-md aspect-square">
                                <img
                                    src={images.length > 0 ? `${BASE_URL}${images[currentIndex]?.downloadUrl}`:"https://icrier.org/wp-content/uploads/2022/12/media-Event-Image-Not-Found.jpg"}
                                    alt={`Product Image`}
                                    className="w-full h-full object-cover"
                                    onError={(e) => e.target.src = "https://icrier.org/wp-content/uploads/2022/12/media-Event-Image-Not-Found.jpg"}
                                />
                            </div>

                            {images.length > 1 && (
                                <>
                                    <button
                                        onClick={handlePrev}
                                        className="absolute top-1/2 -left-4 transform -translate-y-1/2 bg-white text-gray-800 p-2 rounded-full shadow-lg hover:bg-gray-100 transition-all"
                                    >
                                        &#60;
                                    </button>
                                    <button
                                        onClick={handleNext}
                                        className="absolute top-1/2 -right-4 transform -translate-y-1/2 bg-white text-gray-800 p-2 rounded-full shadow-lg hover:bg-gray-100 transition-all"
                                    >
                                        &#62;
                                    </button>
                                </>
                            )}
                        </div>
                        
                        <div className="space-y-6">
                            <div className="border-b pb-4">
                                <h1 className="text-2xl font-bold text-gray-900 mb-2">{selectedProduct.name}</h1>
                                <p className="text-lg text-gray-600">{selectedProduct.brand}</p>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-700 font-medium">Category</span>
                                    <span className="text-gray-600">{selectedProduct.subCategory.category.name}</span>
                                </div>
                                
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-700 font-medium">SubCategory</span>
                                    <span className="text-gray-600">{selectedProduct.subCategory.name}</span>
                                </div>
                                
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-700 font-medium">Price</span>
                                    <span className="text-xl font-semibold text-green-600">₹{selectedProduct.price}</span>
                                </div>
                                
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-700 font-medium">Popular</span>
                                    <span className={`px-3 py-1 rounded-full text-sm ${selectedProduct.isPopular === 'true' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                        {selectedProduct.isPopular === 'true' ? 'Yes' : 'No'}
                                    </span>
                                </div>
                            </div>

                            <div className="border-t pt-4">
                                <h3 className="text-gray-700 font-medium mb-2">Description</h3>
                                <p className="text-gray-600 leading-relaxed">{selectedProduct.description}</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="mt-8 flex justify-end space-x-4 border-t pt-6">
                        <button
                            onClick={() => navigate(-1)}
                            className="px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                        >
                            Back
                        </button>
                        <button
                            onClick={() => navigate(`/admin/edit-product`)}
                            className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                        >
                            Edit Product
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ViewProduct;