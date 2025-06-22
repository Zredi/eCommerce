
// import React, { useEffect, useState } from 'react'
// import { useDispatch, useSelector } from 'react-redux';
// import EmptyCart from './EmptyCart';
// import { fetchUserCart, removeItemFromCart, updateItemQuantity } from '../../../features/cartReducer';
// import { RiDeleteBin5Fill } from 'react-icons/ri';
// import { IconButton } from '@mui/material';
// import { useNavigate } from 'react-router-dom';

// const BASE_URL = process.env.REACT_APP_ECOMMERCE_API_ENDPOINT.replace('/api/v1', '');

// function ShoppingCart() {

//     const navigate = useNavigate();
//     const dispatch = useDispatch();
//     const {cart, loading, error} = useSelector((state)=> state.cart);
//     const userId = localStorage.getItem('userId');
//     const [localCart, setLocalCart] = useState(null);

//     useEffect(() => {
//         if (cart) {
//             setLocalCart(cart);
//         }
//     }, [cart]);

//     useEffect(() => {
//         if (userId) {
//             dispatch(fetchUserCart(userId));
//         }
//     }, [dispatch, userId]);

//     const calculateSubtotal = (items) => {
//         return items.reduce((total, item) => total + (item.unitPrice * item.quantity), 0);
//     };

//     const handleQuantityChange = async (itemId, change) => {
//         if (!userId || !localCart) return;
//         const cartId = cart?.cartId;
//         const item = localCart.items.find((item)=> item.product.id === itemId);

//         if(item){
//             const newQuantity = item.quantity + change;
//             if (newQuantity < 1) return;

//             const updatedItems = localCart.items.map(cartItem => {
//                 if (cartItem.product.id === itemId) {
//                     return {
//                         ...cartItem,
//                         quantity: newQuantity,
//                         totalPrice: cartItem.unitPrice * newQuantity
//                     };
//                 }
//                 return cartItem;
//             });

//             const newSubtotal = calculateSubtotal(updatedItems);

//             setLocalCart({
//                 ...localCart,
//                 items: updatedItems,
//                 totalAmount: newSubtotal
//             });

//             dispatch(updateItemQuantity({cartId, itemId, quantity: newQuantity}))
//               .unwrap()
//               .catch(error=>{
//                 setLocalCart(cart);
//                 console.error('Failed to update item quantity:', error); 
//             });
//         }
//     };

//     const handleDelete = (itemId)=>{
//         if (!localCart) return;
//         const cartId = localCart.cartId;

//         const updatedItems = localCart.items.filter(item => item.product.id !== itemId);
//         const newSubtotal = calculateSubtotal(updatedItems);

//         setLocalCart({
//             ...localCart,
//             items: updatedItems,
//             totalAmount: newSubtotal
//         });
//         dispatch(removeItemFromCart({cartId, itemId}))
//             .unwrap()
//             .then(() => {
//                 dispatch(fetchUserCart(userId));
//                 alert("Item removed from cart");
//             })
//             .catch(error => {
//                 setLocalCart(cart);
//                 console.error('Failed to delete item:', error);
//             });
//     }

//     const handleContinueShopping = () => {
//         navigate('/home');
//     }

//     const handleCheckout = () => {
//         navigate('/checkout');
//     }


//     if (loading && !localCart) return <div>Loading...</div>;
//     if (error)  return <EmptyCart />;

//     if (!localCart?.items?.length) {
//         return <EmptyCart />;
//     }


//     return (
//         <div className="p-8 mt-20 mb-20">
//             <div className="max-w-5xl mx-auto">
//                 <h1 className="text-2xl font-bold mb-8">Shopping Cart</h1>
//                 <table className="w-full text-left">
//                     <thead>
//                         <tr>
//                             <th className="py-2">Product</th>
//                             <th className="py-2">Quantity</th>
//                             <th className="py-2">Price</th>
//                             <th className="py-2">Total</th>
//                             <th className="py-2">Remove</th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {localCart.items.map(item => (
//                             <tr key={item.itemId} className="border-t border-gray-400">
//                                 <td className="py-4">
//                                     <div className='flex space-x-3'>
//                                     <img src={`${BASE_URL}${item.product.images[0]?.downloadUrl}`} alt="" 
//                                     className='w-24 h-24 object-cover rounded'
//                                     onError={(e) => e.target.src = "https://icrier.org/wp-content/uploads/2022/12/media-Event-Image-Not-Found.jpg"}
//                                     />
//                                     <div>
//                                         <p className='font-medium'>{item.product.subCategory.name}</p>
//                                         <p className='mt-3 text-gray-500'>{item.product.name}</p>
//                                         <p className='text-gray-500'>{item.product.brand}</p>
//                                     </div>
//                                     </div>
//                                 </td>
//                                 <td className="py-4">
//                                     <div className='flex items-center'>
//                                     <button
//                                         className="px-2 py-1 text-white bg-gray-800 rounded"
//                                         onClick={() => handleQuantityChange(item.product.id, -1)}
//                                     >
//                                         -
//                                     </button>
//                                     <span className="mx-4">{item.quantity}</span>
//                                     <button
//                                         className="px-2 py-1 text-white bg-gray-800 rounded"
//                                         onClick={() => handleQuantityChange(item.product.id, 1)}
//                                     >
//                                         +
//                                     </button>
//                                     </div>
//                                 </td>
//                                 <td className="py-4">₹ {item.unitPrice.toFixed(2)}</td>
//                                 <td className="py-4">₹ {item.totalPrice.toFixed(2)}</td>
//                                 <td className="py-4"><IconButton onClick={()=> handleDelete(item.product.id)}><RiDeleteBin5Fill size={20} className='fill-red-600' /></IconButton></td>
//                             </tr>
//                         ))}
//                     </tbody>
//                 </table>

//                 <hr />

//                 <div className="flex justify-center gap-10 mt-10">
//                     <h2 className="text-xl font-bold mt-4">Sub Total:</h2>
//                     <h2 className="text-xl font-bold mt-4">₹ {localCart.totalAmount.toFixed(2)}</h2>
//                 </div>

//                 <div className="flex justify-evenly mt-8">
//                     <button onClick={handleContinueShopping} className="px-4 py-2 bg-gray-700 rounded text-white">Continue Shopping</button>
//                     <button onClick={handleCheckout} className="px-4 py-2 bg-blue-600 rounded text-white">Proceed to Checkout</button>
//                 </div>
//             </div>
//         </div>
//     )
// }

// export default ShoppingCart






import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import EmptyCart from './EmptyCart';
import { clearCart, fetchUserCart, removeItemFromCart, updateItemQuantity } from '../../../features/cartReducer';
import { RiDeleteBin5Fill } from 'react-icons/ri';
import { IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { showSuccessSnackbar } from '../../../utils/snackbar';

const BASE_URL = process.env.REACT_APP_ECOMMERCE_API_ENDPOINT.replace('/api/v1', '');

function ShoppingCart() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { cart, loading, error } = useSelector((state) => state.cart);
    const userId = localStorage.getItem('userId');
    const [localCart, setLocalCart] = useState(null);
    const shippingCost = 5.99;
    const taxRate = 0.08;

    useEffect(() => {
        if (cart) {
            setLocalCart(cart);
        }
    }, [cart]);

    useEffect(() => {
        if (userId) {
            dispatch(fetchUserCart(userId));
        }
    }, [dispatch, userId]);

    const calculateSubtotal = (items) => {
        return items.reduce((total, item) => total + item.unitPrice * item.quantity, 0);
    };

    const handleQuantityChange = async (itemId, change) => {
        if (!userId || !localCart) return;
        const cartId = cart?.cartId;
        const item = localCart.items.find((item) => item.product.id === itemId);

        if (item) {
            const newQuantity = item.quantity + change;
            if (newQuantity < 1) return;

            const updatedItems = localCart.items.map((cartItem) => {
                if (cartItem.product.id === itemId) {
                    return {
                        ...cartItem,
                        quantity: newQuantity,
                        totalPrice: cartItem.unitPrice * newQuantity,
                    };
                }
                return cartItem;
            });

            const newSubtotal = calculateSubtotal(updatedItems);

            setLocalCart({
                ...localCart,
                items: updatedItems,
                totalAmount: newSubtotal,
            });

            dispatch(updateItemQuantity({ cartId, itemId, quantity: newQuantity }))
                .unwrap()
                .catch((error) => {
                    setLocalCart(cart);
                    // console.error('Failed to update item quantity:', error);
                });
        }
    };

    const handleDelete = (itemId) => {
        if (!localCart) return;
        const cartId = localCart.cartId;

        const updatedItems = localCart.items.filter((item) => item.product.id !== itemId);
        const newSubtotal = calculateSubtotal(updatedItems);

        setLocalCart({
            ...localCart,
            items: updatedItems,
            totalAmount: newSubtotal,
        });
        dispatch(removeItemFromCart({ cartId, itemId }))
            .unwrap()
            .then(() => {
                dispatch(fetchUserCart(userId));
                showSuccessSnackbar(dispatch,'Item removed from cart');
            })
            .catch((error) => {
                setLocalCart(cart);
                console.error('Failed to delete item:', error);
            });
    };

    const handleClearCart = () => {
        if (!localCart || !localCart.cartId) return;

        dispatch(clearCart(localCart.cartId))
            .unwrap()
            .then(() => {
                dispatch(fetchUserCart(userId));
                showSuccessSnackbar(dispatch, 'Cart cleared successfully');
            })
            .catch((error) => {
                console.error('Failed to clear cart:', error);
            });
    };

    const handleContinueShopping = () => {
        navigate('/home');
    };

    const handleCheckout = () => {
        navigate('/checkout');
    };



    if (loading && !localCart) return <div>Loading...</div>;
    if (error) return <EmptyCart />;

    if (!localCart?.items?.length) {
        return <EmptyCart />;
    }

    const subtotal = calculateSubtotal(localCart.items);
    const tax = subtotal * taxRate;
    const total = subtotal + shippingCost + tax;

    return (
        <div className="p-8 mt-20 mb-20 mx-auto">
            <h1 className="text-2xl font-bold mb-8">Shopping Cart</h1>
            <div className="flex gap-6">
                <div className="w-3/4">
                    <div className="bg-white p-4 rounded-lg shadow-sm">
                        <h2 className="text-base font-medium mb-4">Cart Items ({localCart.items.length})</h2>
                        {localCart.items.map((item) => (
                            <div key={item.itemId} className="flex items-center justify-between mb-4">
                                <div className="flex items-center space-x-4">
                                    <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center">
                                        <img src={`${BASE_URL}${item.product.images[0]?.downloadUrl}`} alt=""
                                            onError={(e) => e.target.src = "https://icrier.org/wp-content/uploads/2022/12/media-Event-Image-Not-Found.jpg"}
                                        />
                                    </div>
                                    <div>
                                        <p className="font-medium text-sm">{item.product.name}</p>
                                        <p className="text-gray-600 text-sm">Unit Price: ₹{item.unitPrice.toFixed(2)}</p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-10">
                                    <div className="flex items-center border rounded">
                                        <button
                                            className="px-2 py-1 text-gray-600"
                                            onClick={() => handleQuantityChange(item.product.id, -1)}
                                        >
                                            -
                                        </button>
                                        <span className="px-4">{item.quantity}</span>
                                        <button
                                            className="px-2 py-1 text-gray-600"
                                            onClick={() => handleQuantityChange(item.product.id, 1)}
                                        >
                                            +
                                        </button>
                                    </div>
                                    <span className="text-sm font-medium">₹{(item.unitPrice * item.quantity).toFixed(2)}</span>
                                    <IconButton onClick={() => handleDelete(item.product.id)}>
                                        <RiDeleteBin5Fill size={18} className="fill-red-500" />
                                    </IconButton>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-between mt-6">
                        <button
                            onClick={handleContinueShopping}
                            className="px-4 py-2 border bg-gray-400 rounded hover:bg-gray-500 text-white text-sm font-medium"
                        >
                            Continue Shopping
                        </button>
                        <button
                            onClick={handleClearCart}
                            className="px-4 py-2 border bg-black rounded hover:bg-gray-500 text-white text-sm font-medium"
                        >
                            Clear Cart
                        </button>
                    </div>
                </div>

                <div className="w-1/3">
                    <div className="bg-white p-4 rounded-lg shadow-sm">
                        <h2 className="text-base font-medium mb-4">Order Summary</h2>
                        <div className="space-y-2 text-sm">

                            <div className="flex justify-between font-semibold">
                                <span>Total</span>
                                <span>₹{subtotal.toFixed(2)}</span>
                            </div>
                        </div>

                        <button
                            onClick={handleCheckout}
                            className="w-full mt-6 px-4 py-2 bg-blue-400 hover:bg-blue-500 text-white rounded text-sm font-medium"
                        >
                            Proceed to Checkout
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ShoppingCart;