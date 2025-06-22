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
import promo1 from "../../../assets/colorful-summer-sale-banner-promotion-template_439673-83.jpg";
import promo2 from "../../../assets/electronics-sale-banner-devices-online-shopping-delivery-basket-273419752.jpg";
import ele from "../../../assets/electronics.png";
import fur from "../../../assets/sofa.png";
import app from "../../../assets/gadgets.png";
import gar from "../../../assets/gardening.png";
import tool from "../../../assets/repair-tools.png";
import puz from "../../../assets/puzzle.png";
import { fetchCategories } from "../../../features/CategoryReducer";
import { addItemToCart, fetchUserCart } from "../../../features/cartReducer";
import { FaComments, FaTruck, FaSearchengin, FaTruckFast, FaHeart } from "react-icons/fa6";
import { fetchSubCategories } from "../../../features/SubCategoryReducer";
import { motion } from "framer-motion";
import Login from '../../../UserLayout/Login';
import Register from '../../../UserLayout/Register';
import { Alert, Button, Snackbar } from "@mui/material";
import { fetchStockByProductId } from "../../../features/StockReducer";
import { showErrorSnackbar, showSuccessSnackbar, showWarningSnackbar } from "../../../utils/snackbar";
import { addToWishlist } from "../../../features/WishlistReducer";
const BASE_URL = process.env.REACT_APP_ECOMMERCE_API_ENDPOINT.replace('/api/v1', '');

function Shopping(propsFromWrapper) {
    const { products: productList } = useSelector((state) => state.product);
    const { categories: categoryList } = useSelector((state) => state.category);
    const { subCategories } = useSelector((state) => state.subCategory);
    const { authData } = useSelector((state) => state.auth);
    const { stock, loading: stockLoading } = useSelector((state) => state.stock);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const userId = localStorage.getItem("userId");
    const [popularProducts, setPopularProducts] = useState([]);
    const [productFilter, setProductFilter] = useState('all');
    const { loading } = useSelector((state) => state.cart);
    const [activeCategory, setActiveCategory] = useState(null);
    const scrollRef = useRef(null);
    const outletContext = useOutletContext();

    const [alertOpen, setAlertOpen] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");
    const [alertSeverity, setAlertSeverity] = useState("success");
    const [processingProductId, setProcessingProductId] = useState(null);

    const { setShowAuthModal = () => { }, setAuthMode = () => { }, isLoggedIn = localStorage.getItem("isLoggedIn") || false } = { ...outletContext, ...propsFromWrapper };

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


    const handleAlertClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setAlertOpen(false);
    };

    const showAlert = (message, severity) => {
        setAlertMessage(message);
        setAlertSeverity(severity);
        setAlertOpen(true);
    };

    const Banners = [
        { image: banner1, title: "Banner 1" },
        { image: banner2, title: "Banner 2" },
    ];



    const features = [
        {
            icon: <FaTruckFast className="text-white text-3xl" />,
            title: "Free Shipping",
            description: "Free Door delivery for ALL ORDERS WORLD WIDE",
        },
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
        "Appliances": ele,
        "Gardening": gar,
        "Tools & Hardware": tool,
        "Toys": puz
    };



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

    const handleAddToCart = async (productId) => {
        if (!isLoggedIn) {
            setAuthMode('login');
            setShowAuthModal(true);
            return;
        }

        try {
            setProcessingProductId(productId);
            const stockResult = await dispatch(fetchStockByProductId(productId)).unwrap();

            if (stockResult && stockResult.currentStock > 0) {
                dispatch(addItemToCart({ productId, quantity: 1 }))
                    .unwrap()
                    .then(() => {
                        dispatch(fetchUserCart(userId));
                        showSuccessSnackbar(dispatch, "Item added to cart!");
                    })
                    .catch((error) => showErrorSnackbar(dispatch, `Failed to add to cart: ${error.message}`));
            } else {
                showWarningSnackbar(dispatch, "Sorry, this item is currently out of stock!");
            }
        } catch (error) {
            showWarningSnackbar(dispatch, "Sorry, this item is currently out of stock!");
        } finally {
            setProcessingProductId(null);
        }
    };

    const handleAddToWishlist = (productId) => {
        if (!isLoggedIn) {
            setAuthMode('login');
            setShowAuthModal(true);
            return;
        }
        
        dispatch(addToWishlist({ userId, productId }))
        .unwrap()
        .then(() => {
            showSuccessSnackbar(dispatch, "Product added to wishlist!");
        })
        .catch((error) => showErrorSnackbar(dispatch, `Failed to add to wishlist: ${error.message}`));
        
        // console.log(`Product ${productId} added to wishlist`);
    };

    const safeProductList = Array.isArray(productList) ? productList : [];


    return (
        <div className="mt-20 mx-auto px-20">


            <Snackbar
                open={alertOpen}
                autoHideDuration={4000}
                onClose={handleAlertClose}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <Alert onClose={handleAlertClose} severity={alertSeverity} sx={{ width: '100%', marginTop: '50px' }}>
                    {alertMessage}
                </Alert>
            </Snackbar>
            {/* <HeroSection />
            <SeasonalTipBanner /> */}
            <Slider {...sliderSettings}>
                {Banners &&
                    Banners.map((banner, index) => (
                        <div key={index}>
                            <img
                                src={banner.image}
                                alt={banner.title}
                                style={{
                                    width: '100%',
                                    height: '450px',
                                    borderRadius: '10px',
                                    objectFit: 'cover',

                                }}

                            />
                        </div>
                    ))}
            </Slider>


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
                            <img
                                src={categoryImages[category.name] || "https://via.placeholder.com/100"}
                                alt={category.name}
                                className="w-16 h-16 object-cover rounded-lg hover:scale-105"
                            />

                            <span className="font-medium">{category.name}</span>
                        </button>
                    ))}
                </div>
            </div>




            <div className="mb-20">
                <div className="flex items-center justify-between mb-6">
                    <div className="inline-block">
                        <h2 className="text-2xl font-bold text-gray-800 mb-1">Featured Products</h2>
                        <div className="h-1 w-full bg-[#3498DB]"></div>
                    </div>
                    <div className="flex space-x-2">
                        <button
                            onClick={() => setProductFilter('new')}
                            className={`text-sm font-semibold px-4 py-2 rounded-lg border border-gray-300 transition-colors ${productFilter === 'new'
                                ? 'bg-gray-200'
                                : 'bg-gray-100 text-black hover:bg-gray-200'
                                }`}>
                            New Arrivals
                        </button>
                        <button
                            onClick={() => setProductFilter('all')}
                            className={`text-sm font-semibold px-4 py-2 rounded-lg border border-gray-300 transition-colors ${productFilter === 'all'
                                ? 'bg-gray-200'
                                : 'bg-gray-100 text-black hover:bg-gray-200'
                                }`}>
                            Bestseller
                        </button>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {popularProducts?.filter(product => productFilter === 'new' ? !product.averageRating : true).map((product, index) => (
                        <div
                            key={index}
                            className="bg-white rounded-xl border border-gray-200 overflow-hidden transition-all hover:shadow-lg flex flex-col"
                        >
                            <div
                                className="h-56 overflow-hidden cursor-pointer relative"
                                onClick={() => navigate(`/product-details/${product.id}`)}
                            >
                                <img
                                    src={`${BASE_URL}${product.images[0]?.downloadUrl}`}
                                    alt={product.name}
                                    className="w-full p-3 h-full object-contain transition-transform hover:scale-110"
                                    onError={(e) => e.target.src = "https://icrier.org/wp-content/uploads/2022/12/media-Event-Image-Not-Found.jpg"}
                                />
                                <div className="absolute top-2 right-2">
                                    {isLoggedIn && (
                                        <FaHeart
                                            size={25}
                                            className="text-gray-500 cursor-pointer mr-2"
                                            onClick={(event) => {
                                                event.stopPropagation();
                                                handleAddToWishlist(product.id);
                                            }}
                                        />
                                    )}
                                    {/* {productFilter === 'new' ? (
                                        <span>New</span>
                                    ) : (
                                        <>
                                            <span>{product.averageRating || "N/A"}</span>
                                            <svg
                                                className="w-3 h-3 ml-1"
                                                fill="currentColor"
                                                viewBox="0 0 20 20"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                            </svg>
                                        </>
                                    )} */}
                                </div>
                            </div>

                            <div className="p-4 flex flex-col flex-grow">
                                <h3 className="font-semibold text-lg mb-1 line-clamp-2">
                                    {product.name}
                                </h3>
                                <p className="text-gray-600 text-sm mb-3">{product.brand}{product.averageRating || "N/A"}</p>
                                {/* <p className="text-gray-600 text-sm mb-3">{product.averageRating || ""}</p> */}
                                <span className="text-yellow-400 mr-1">
                                    {'★'.repeat(Math.round(product.averageRating))}
                                    {'☆'.repeat(5 - Math.round(product.averageRating))}
                                </span>

                                <div className="flex items-center justify-between mt-auto">
                                    <p className="text-black font-bold">₹ {product.price}</p>
                                    <div className="flex items-center">
                                        <button
                                            onClick={() => handleAddToCart(product.id)}
                                            className="bg-[#3498DB] text-white px-4 py-2 rounded-lg hover:bg-[#2980B9] transition-colors"
                                        >
                                            Add to Cart
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>




            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 mb-10">
                <div className="relative h-[200px] overflow-hidden rounded-lg">
                    <img src={promo1} alt="Promotion 1" fill className="object-fill opacity-90" />
                    <div className="absolute inset-0 flex flex-col justify-center bg-black/30 p-6 text-white">
                        <h3 className="text-xl font-bold md:text-2xl">Summer Sale</h3>
                        <p className="mb-4 max-w-md text-sm md:text-base">Up to 50% off on all items</p>
                        <button className="w-fit border p-2 text-white hover:scale-105">
                            Shop Now
                        </button>
                    </div>
                </div>
                <div className="relative h-[200px] overflow-hidden rounded-lg">
                    <img src={promo2} alt="Promotion 2" fill className="object-cover opacity-90" />
                    <div className="absolute inset-0 flex flex-col justify-center bg-black/30 p-6 text-white">
                        <h3 className="text-xl font-bold md:text-2xl">Electronics</h3>
                        <p className="mb-4 max-w-md text-sm md:text-base">Latest gadgets at unbeatable prices</p>
                        <button
                            onClick={() => navigate("/products/Electronics")}
                            className="w-fit border p-2 text-white hover:scale-105">
                            Explore
                        </button>
                    </div>
                </div>
            </div>

        </div>

    );
}
export default Shopping;
