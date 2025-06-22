import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addItemToCart, clearCart, fetchUserCart } from '../../../features/cartReducer';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchProductById, submitReview, fetchProductReviews, resetReviews } from '../../../features/ProductReducer';
import { fetchStockByProductId, resetStock } from '../../../features/StockReducer';

const BASE_URL = process.env.REACT_APP_ECOMMERCE_API_ENDPOINT.replace('/api/v1', '');

function ProductDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { selectedProduct, reviews } = useSelector((state) => state.product);
    const { cart } = useSelector((state) => state.cart);
    const { stock } = useSelector((state) => state.stock);
    const userId = localStorage.getItem('userId');
    const cartId = cart?.cartId;

    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [reviewText, setReviewText] = useState('');

    useEffect(() => {
        dispatch(resetStock());
        dispatch(resetReviews());
        dispatch(fetchProductById(id));
        dispatch(fetchProductReviews(id));
        dispatch(fetchStockByProductId(id));
    }, [id, dispatch]);

    const images = selectedProduct?.images || [];
    const [currentIndex, setCurrentIndex] = useState(0);

    const handlePrev = () => {
        setCurrentIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1));
    };

    const handleNext = () => {
        setCurrentIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));
    };

    const handleAddToCart = (productId) => {
        dispatch(addItemToCart({ productId, quantity: 1 }))
            .unwrap()
            .then(() => {
                dispatch(fetchUserCart(userId));
                alert("Item added to cart!");
            })
            .catch((error) => alert(`Failed to add to cart: ${error.message}`));
    };

    const handleDirectCheckout = (productId) => {
        dispatch(clearCart(cartId)).unwrap();
        dispatch(addItemToCart({ productId, quantity: 1 })).unwrap().then(() => dispatch(fetchUserCart(userId)));
        navigate("/user/checkout");
    };

    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        if (!rating || !reviewText.trim()) return;

        const review = {
            rating,
            comment: reviewText,
            productId: id,
            userId: parseInt(userId),
        };

        console.log('review', review);


        try {
            await dispatch(submitReview({ productId: id, review })).unwrap();
            dispatch(fetchProductReviews(id));
            setReviewText('');
            setRating(0);
        } catch (error) {
            alert('Failed to submit review: ' + error.message);
        }
    };

    const getStockStatus = () => {
        if (stock?.currentStock < 1 || stock === null) {
            return <p className="text-red-500 text-lg font-medium">Out of stock</p>;
        } else if (stock?.currentStock < 10) {
            return <p className="text-yellow-600 text-lg font-medium">Order soon! Only a few left</p>;
        } else {
            return <p className="text-green-600 text-lg font-medium">In stock</p>;
        }
    };

    const StarRating = ({ rating, setRating, hoverRating, setHoverRating }) => {
        return (
            <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                    <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="focus:outline-none"
                    >
                        <svg
                            className={`w-8 h-8 ${star <= (hoverRating || rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                            viewBox="0 0 24 24"
                        >
                            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                        </svg>
                    </button>
                ))}
            </div>
        );
    };

    const isOutOfStock = stock?.currentStock < 1 || stock === null;
    const averageRating = selectedProduct?.averageRating || 0;

    return (
        <div className="mt-20">
            <div className="bg-gray-100">
                <div className="flex gap-28 container mx-auto px-4 py-8">

                    <div className="relative w-2/5 ml-10">
                        <div className="overflow-hidden bg-white rounded-lg shadow-md border border-gray-200">
                            {images.length > 0 ? (
                                <img
                                    src={`${BASE_URL}${images[currentIndex]?.downloadUrl}`}
                                    alt={`Product Image ${currentIndex + 1}`}
                                    className="w-full h-96 object-contain transition-opacity duration-300 ease-in-out"
                                    onError={(e) => {
                                        console.error('Image failed to load:', e.target.src);
                                        e.target.src = '/path/to/default-image.jpg';
                                    }}
                                />
                            ) : (
                                <div className="w-full h-96 flex items-center justify-center bg-gray-200">
                                    <p className="text-gray-500">No image available</p>
                                </div>
                            )}
                        </div>
                        {/* Navigation Row (Just Below Image) */}
                        {images.length > 1 && (
                            <div className="flex justify-between items-center px-4 py-2 border-t border-gray-200">
                                {/* Left Arrow */}
                                <button
                                    onClick={handlePrev}
                                    className="bg-white text-gray-800 p-2 rounded-full shadow hover:bg-gray-100 focus:outline-none transition-all duration-200"
                                    style={{ width: '40px', height: '40px' }}
                                    aria-label="Previous Image"
                                >
                                    <svg
                                        className="w-6 h-6"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M15 19l-7-7 7-7"
                                        />
                                    </svg>
                                </button>
                                {/* Thumbnail Dots */}
                                <div className="flex space-x-2">
                                    {images.map((_, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setCurrentIndex(index)}
                                            className={`w-3 h-3 rounded-full ${currentIndex === index ? 'bg-indigo-600' : 'bg-gray-300'} focus:outline-none`}
                                        />
                                    ))}
                                </div>
                                {/* Right Arrow */}
                                <button
                                    onClick={handleNext}
                                    className="bg-white text-gray-800 p-2 rounded-full shadow hover:bg-gray-100 focus:outline-none transition-all duration-200"
                                    style={{ width: '40px', height: '40px' }}
                                    aria-label="Next Image"
                                >
                                    <svg
                                        className="w-6 h-6"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M9 5l7 7-7 7"
                                        />
                                    </svg>
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="flex-1 px-4">
                        <h2 className="text-3xl font-bold mb-2 text-gray-900">{selectedProduct?.name}</h2>
                        <p className="text-gray-600 mb-4 text-lg">{selectedProduct?.brand}</p>
                        <div className="flex items-center mb-4">
                            <span className="text-2xl font-bold text-gray-800 mr-4">₹ {selectedProduct?.price}</span>
                            {averageRating > 0 && (
                                <div className="flex items-center">
                                    <span className="text-yellow-400 mr-1">
                                        {'★'.repeat(Math.round(averageRating))}
                                        {'☆'.repeat(5 - Math.round(averageRating))}
                                    </span>
                                    <span className="text-gray-600 ml-1">({reviews.length} reviews)</span>
                                </div>
                            )}
                        </div>
                        {getStockStatus()}
                        <p className="text-gray-700 mb-6 mt-2 text-base leading-relaxed">{selectedProduct?.description}</p>
                        <div className="flex gap-3 mb-6">
                            <button
                                disabled={isOutOfStock}
                                onClick={() => handleAddToCart(selectedProduct?.id)}
                                className={`bg-indigo-600 flex items-center text-white px-6 py-3 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition duration-200 ${isOutOfStock ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                Add to Cart
                            </button>
                            <button
                                disabled={isOutOfStock}
                                className={`bg-indigo-600 flex items-center text-white px-6 py-3 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition duration-200 ${isOutOfStock ? 'opacity-50 cursor-not-allowed' : ''}`}
                                onClick={() => handleDirectCheckout(selectedProduct?.id)}
                            >
                                Checkout
                            </button>
                        </div>

                        {/* Reviews Section */}
                        <div className="mt-8">
                            <h3 className="text-xl font-semibold mb-4 text-gray-900">Customer Reviews</h3>

                            {userId &&
                                <form onSubmit={handleReviewSubmit} className="mb-6">
                                    <div className="mb-4">
                                        <label className="block mb-2 font-medium text-gray-700">Your Rating:</label>
                                        <StarRating
                                            rating={rating}
                                            setRating={setRating}
                                            hoverRating={hoverRating}
                                            setHoverRating={setHoverRating}
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label className="block mb-2 font-medium text-gray-700">Your Review:</label>
                                        <textarea
                                            value={reviewText}
                                            onChange={(e) => setReviewText(e.target.value)}
                                            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                            rows="4"
                                            placeholder="Write your review here..."
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200"
                                    >
                                        Submit Review
                                    </button>
                                </form>
                            }

                            <div className="space-y-6">
                                {reviews.length === 0 ? (
                                    <p className="text-gray-600">No reviews yet. Be the first to review!</p>
                                ) : (
                                    reviews.map((review) => (
                                        <div key={review.id} className="border-b pb-4">
                                            <div className="flex items-center mb-2">
                                                <span className="text-yellow-400 mr-2">
                                                    {'★'.repeat(review.rating)}
                                                    {'☆'.repeat(5 - review.rating)}
                                                </span>
                                            </div>
                                            <p className="text-gray-700">{review.comment}</p>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProductDetails;