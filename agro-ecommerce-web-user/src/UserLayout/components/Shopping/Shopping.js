import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate, useOutletContext } from "react-router-dom";
import { clearMessage } from "../../../actions/message";
import { shoppingBags, shoppingBagToSaveApi } from "../../../features/ShoppingBagReducer";
import { userShoppingBagToSaveApi } from "../../../features/UserShoppingReducer";
import UploadFilesService from "../../../services/upload-file";
import { fetchProducts, setSelectedProduct } from "../../../features/ProductReducer";
import Slider from "react-slick";
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import banner1 from "../../../assets/ban1.jpg";
import banner2 from "../../../assets/ban2.jpg";
import banner3 from "../../../assets/ban3.jpg";
import seed from "../../../assets/seed.png";
import pesti from "../../../assets/pesticide.png";
import ferti from "../../../assets/fertilizer.png";
import ele from "../../../assets/electronics.png";
import fur from "../../../assets/sofa.png";
import app from "../../../assets/gadgets.png";
import { fetchCategories } from "../../../features/CategoryReducer";
import { addItemToCart, fetchUserCart } from "../../../features/cartReducer";
import { ChevronLeft, ChevronRight, Droplet, Leaf, PillBottle, Sun, Wheat } from "lucide-react";
import { FaComments, FaTruck, FaSearchengin, FaTruckFast } from "react-icons/fa6";
import { fetchSubCategories } from "../../../features/SubCategoryReducer";
import { motion } from "framer-motion";
import Login from '../../../UserLayout/Login';
import Register from '../../../UserLayout/Register';
const BASE_URL = process.env.REACT_APP_ECOMMERCE_API_ENDPOINT.replace('/api/v1', '');

function Shopping(propsFromWrapper) {
    const { products: productList } = useSelector((state) => state.product);
    const { categories: categoryList } = useSelector((state) => state.category);
    const { subCategories } = useSelector((state) => state.subCategory);
    const { authData } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const userId = localStorage.getItem("userId");
    const [popularProducts, setPopularProducts] = useState([]);
    const { loading } = useSelector((state) => state.cart);
    const [activeCategory, setActiveCategory] = useState(null);
    const scrollRef = useRef(null);
    const outletContext = useOutletContext();

    const {setShowAuthModal=()=>{}, setAuthMode=()=>{}, isLoggedIn=localStorage.getItem("isLoggedIn")||false}={...outletContext, ...propsFromWrapper};

    const scroll = (direction) => {
        if (scrollRef.current) {
            const scrollAmount = 200;
            if (direction === "left") {
                scrollRef.current.scrollLeft -= scrollAmount;
            } else {
                scrollRef.current.scrollLeft += scrollAmount;
            }
        }
    }



    const Banners = [
        { image: banner1, title: "Banner 1" },
        { image: banner2, title: "Banner 2" },
        { image: banner3, title: "Banner 3" },
    ];



    const features = [
        {
            icon: <FaTruckFast className="text-white text-3xl" />,
            title: "Free Shipping",
            description: "Free Door delivery for ALL ORDERS WORLD WIDE",
        },
        // {
        //     icon: <FaSearchengin className="text-white text-3xl" />,
        //     title: "Item Inspection",
        //     description:
        //         "Each item is inspected thoroughly before shipping. All products are 100% result oriented with best quality.",
        // },
        {
            icon: <FaTruck className="text-white text-3xl" />,
            title: "Fast Delivery",
            description:
                "Door delivery within 3-4 days on all PIN-CODES in India, Cash On Delivery available for Indian customers.",
        },
        {
            icon: <FaComments className="text-white text-3xl" />,
            title: "24/7 Customer Care",
            description:
                "Contact Us & WhatsApp from 10 am to 6:30 pm Mon-Sat Mob:+9 1234567890",
        },
    ];



    const categoryImages = {
        "Electronics": app,
        "Furniture": fur,
        "Appliances": ele
    };

    // const brandLogos = {
    //     "Advanta": adv,
    //     "Katyayani Organics": kat,
    //     "BASF": bas,
    // };


    const sliderSettings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 4000,
    };

    useEffect(() => {

        dispatch(fetchProducts({ token: authData?.token }))
            .then(({ payload }) => {
                const popular = payload.filter((product) => product.isPopular === 'true');
                setPopularProducts(popular);
            })
            .catch(() => {
                // setLoading(false);
            });

        dispatch(fetchCategories());
        dispatch(fetchSubCategories());
        console.log(categoryList);


    }, [dispatch, location,]);

    const handleAddToCart = (productId) => {
        if (!isLoggedIn) {
            setAuthMode('login');
            setShowAuthModal(true);
            return;
        }

        dispatch(addItemToCart({ productId, quantity: 1 }))
            .unwrap()
            .then(() => {
                dispatch(fetchUserCart(userId));
                alert("Item added to cart!");
            })
            .catch((error) => alert(`Failed to add to cart: ${error.message}`));
    };


    const safeProductList = Array.isArray(productList) ? productList : [];


    return (
        <div className="mt-20 mx-auto px-20 py-8">

            {/* <HeroSection />
            <SeasonalTipBanner /> */}
            {/* Carousel Slider */}
            <Slider {...sliderSettings}>
                {Banners &&
                    Banners.map((banner, index) => (
                        <div key={index}>
                            <img
                                src={banner.image}
                                alt={banner.title}
                                style={{
                                    width: '100%',
                                    height: '500px',
                                    borderRadius: '10px',
                                    objectFit: 'cover'
                                }}
                            />
                        </div>
                    ))}
            </Slider>

            {/* <div className="mt-20 mb-20 relative">
                <div className="inline-block">
                    <h2 className="text-2xl font-bold text-gray-800 mb-1">Shop By Brands</h2>
                    <div className="h-1 w-full bg-[#3498DB] mb-10"></div>
                </div>

                <div className="relative flex items-center">
                    
                    <button
                        onClick={() => scroll("left")}
                        className="absolute left-0 z-10 p-2 bg-gray-200 rounded-full shadow-md hover:bg-gray-300"
                    >
                        <ChevronLeft className="w-6 h-6 text-gray-600" />
                    </button>

                   
                    <div
                        ref={scrollRef}
                        className="flex space-x-10 overflow-x-auto scroll-smooth snap-x snap-mandatory px-12"
                        style={{ scrollBehavior: "smooth", overflow: "hidden", whiteSpace: "nowrap", scrollbarWidth: "none", msOverflowStyle: "none" }}
                    >
                        {safeProductList?.map((product, index) => (
                            <div
                                key={index}
                                className="flex flex-col items-center snap-start cursor-pointer"
                            >
                                <img
                                    src={brandLogos[product.brand] || "https://via.placeholder.com/100"}
                                    alt={product.brand}
                                    className="w-24 h-24 object-contain rounded-lg"
                                />
                                
                            </div>
                        ))}
                    </div>

                    <button
                        onClick={() => scroll("right")}
                        className="absolute right-0 z-10 p-2 bg-gray-200 rounded-full shadow-md hover:bg-gray-300"
                    >
                        <ChevronRight className="w-6 h-6 text-gray-600" />
                    </button>
                </div>
            </div> */}



            {/* <div className="mb-20">
                <div className="inline-block">
                    <h2 className="text-2xl font-bold text-gray-800 mb-1">Shop By Category</h2>
                    <div className="h-1 w-full bg-[#3498DB] mb-10"></div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {categoryList?.map((category, index) => (
                        <button
                            key={index}
                            onClick={() => {
                                setActiveCategory(category.name);
                                navigate(`/user/products/${category.name}`);
                            }}
                            className={`
                flex items-center gap-3 p-6 rounded-xl transition-all
                ${activeCategory === category.name
                                    ? 'bg-green-600 text-white'
                                    : 'bg-white text-gray-800 hover:bg-green-50 hover:scale-105'}
                border border-gray-200 shadow-sm
              `}
                        >
                            {categoryIcons[category.name] || <Leaf className="w-6 h-6" />}
                            <span className="font-medium">{category.name}</span>
                        </button>
                    ))}
                </div>
            </div> */}

            <div className="mb-20 mt-10">
                <div className="inline-block">
                    <h2 className="text-2xl font-bold text-gray-800 mb-1">Shop By Category</h2>
                    <div className="h-1 w-full bg-[#3498DB] mb-10"></div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                    {categoryList?.map((category, index) => (
                        <button
                            key={index}
                            onClick={() => {
                                setActiveCategory(category.name);
                                navigate(`/products/${category.name}`);
                            }}
                            className={`flex flex-col items-center gap-3 p-6 rounded-xl transition-allborder`}
                        >
                            {/* Category Image */}
                            <img
                                src={categoryImages[category.name] || "https://via.placeholder.com/100"}
                                alt={category.name}
                                className="w-16 h-16 object-cover rounded-lg"
                            />

                            {/* Category Name */}
                            <span className="font-medium">{category.name}</span>
                        </button>
                    ))}
                </div>
            </div>




            <div className="mb-20">
                <div className="inline-block">
                    <h2 className="text-2xl font-bold text-gray-800 mb-1">Popular Products</h2>
                    <div className="h-1 w-full bg-[#3498DB] mb-6"></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {popularProducts?.map((product, index) => (
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
            </div>


            {/* {subCategories.map((subCategory, index) => (
                <div className="mt-10" key={index}>
                    <div className="inline-block">
                        <h2 className="text-2xl font-bold text-gray-800 mb-1">{subCategory.name}</h2>
                        <div className="h-1 w-full bg-green-600 mb-6"></div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {safeProductList?.filter((product) => product.subCategory?.id === subCategory.id)
                            .map((product, productIndex) => (
                                <div
                                    key={productIndex}
                                    className="bg-white rounded-xl border border-gray-200 overflow-hidden transition-all hover:shadow-lg"
                                >
                                    <div
                                        className="h-56 overflow-hidden"
                                        onClick={() => navigate(`/user/product-details/${product.id}`)}
                                    >
                                        <img
                                            src={`${BASE_URL}${product.images[0]?.downloadUrl}`}
                                            alt={product.name}
                                            className="w-full h-full object-cover transition-transform hover:scale-110"
                                            onError={(e)=> e.target.src = "https://icrier.org/wp-content/uploads/2022/12/media-Event-Image-Not-Found.jpg"}
                                        />
                                    </div>
                                    <div className="p-4">
                                        <h3 className="font-semibold text-lg mb-1">{product.name}</h3>
                                        <p className="text-gray-600 text-sm mb-3">{product.brand}</p>
                                        <div className="flex items-center justify-between">
                                            <p className="text-amber-500 font-bold">₹ {product.price}</p>
                                            <button
                                                onClick={() => handleAddToCart(product.id)}
                                                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                                            >
                                                Add to Cart
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                    </div>
                </div>
            ))} */}

            {/* Product Container */}
            {/* <h2 className="mt-16 text-3xl font-bold">Popular Products</h2>
            <div className="mt-10 grid grid-cols-4 gap-10 overflow-auto">
                {popularProducts &&
                    popularProducts.map((product, index) => (
                        <div
                            key={index}
                            className="border border-gray-300 rounded-lg p-3 shadow-sm"
                        >

                            <img
                                src={`${BASE_URL}${product.images[0]?.downloadUrl}`}
                                alt={product.name}
                                className="w-full h-72 object-cover rounded-lg cursor-pointer"
                                onClick={() => navigate(`/user/product-details/${product.id}`)}
                                onError={(e) => e.target.src = "https://icrier.org/wp-content/uploads/2022/12/media-Event-Image-Not-Found.jpg"}
                            />


                            <h3 className="text-lg font-medium mt-2">{product.name}</h3>
                            <p className="text-sm text-gray-500">{product.brand}</p>
                            <div className="flex items-center justify-between mt-2">
                                <p className="font-bold">₹ {product.price}</p>
                                <button
                                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                                    onClick={() => handleAddToCart(product.id)}

                                >
                                    Add to Cart
                                </button>
                            </div>
                        </div>
                    ))}
            </div> */}

            <div className="bg-blue-400 text-white py-8 rounded-2xl">
                <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 px-6">
                    {features.map((feature, index) => (
                        <div key={index} className="flex items-start gap-4">
                            <div className="bg-blue-300 p-4 rounded-full">{feature.icon}</div>
                            <div>
                                <h3 className="text-lg font-semibold">{feature.title}</h3>
                                <p className="text-sm">{feature.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>

    );
}
export default Shopping;
