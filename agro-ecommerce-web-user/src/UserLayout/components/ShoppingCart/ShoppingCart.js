// import React, { Component, useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";
// import { userShoppingBagByUserId, userShoppingBagToDeleteApi } from "../../../features/UserShoppingReducer";
// import EmptyCart from "./EmptyCart";
// import './ShoppingCart.css';
// import { orderToSaveApi } from "../../../features/OrderReducer";
// import UploadFilesService from "../../../services/upload-file";

// function Header({ itemCount }) {
//   return (
//     <header className="container">
//       <h1>Shopping Cart</h1>

//       <ul className="breadcrumb">
//         <li>Home</li>
//         <li>Shopping Cart</li>
//       </ul>

//       <span className="count">{itemCount} items in the bag</span>
//     </header>
//   );
// }

// function ProductList({ products, onChangeProductQuantity }) {
//   let [subTotal, setSubTotal] = useState(0);
//   let [shoppingBags, setShoppingBags] = useState([])
//   const [total, setTotal] = useState(subTotal)
//   const [tax, setTax] = useState(5);
//   const [discount, setDiscount] = useState(10);
//   const { authData } = useSelector((state) => state.auth);
//   const navigate = useNavigate();
//   const dispatch = useDispatch();

//   const { profileData } = useSelector((state) => state.profile);


//   const { userShoppingBags } = useSelector((state) => state.userShoppingBag);
//   const [imageUrls, setimageUrls] = useState([]);
//   const uploadFileService = new UploadFilesService();
//   const token = localStorage.getItem("token");
//   useEffect(() => {
//     // shoppingBags.pop();
//     // setShoppingBags([])
//     // subTotal = 0;
//     dispatch(userShoppingBagByUserId({ id: profileData.id, token: token })).then((data) => {
//       // eslint-disable-next-line no-const-assign
//       // setUserShoppingBag(data.payload);
//       // setProductCount(data.payload.length);
//       // console.log(data.payload)
//       console.log("user shopping bag",userShoppingBags)

//     });
//     console.log(products)
//     userShoppingBags.map((product, i) => {

//       // shoppingBags[i]  = product;
//       let shoppingBag = {
//         id: product.shoppingBag.id,
//         product: product.shoppingBag.product,
//         quantity: product.shoppingBag.quantity
//       }
//       let userShoppingBag = {
//         id: product.id,
//         profile: product.profile,
//         shoppingBag: shoppingBag
//       }
//       shoppingBags.push(userShoppingBag);
//     })

//     // console.log(subTotal)
//     // shoppingBags[1].shoppingBag.quantity = 30;

//     // shoppingBags.map((product) => console.log(product))
//   }, [dispatch,shoppingBags,userShoppingBagToDeleteApi])

//   useEffect(() => {
//     // subTotal = 0;
//     // console.log(shoppingBags[1].shoppingBag?.quantity)
//     shoppingBags.map((shopping,i) => {
//       let sb = Number(subTotal) + (Number(shopping.shoppingBag.product.price) * Number(shopping.shoppingBag.quantity));
//       setSubTotal(sb);
//       subTotal = sb;
//       setTotal(shopping.shoppingBag.product.finalPrice * shopping.shoppingBag.quantity);
//     }) 

//   }, [userShoppingBagToDeleteApi]);




//   const gotoOrderAddress = (event) => {
//     console.log(userShoppingBags,subTotal,discount,tax,total)

//     let shoppingBagString=""
//     let quantity=0;
//     userShoppingBags.map((shoppingBags,i) =>{
//       shoppingBagString+=shoppingBags?.shoppingBag.id+",";
//       quantity = quantity+shoppingBags?.shoppingBag?.quantity;
//     })

//     if(shoppingBagString != null){
//       shoppingBagString=shoppingBagString.slice(0,shoppingBagString.length-1)
//     }
//     console.log(shoppingBagString,quantity)
//     let order ={
//       id:null,
//       shoppingBags: shoppingBagString,
//       quantity: quantity,
//       price: subTotal,
//       discount: discount,
//       tax: tax,
//       finalPrice: total,
//       profile: profileData?.id,
//       status: 'I',
//       address:null,
//       opDate: new Date()
//     }
//     console.log(order)
//     dispatch(orderToSaveApi({order:order,token:authData?.token})).then(
//       (data)=>{
//         navigate("/user/address")
//       }
//     )

//   }

//   const calculateSubTotal =(shoppingBags) => {
//     console.log(shoppingBags)
//     subTotal = 0;
//     shoppingBags.map((shopping,i) => {
//       let sb = Number(subTotal) + (Number(shopping.shoppingBag.product.price) * Number(shopping.shoppingBag.quantity));
//       setSubTotal(sb);
//       subTotal = sb;
//       setTotal(shopping.shoppingBag.product.finalPrice * shopping.shoppingBag.quantity);

//     })  

//   }

//   const onRemoveProduct = (product) => {
//     console.log(product);
//     dispatch(userShoppingBagToDeleteApi({userShoppingBag: product,token: token})).then(
//       (data) => {
//         console.log(data)
//         // if(data.payload){
//         alert("Product removed from Shopping Bag !!")
//         // }
//         // else{
//         //   alert("Product not deleted try again.")
//         // }
//       }
//    )
//   }

//  useEffect(() => {
//    const fetchImage = async () => {
//     const urls = [];
//     for(const product of shoppingBags){
//       try{
//         const response = await uploadFileService.getUploadedProductImage(product.shoppingBag.product.productImage, token);
//         if(response.ok){
//           const arrayBuffer = await response.arrayBuffer();
//           const blob = new Blob([arrayBuffer]);
//           const imageUrl = URL.createObjectURL(blob);
//           urls.push(imageUrl);
//         }
//       }catch(error){
//         console.error("error fetching image:", error);
//       }
//     }
//     setimageUrls(urls);

//    }

//    fetchImage();

//  }, [shoppingBags])



//   return (
//     <section className="container">
//       <ul className="products">
//         {shoppingBags.length != 0 && shoppingBags.map((product, index) => {
//           // let quantity = product.shoppingBag.quantity;
//           return (
//             <li className="row" key={index}>
//               <div className="col left">
//                 <div className="thumbnail">
//                   <a href="/">
//                     <img src={imageUrls[index]} alt={product.shoppingBag.product.name} />
//                   </a>
//                 </div>
//                 <div className="detail">
//                   <div className="name">
//                     <a href="/">{product.shoppingBag.product.name}</a>
//                   </div>
//                   <div className="description">{product.shoppingBag.product.description}</div>
//                   <div className="price">{formatCurrency(product.shoppingBag.product.price)}</div>
//                 </div>
//               </div>

//               <div className="col right">
//                 <div className="quantity">
//                   <input
//                     type="text"
//                     className="quantity"
//                     // step="1"
//                     defaultValue={product.shoppingBag.quantity}
//                     // onChange={(event) => onChangeProductQuantity(index, event)}
//                     onChange={(event) => {
//                       // console.log(event.target.value)
//                       if (event.target.value) {
//                         product.shoppingBag.quantity = event.target.value;
//                         calculateSubTotal(shoppingBags)
//                       }

//                       // quantity = event.target.value
//                     }}
//                   />
//                 </div>

//                 <div className="remove">
//                   <svg
//                     onClick={() => onRemoveProduct(product)}
//                     version="1.1"
//                     className="close"
//                     x="0px"
//                     y="0px"
//                     viewBox="0 0 60 60"
//                     enableBackground="new 0 0 60 60"
//                   >
//                     <polygon points="38.936,23.561 36.814,21.439 30.562,27.691 24.311,21.439 22.189,23.561 28.441,29.812 22.189,36.064 24.311,38.186 30.562,31.934 36.814,38.186 38.936,36.064 32.684,29.812" />
//                   </svg>
//                 </div>
//               </div>
//             </li>
//           );
//         })}
//       </ul>
//       <section className="container">
//         <div className="promotion">
//           {/* <label htmlFor="promo-code">Have A Promo Code?</label>
//           <input type="text" onChange={onEnterPromoCode} />
//           <button  className="button" type="button" onClick={checkPromoCode} /> */}
//         </div>

//         <div className="summary">
//           <ul>
//             <li>
//               SubTotal <span>&#8377;{(subTotal)}</span>
//             </li>
//             {discount > 0 && (
//               <li>
//                 Discount <span><span>-</span> {(discount)}%</span>
//               </li>
//             )}
//             <li>
//               Gst <span><span>+</span> {(tax)}%</span>
//             </li>
//             <li className="total">
//               Total <span>{formatCurrency(total)}</span>
//             </li>
//           </ul>
//         </div>

//         <div className="checkout">
//           <button className="button" type="button" onClick={gotoOrderAddress}>Check Out</button>
//         </div>
//       </section>

//       {/* <Summary
//         subTotal={subTotal}
//         discount={0}
//         tax={TAX}
//       // onEnterPromoCode={onEnterPromoCode}
//       // checkPromoCode={checkPromoCode}
//       /> */}
//     </section>
//   );
// }

// // function Summary({
// //   subTotal,
// //   discount,
// //   tax,
// //   onEnterPromoCode,
// //   checkPromoCode
// // }) {
// //   const navigate = useNavigate();
// //   const [total, setTotal] = useState(subTotal)
// //   useEffect(() => {
// //     setTotal(subTotal - discount + tax);
// //   }, [subTotal])

// //   const gotoOrderAddress = () => {

// //     navigate("/user/address")
// //   }
// //   return (
// //     <section className="container">
// //       <div className="promotion">
// //         {/* <label htmlFor="promo-code">Have A Promo Code?</label>
// //           <input type="text" onChange={onEnterPromoCode} />
// //           <button  className="button" type="button" onClick={checkPromoCode} /> */}
// //       </div>

// //       <div className="summary">
// //         <ul>
// //           <li>
// //             Subtotal <span>{formatCurrency(subTotal)}</span>
// //           </li>
// //           {discount > 0 && (
// //             <li>
// //               Discount <span>{formatCurrency(discount)}</span>
// //             </li>
// //           )}
// //           <li>
// //             Tax <span>{formatCurrency(tax)}</span>
// //           </li>
// //           <li className="total">
// //             Total <span>{formatCurrency(total)}</span>
// //           </li>
// //         </ul>
// //       </div>

// //       <div className="checkout">
// //         <button className="button" type="button" onClick={gotoOrderAddress}>Check Out</button>
// //       </div>
// //     </section>
// //   );
// // }

// // const PRODUCTS = [
// //   {
// //     image: "https://via.placeholder.com/200x150",
// //     name: "PRODUCT ITEM NUMBER 1",
// //     description: "Description for product item number 1",
// //     price: 5.99,
// //     quantity: 2
// //   },
// //   {
// //     image: "https://via.placeholder.com/200x150",
// //     name: "PRODUCT ITEM NUMBER 2",
// //     description: "Description for product item number 1",
// //     price: 9.99,
// //     quantity: 1
// //   }
// // ];
// const PROMOTIONS = [
//   {
//     code: "SUMMER",
//     discount: "50%"
//   },
//   {
//     code: "AUTUMN",
//     discount: "40%"
//   },
//   {
//     code: "WINTER",
//     discount: "30%"
//   }
// ];
// const TAX = 5;
// /////////////////////////////////////////////             SHOPPING CART               //////////////////////////////////////////////////////////////////
// function ShoppingCart() {

//   const [promoCode, setPromoCode] = React.useState("");
//   const [discountPercent, setDiscountPercent] = React.useState(0);
//   const { userShoppingBags } = useSelector((state) => state.userShoppingBag);
//   const CLONE_PRODUCTS = JSON.parse(JSON.stringify(userShoppingBags));
//   const [products, setProducts] = React.useState(CLONE_PRODUCTS);
//   const { profileData } = useSelector((state) => state.profile);
//   const { authData } = useSelector((state) => state.auth)


//   const dispatch = useDispatch();

//   useEffect(() => {
//     // console.log(userShoppingBags);
//     // console.log(profileData)
//     // console.log(authData)

//     // if (profileData) {
//     //   dispatch(userShoppingBagByUserId({ id: profileData.id, token: localStorage.getItem("token") })).then((data) => {
//     //     // eslint-disable-next-line no-const-assign
//     //     // setUserShoppingBag(data.payload);
//     //     // setProductCount(data.payload.length);
//     //     // console.log(data.payload)
//     //     console.log(userShoppingBags)

//     //   });
//     // }
//   }, [])

//   const onChangeProductQuantity = (index, event) => {
//     const value = event.target.value;
//     const valueInt = parseInt(value);
//     const cloneProducts = [...products];

//     // Minimum quantity is 1, maximum quantity is 100, can left blank to input easily
//     if (value === "") {
//       cloneProducts[index].quantity = value;
//     } else if (valueInt > 0 && valueInt < 100) {
//       cloneProducts[index].quantity = valueInt;
//     }

//     setProducts(cloneProducts);
//   };

//   const onRemoveProduct = (i) => {
//     const filteredProduct = products.filter((product, index) => {
//       return index !== i;
//     });
//     console.log("method called")

//     setProducts(filteredProduct);
//   };

//   const onEnterPromoCode = (event) => {
//     setPromoCode(event.target.value);
//   };

//   const checkPromoCode = () => {
//     for (var i = 0; i < PROMOTIONS.length; i++) {
//       if (promoCode === PROMOTIONS[i].code) {
//         setDiscountPercent(parseFloat(PROMOTIONS[i].discount.replace("%", "")));

//         return;
//       }
//     }

//     alert("Sorry, the Promotional code you entered is not valid!");
//   };

//   return (
//     <>
//       {userShoppingBags.length > 0 ? (<div>
//         <Header itemCount={userShoppingBags.length} />

//         {userShoppingBags.length > 0 ? (
//           <div>
//             <ProductList
//               products={userShoppingBags}
//               onChangeProductQuantity={onChangeProductQuantity}
//               onRemoveProduct={onRemoveProduct}
//             />


//           </div>
//         ) : (
//           <div className="empty-product">
//             <h3>There are no products in your cart.</h3>
//             <button className="button" onClick={() => setProducts(userShoppingBags?.shoppingBag?.product)}>Shopping now</button>
//           </div>
//         )}
//       </div>) :
//         (
//           <div>
//             <EmptyCart></EmptyCart>
//           </div>
//         )}
//     </>
//   );
// }

// // ReactDOM.render(<Page />, document.getElementById("root"));

// function formatCurrency(value) {
//   return Number(value).toLocaleString("en-US", {
//     style: "currency",
//     currency: "INR"
//   });
// }
// export default ShoppingCart;


import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import EmptyCart from './EmptyCart';
import { fetchUserCart, removeItemFromCart, updateItemQuantity } from '../../../features/cartReducer';
import { RiDeleteBin5Fill } from 'react-icons/ri';
import { IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const BASE_URL = process.env.REACT_APP_ECOMMERCE_API_ENDPOINT.replace('/api/v1', '');

function ShoppingCart() {

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const {cart, loading, error} = useSelector((state)=> state.cart);
    const userId = localStorage.getItem('userId');
    const [localCart, setLocalCart] = useState(null);

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
        return items.reduce((total, item) => total + (item.unitPrice * item.quantity), 0);
    };

    const handleQuantityChange = async (itemId, change) => {
        if (!userId || !localCart) return;
        const cartId = cart?.cartId;
        const item = localCart.items.find((item)=> item.product.id === itemId);

        if(item){
            const newQuantity = item.quantity + change;
            if (newQuantity < 1) return;

            const updatedItems = localCart.items.map(cartItem => {
                if (cartItem.product.id === itemId) {
                    return {
                        ...cartItem,
                        quantity: newQuantity,
                        totalPrice: cartItem.unitPrice * newQuantity
                    };
                }
                return cartItem;
            });

            const newSubtotal = calculateSubtotal(updatedItems);

            setLocalCart({
                ...localCart,
                items: updatedItems,
                totalAmount: newSubtotal
            });

            dispatch(updateItemQuantity({cartId, itemId, quantity: newQuantity}))
              .unwrap()
              .catch(error=>{
                setLocalCart(cart);
                console.error('Failed to update item quantity:', error); 
            });
        }
    };

    const handleDelete = (itemId)=>{
        if (!localCart) return;
        const cartId = localCart.cartId;

        const updatedItems = localCart.items.filter(item => item.product.id !== itemId);
        const newSubtotal = calculateSubtotal(updatedItems);

        setLocalCart({
            ...localCart,
            items: updatedItems,
            totalAmount: newSubtotal
        });
        dispatch(removeItemFromCart({cartId, itemId}))
            .unwrap()
            .then(() => {
                dispatch(fetchUserCart(userId));
                alert("Item removed from cart");
            })
            .catch(error => {
                setLocalCart(cart);
                console.error('Failed to delete item:', error);
            });
    }

    const handleContinueShopping = () => {
        navigate('/user/shopping');
    }

    const handleCheckout = () => {
        navigate('/user/checkout');
    }

    
    if (loading && !localCart) return <div>Loading...</div>;
    if (error)  return <EmptyCart />;

    if (!localCart?.items?.length) {
        return <EmptyCart />;
    }


    return (
        <div className="p-8 mt-20 mb-20">
            <div className="max-w-5xl mx-auto">
                <h1 className="text-2xl font-bold mb-8">Shopping Cart</h1>
                <table className="w-full text-left">
                    <thead>
                        <tr>
                            <th className="py-2">Product</th>
                            <th className="py-2">Quantity</th>
                            <th className="py-2">Price</th>
                            <th className="py-2">Total</th>
                            <th className="py-2">Remove</th>
                        </tr>
                    </thead>
                    <tbody>
                        {localCart.items.map(item => (
                            <tr key={item.itemId} className="border-t border-gray-400">
                                <td className="py-4">
                                    <div className='flex space-x-3'>
                                    <img src={`${BASE_URL}${item.product.images[0]?.downloadUrl}`} alt="" 
                                    className='w-24 h-24 object-cover rounded'
                                    onError={(e) => e.target.src = "https://icrier.org/wp-content/uploads/2022/12/media-Event-Image-Not-Found.jpg"}
                                    />
                                    <div>
                                        <p className='font-medium'>{item.product.subCategory.name}</p>
                                        <p className='mt-3 text-gray-500'>{item.product.name}</p>
                                        <p className='text-gray-500'>{item.product.brand}</p>
                                    </div>
                                    </div>
                                </td>
                                <td className="py-4">
                                    <div className='flex items-center'>
                                    <button
                                        className="px-2 py-1 text-white bg-gray-800 rounded"
                                        onClick={() => handleQuantityChange(item.product.id, -1)}
                                    >
                                        -
                                    </button>
                                    <span className="mx-4">{item.quantity}</span>
                                    <button
                                        className="px-2 py-1 text-white bg-gray-800 rounded"
                                        onClick={() => handleQuantityChange(item.product.id, 1)}
                                    >
                                        +
                                    </button>
                                    </div>
                                </td>
                                <td className="py-4">₹ {item.unitPrice.toFixed(2)}</td>
                                <td className="py-4">₹ {item.totalPrice.toFixed(2)}</td>
                                <td className="py-4"><IconButton onClick={()=> handleDelete(item.product.id)}><RiDeleteBin5Fill size={20} className='fill-red-600' /></IconButton></td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <hr />

                <div className="flex justify-center gap-10 mt-10">
                    <h2 className="text-xl font-bold mt-4">Sub Total:</h2>
                    <h2 className="text-xl font-bold mt-4">₹ {localCart.totalAmount.toFixed(2)}</h2>
                </div>

                <div className="flex justify-evenly mt-8">
                    <button onClick={handleContinueShopping} className="px-4 py-2 bg-gray-700 rounded text-white">Continue Shopping</button>
                    <button onClick={handleCheckout} className="px-4 py-2 bg-blue-600 rounded text-white">Proceed to Checkout</button>
                </div>
            </div>
        </div>
    )
}

export default ShoppingCart