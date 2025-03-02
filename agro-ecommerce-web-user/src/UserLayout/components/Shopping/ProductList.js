// import { useDispatch, useSelector } from 'react-redux';
// import { fetchProductsByCategory, fetchProductsBySubCategory, resetProducts, setSelectedProduct } from '../../../features/ProductReducer';
// import { useEffect, useState } from 'react';
// import { Link, useNavigate, useParams } from 'react-router-dom';
// import { addItemToCart, fetchUserCart } from '../../../features/cartReducer';
// import { fetchSubcategoriesByCategory } from '../../../features/SubCategoryReducer';

// const BASE_URL = process.env.REACT_APP_ECOMMERCE_API_ENDPOINT.replace('/api/v1', '');

// const ProductList = () => {

//     const navigate = useNavigate();
//     const { name: categoryName } = useParams();
//     const dispatch = useDispatch();
//     const { products, loading, error } = useSelector((state) => state.product);
//     const [searchQuery, setSearchQuery] = useState('');
//     const [filter, setFilter] = useState('all');
//     const [filteredProducts, setFilteredProducts] = useState([]);
//     const [selectedSubcategory, setSelectedSubcategory] = useState('all');
//     const { subCategories } = useSelector((state) => state.subCategory);
//     const userId = localStorage.getItem('userId');

//     useEffect(() => {
//         if (categoryName) {
//             dispatch(resetProducts());
//             dispatch(fetchProductsByCategory(categoryName));
//             dispatch(fetchSubcategoriesByCategory(categoryName));
//         }
//     }, [dispatch, categoryName]);

//     useEffect(() => {
//         if (!Array.isArray(products)) {
//             setFilteredProducts([]);
//             return;
//         }
//         let result = [...products];

//         if (filter === 'popular') {
//             result = result.filter((product) => product.isPopular === 'true');
//         } else if (filter === 'high') {
//             result = result.sort((a, b) => b.price - a.price);
//         } else if (filter === 'low') {
//             result = result.sort((a, b) => a.price - b.price);
//         } else if (filter === 'name') {
//             result = result.sort((a, b) => a.name.localeCompare(b.name));
//         }

//         if (searchQuery) {
//             result = result.filter((product) =>
//                 product.name.toLowerCase().includes(searchQuery.toLowerCase())
//             );
//         }

//         setFilteredProducts(result);
//     }, [products, searchQuery, filter]);

//     useEffect(() => {
//         if (categoryName) {
//             dispatch(resetProducts());
//             if (selectedSubcategory === 'all') {
//                 dispatch(fetchProductsByCategory(categoryName));
//             } else {
//                 dispatch(fetchProductsBySubCategory(selectedSubcategory));
//             }
//         }
//     }, [categoryName,selectedSubcategory, dispatch]);

//     const handleAddToCart = (productId) => {
//         dispatch(addItemToCart({ productId, quantity: 1 }))
//             .unwrap()
//             .then(() => {
//                 dispatch(fetchUserCart(userId));
//                 alert("Item added to cart!");
//             })
//             .catch((error) => alert(`Failed to add to cart: ${error.message}`));
//     };

//     const handleClick = (product) => {
//         dispatch(setSelectedProduct(product));
//         navigate('/user/product-details');
//     }

//     if (loading) return <div className="flex justify-center items-center h-screen">
//         <div className="h-20 w-20 animate-spin rounded-full border-8 border-gray-300 border-t-green-600"></div>
//     </div>;

//     return (
//         <div className='mt-20 px-20'>

//             <div className='flex space-x-5'>
//                 <h2 className="text-3xl font-bold">{categoryName}</h2>
//                 <select
//                     className="w-md pl-3 pr-1 transition duration-75 border border-gray-300 rounded-md shadow-sm h-11 focus:outline-none"
//                     value={filter}
//                     onChange={(e) => setFilter(e.target.value)}
//                 >
//                     <option value="all">All</option>
//                     <option value="name">Name</option>
//                     <option value="popular">Popularity</option>
//                     <option value="high">Price High to Low</option>
//                     <option value="low">Price Low to High</option>
//                 </select>
//                 <div className="relative max-w-sm">
//                     <input
//                         className="w-full py-2 px-4 border border-gray-300 rounded-md shadow-sm focus:outline-none"
//                         type="search"
//                         placeholder="Search..."
//                         value={searchQuery}
//                         onChange={(e) => setSearchQuery(e.target.value)}
//                     />

//                 </div>
//             </div>

//             {subCategories.length > 0 && (
//                     <div className="flex mt-3 flex-wrap gap-2">
//                         <button
//                             className={`px-4 py-2 rounded-full ${selectedSubcategory === 'all'
//                                     ? 'bg-green-500 text-white'
//                                     : 'bg-gray-200 text-gray-700'
//                                 } hover:bg-green-600 hover:text-white transition-colors`}
//                             onClick={() => setSelectedSubcategory('all')}
//                         >
//                             All
//                         </button>
//                         {subCategories.map((subcategory) => (
//                             <button
//                                 key={subcategory.id}
//                                 className={`px-4 py-2 rounded-full ${selectedSubcategory === subcategory.name
//                                         ? 'bg-green-500 text-white'
//                                         : 'bg-gray-200 text-gray-700'
//                                     } hover:bg-green-600 hover:text-white transition-colors`}
//                                 onClick={() => setSelectedSubcategory(subcategory.name)}
//                             >
//                                 {subcategory.name}
//                             </button>
//                         ))}
//                     </div>
//                 )}

//             {filteredProducts.length > 0 ? (
//                 <div className="mt-10 mb-20 grid grid-cols-4 gap-10">
//                     {filteredProducts.map((product, index) => (
//                         <div
//                             key={index}
//                             className="border border-gray-300 rounded-lg p-3 shadow-sm"
//                         >

//                             <img
//                                 src={`${BASE_URL}${product.images[0]?.downloadUrl}`}
//                                 alt={product.name}
//                                 className="w-full h-72 object-cover rounded-lg"
//                                 onClick={() => navigate(`/user/product-details/${product.id}`)}
//                                 onError={(e)=> e.target.src = "https://icrier.org/wp-content/uploads/2022/12/media-Event-Image-Not-Found.jpg"}
//                             />


//                             <h3 className="text-lg font-medium mt-2">{product.name}</h3>
//                             <p className="text-sm text-gray-500">{product.brand}</p>
//                             <div className="flex items-center justify-between mt-2">
//                                 <p className="font-bold">₹ {product.price}</p>
//                                 <button onClick={() => handleAddToCart(product.id)} className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
//                                     Add to Cart
//                                 </button>
//                             </div>
//                         </div>
//                     ))}
//                 </div>
//             ) : (
//                 <div className="w-full flex justify-center mt-20">
//                     <img
//                         src="https://nagadhat.com.bd/public/images/no-product-found.png"
//                         alt="No products"
//                         className="w-50 h-50 object-contain "
//                     />
//                 </div>
//             )}
//         </div>
//     );
// };

// export default ProductList;







import { useDispatch, useSelector } from 'react-redux';
import { fetchProductsByCategory, fetchProductsBySubCategory, resetProducts, setSelectedProduct } from '../../../features/ProductReducer';
import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { addItemToCart, fetchUserCart } from '../../../features/cartReducer';
import { fetchSubcategoriesByCategory } from '../../../features/SubCategoryReducer';

const BASE_URL = process.env.REACT_APP_ECOMMERCE_API_ENDPOINT.replace('/api/v1', '');

const ProductList = () => {
    const navigate = useNavigate();
    const { name: categoryName } = useParams();
    const dispatch = useDispatch();
    const { products, loading, error } = useSelector((state) => state.product);
    const [searchQuery, setSearchQuery] = useState('');
    const [filter, setFilter] = useState('all');
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [selectedSubcategory, setSelectedSubcategory] = useState('all');
    const [priceRange, setPriceRange] = useState([0, 150000]);
    const { subCategories } = useSelector((state) => state.subCategory);
    const userId = localStorage.getItem('userId');

    const safeProducts = Array.isArray(products) ? products : [];
    const brands = [...new Set(safeProducts.map(product => product.brand))];
    const [selectedBrands, setSelectedBrands] = useState([]);

    useEffect(() => {
        if (categoryName) {
            dispatch(resetProducts());
            dispatch(fetchProductsByCategory(categoryName));
            dispatch(fetchSubcategoriesByCategory(categoryName));
        }
    }, [dispatch, categoryName]);

    useEffect(() => {
        if (!Array.isArray(products)) {
            setFilteredProducts([]);
            return;
        }
        let result = [...products];

        if (selectedSubcategory !== 'all') {
            result = result.filter(product => product.subCategory.name === selectedSubcategory);
        }

        result = result.filter(product => 
            product.price >= priceRange[0] && product.price <= priceRange[1]
        );

        if (selectedBrands.length > 0) {
            result = result.filter(product => selectedBrands.includes(product.brand));
        }

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
    }, [products, searchQuery, filter, selectedSubcategory, priceRange, selectedBrands]);

    const handleAddToCart = (productId) => {
        dispatch(addItemToCart({ productId, quantity: 1 }))
            .unwrap()
            .then(() => {
                dispatch(fetchUserCart(userId));
                alert("Item added to cart!");
            })
            .catch((error) => alert(`Failed to add to cart: ${error.message}`));
    };

    if (loading) return (
        <div className="flex justify-center items-center h-screen">
            <div className="h-16 w-16 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600"></div>
        </div>
    );

    return (
        <div className="container mt-20 mx-auto px-4 py-8">
            <h2 className='text-xl font-bold'>{categoryName} - {filteredProducts.length} items</h2>
            <div className="flex flex-col md:flex-row gap-6">
                {/* Left Sidebar - Filters */}
                <div className="w-full mt-10 md:w-1/4 bg-white p-4 rounded-lg shadow-sm">
                    <h2 className="text-xl font-semibold mb-4">Filters</h2>

                    <div className="mb-6">
                        <h3 className="text-lg font-medium mb-2">Categories</h3>
                        <div className="space-y-2">
                            <label className="flex items-center">
                                <input
                                    type="radio"
                                    name="subcategory"
                                    checked={selectedSubcategory === 'all'}
                                    onChange={() => setSelectedSubcategory('all')}
                                    className="mr-2"
                                />
                                All
                            </label>
                            {subCategories.map((subcategory) => (
                                <label key={subcategory.id} className="flex items-center">
                                    <input
                                        type="radio"
                                        name="subcategory"
                                        checked={selectedSubcategory === subcategory.name}
                                        onChange={() => setSelectedSubcategory(subcategory.name)}
                                        className="mr-2"
                                    />
                                    {subcategory.name}
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="mb-6">
                        <h3 className="text-lg font-medium mb-2">Price Range</h3>
                        <input
                            type="range"
                            min="0"
                            max="150000"
                            value={priceRange[1]}
                            onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                            className="w-full"
                        />
                        <div className="flex justify-between text-sm mt-2">
                            <span>₹0</span>
                            <span>₹{priceRange[1]}</span>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-lg font-medium mb-2">Brands</h3>
                        <div className="space-y-2 max-h-40 overflow-y-auto">
                            {brands.map((brand) => (
                                <label key={brand} className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={selectedBrands.includes(brand)}
                                        onChange={(e) => {
                                            if (e.target.checked) {
                                                setSelectedBrands([...selectedBrands, brand]);
                                            } else {
                                                setSelectedBrands(selectedBrands.filter(b => b !== brand));
                                            }
                                        }}
                                        className="mr-2"
                                    />
                                    {brand}
                                </label>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Content - Products */}
                <div className="w-full md:w-3/4">
                    {/* Search and Sort */}
                    {/* <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4"> */}
                        {/* <div className="relative w-full sm:w-1/2">
                            <input
                                className="w-full py-2 pl-10 pr-4 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors"
                                type="search"
                                placeholder={`Search Product...`}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <svg 
                                className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" 
                                fill="none" 
                                stroke="currentColor" 
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div> */}
                        <div className="flex items-center justify-end gap-2 mb-2">
                            <span className="text-sm text-gray-600">Sort by:</span>
                            <select
                                className="py-2 px-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors"
                                value={filter}
                                onChange={(e) => setFilter(e.target.value)}
                            >
                                <option value="all">Relevance</option>
                                <option value="popular">Popularity</option>
                                <option value="low">Price: Low to High</option>
                                <option value="high">Price: High to Low</option>
                                <option value="name">Name: A to Z</option>
                            </select>
                        </div>
                    {/* </div> */}

                    {/* Products Grid */}
                    {filteredProducts.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredProducts.map((product,index) => (
                                <div
                                key={index}
                                className="bg-white rounded-xl border border-gray-200 overflow-hidden transition-all hover:shadow-lg flex flex-col"
                            >
                                {/* Image Section */}
                                <div
                                    className="h-56 overflow-hidden cursor-pointer"
                                    onClick={() => navigate(`/product-details/${product.id}`)}
                                >
                                    <img
                                        src={`${BASE_URL}${product.images[0]?.downloadUrl}`}
                                        alt={product.name}
                                        className="w-full h-full object-contain transition-transform hover:scale-110"
                                        onError={(e) => e.target.src = "https://icrier.org/wp-content/uploads/2022/12/media-Event-Image-Not-Found.jpg"}
                                    />
                                </div>
    
                                {/* Product Info */}
                                <div className="p-4 flex flex-col flex-grow">
                                    <h3 className="font-semibold text-lg mb-1 line-clamp-2">
                                        {product.name}
                                    </h3>
                                    <p className="text-gray-600 text-sm mb-3">{product.brand}</p>
    
                                    {/* Price and Button */}
                                    <div className="flex items-center justify-between mt-auto">
                                        <p className="text-amber-500 font-bold">₹ {product.price}</p>
                                        <button
                                            onClick={() => handleAddToCart(product.id)}
                                            className="bg-[#3498DB] text-white px-4 py-2 rounded-lg hover:bg-[#2980B9] transition-colors"
                                        >
                                            Add to Cart
                                        </button>
                                    </div>
                                </div>
                            </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-16">
                            <img
                                src="https://nagadhat.com.bd/public/images/no-product-found.png"
                                alt="No products"
                                className="w-64 h-64 object-contain"
                            />
                            {/* <p className="mt-4 text-gray-600 text-lg">No products found</p> */}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductList;