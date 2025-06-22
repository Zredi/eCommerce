
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductsByCategory, fetchProductsBySubCategory, resetProducts, setSelectedProduct } from '../../../features/ProductReducer';
import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { addItemToCart, fetchUserCart } from '../../../features/cartReducer';
import { fetchSubcategoriesByCategory } from '../../../features/SubCategoryReducer';
import noProduct from "../../../assets/no-product-found.png";
import { showErrorSnackbar, showSuccessSnackbar } from '../../../utils/snackbar';

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
                showSuccessSnackbar(dispatch,"Item added to cart!");
            })
            .catch((error) => showErrorSnackbar(dispatch,`Failed to add to cart: ${error.message}`));
    };

    if (loading) return (
        <div className="flex justify-center items-center h-screen">
            <div className="h-16 w-16 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600"></div>
        </div>
    );

    return (
        <div className="container mt-20 mx-auto px-4 py-8">
            <div className='flex items-center gap-2'>
            <h2 className='text-xl font-medium'>{categoryName}</h2>
            <h2 className='text-lg font-light'> - {filteredProducts.length} items</h2>
            </div>
            <div className="flex flex-col md:flex-row gap-6">
                
                <div className="w-full mt-10 md:w-1/4 bg-white p-4 rounded-lg shadow-sm">
                    <h2 className="text-xl text-[#3498DB] font-semibold mb-4">Filters</h2>

                    <div className="mb-6">
                        <h3 className="text-lg font-medium mb-2">Categories</h3>
                        <div className="space-y-2">
                            <label className="flex items-center">
                                <input
                                    type="radio"
                                    name="subcategory"
                                    checked={selectedSubcategory === 'all'}
                                    onChange={() => setSelectedSubcategory('all')}
                                    className="mr-2 accent-blue-500 cursor-pointer"
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
                                        className="mr-2 accent-blue-500 cursor-pointer"
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
                            className="w-full h-2 bg-blue-400 rounded-lg appearance-none cursor-pointer custom-range"
                        />
                        <div className="flex justify-between text-sm mt-2">
                            <span>₹0</span>
                            <span>₹{priceRange[1]}</span>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-lg font-medium mb-2">Brands</h3>
                        <div className="space-y-2 ">
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
                                        className="mr-2 accent-blue-500 cursor-pointer"
                                    />
                                    {brand}
                                </label>
                            ))}
                        </div>
                    </div>
                </div>

                
                <div className="w-full md:w-3/4">
                        <div className="flex items-center justify-end gap-2 mb-2">
                            <span className="text-sm text-gray-600">Sort by:</span>
                            <select
                                className="py-2 px-3 border border-gray-300 rounded-lg focus:border-blue-400 focus:ring-1 focus:ring-blue-400 outline-none transition-colors"
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
                    

                    {/* Products Grid */}
                    {filteredProducts.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredProducts?.map((product, index) => (
                        <div
                            key={index}
                            className="bg-white rounded-xl border border-gray-200 overflow-hidden transition-all hover:shadow-lg flex flex-col"
                        >
                            {/* Image Section */}
                            <div
                                className="h-56 overflow-hidden cursor-pointer relative"
                                onClick={() => navigate(`/product-details/${product.id}`)}
                            >
                                <img
                                    src={`${BASE_URL}${product.images[0]?.downloadUrl}`}
                                    alt={product.name}
                                    className="w-full h-full p-3 object-contain transition-transform hover:scale-110"
                                    onError={(e) => e.target.src = "https://icrier.org/wp-content/uploads/2022/12/media-Event-Image-Not-Found.jpg"}
                                />
                                {/* Rating Chip */}
                                <div className="absolute top-2 right-2 bg-green-500 text-white text-xs font-semibold px-2 py-1 rounded-full flex items-center">
                                    <span>{product.averageRating || "N/A"}</span>
                                    <svg
                                        className="w-3 h-3 ml-1"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                </div>
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
                        <div className="flex flex-col items-center w-full bg-white shadow-sm rounded-lg justify-center">
                            <img
                                src={noProduct}
                                alt="No products"
                                className=" object-contain"
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