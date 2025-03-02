import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addNewAddress, deleteAddress, fetchAddresses, placeOrder, selectAddress, setCurrentStep, setPaymentMethod } from '../../../features/checkoutReducer';
import { Check, Delete } from '@mui/icons-material';
import { clearCart, fetchUserCart } from '../../../features/cartReducer';
import { Alert, Dialog, DialogActions, DialogContent, DialogTitle, Snackbar } from '@mui/material';
import { replace, useNavigate } from 'react-router-dom';

const BASE_URL = process.env.REACT_APP_ECOMMERCE_API_ENDPOINT.replace('/api/v1', '');

function Checkout() {

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { currentStep, addresses, selectedAddress, paymentMethod, loading, error } = useSelector((state) => state.checkout);
    const { cart } = useSelector((state) => state.cart);

    const [showNewAddressForm, setShowNewAddressForm] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [addressToDelete, setAddressToDelete] = useState(null);
    const [orderProcessing, setOrderProcessing] = useState(false);
    const [orderError, setOrderError] = useState(null);
    const [showSuccessSnackbar, setShowSuccessSnackbar] = useState(false);
    const [newAddress, setNewAddress] = useState({
        name: "",
        street: "",
        city: "",
        state: "",
        country: "",
        zipCode: "",
        phoneNo: ""
    });

    const userId = localStorage.getItem('userId');
    const cartId = cart?.cartId;
    

    useEffect(() => {
        if (userId) {
            dispatch(fetchAddresses(userId));
            dispatch(fetchUserCart(userId));
        }
    }, [dispatch, userId]);

    const handleNewAddressSubmit = (e) => {
        e.preventDefault();
        try {

            dispatch(addNewAddress({ userId, address: newAddress }));
            setShowNewAddressForm(false);
            setNewAddress({
                name: "",
                street: "",
                city: "",
                state: "",
                country: "",
                zipCode: "",
                phoneNo: ""
            });
        } catch (error) {
            console.error('Failed to add address:', error);
        }
    };

    const handleAddressSelect = (address) => {
        dispatch(selectAddress(address));

    };

    const openDeleteDialog = (e, address) => {
        e.stopPropagation();
        setAddressToDelete(address);
        setDeleteDialogOpen(true);
    };

    const handleDeleteAddress = () => {
        try {
            dispatch(deleteAddress(addressToDelete.id));
            if (selectedAddress?.id === addressToDelete.id) {
                dispatch(selectAddress(null));
            }
            setDeleteDialogOpen(false);
            setAddressToDelete(null);
        } catch (error) {
            console.error('Failed to delete address:', error);
        }
    };

    const handlePlaceOrder = async () => {
        if (!selectedAddress) {
            setOrderError("Please select a delivery address");
            return;
        }

        setOrderProcessing(true);
        setOrderError(null);

        try {
            await dispatch(placeOrder({
                userId: userId,
                addressId: selectedAddress.id
            })).unwrap();

            setShowSuccessSnackbar(true);
            dispatch(clearCart(cartId));

            setTimeout(() => {
                navigate('/user/orders', { replace: true });
            }, 3000);
        } catch (error) {
            setOrderError(error.message || "Failed to place order. Please try again.");
        } finally {
            setOrderProcessing(false);
        }
    };

    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setShowSuccessSnackbar(false);
    };

    const steps = [
        { number: 1, title: "Select Address" },
        { number: 2, title: "Payment Method" },
        { number: 3, title: "Confirm Order" }
    ];

    const nextStep = () => {
        if (currentStep < steps.length) {
            dispatch(setCurrentStep(currentStep + 1));
        }
    };

    const prevStep = () => {
        if (currentStep > 1) {
            dispatch(setCurrentStep(currentStep - 1));
        }
    };

    if (loading && !addresses.length) return <div className="flex justify-center items-center h-64">Loading...</div>;
    if (error) return <div className="text-red-500 text-center mt-32">Error:{error.message}</div>;
    return (
        <div className="max-w-4xl mx-auto p-6 mt-20 mb-20">
            {/* Stepper Header */}
            <div className="flex justify-between items-center mb-8">
                {steps.map((step, index) => (
                    <div key={step.number} className="flex items-center">
                        <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 
                            ${currentStep > step.number
                                ? 'bg-green-500 border-green-500 text-white'
                                : currentStep === step.number
                                    ? 'border-blue-500 text-blue-500'
                                    : 'border-gray-300 text-gray-300'
                            }`}
                        >
                            {currentStep > step.number ? (
                                <Check className="w-6 h-6" />
                            ) : (
                                step.number
                            )}
                        </div>
                        <span className={`ml-2 ${currentStep >= step.number ? 'text-gray-900' : 'text-gray-400'
                            }`}>
                            {step.title}
                        </span>
                        {index < steps.length - 1 && (
                            <div className={`w-24 h-1 mx-4 ${currentStep > step.number ? 'bg-green-500' : 'bg-gray-200'
                                }`} />
                        )}
                    </div>
                ))}
            </div>


            <Dialog
                open={deleteDialogOpen}
                onClose={() => setDeleteDialogOpen(false)}
                maxWidth="xs"
                fullWidth
            >
                <DialogTitle className="text-lg font-medium">Delete Address</DialogTitle>
                <DialogContent>
                    <p className="text-gray-600">Are you sure you want to delete this address? This action cannot be undone.</p>
                </DialogContent>
                <DialogActions className="p-4">
                    <button
                        onClick={() => setDeleteDialogOpen(false)}
                        className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleDeleteAddress}
                        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 ml-2"
                    >
                        Delete
                    </button>
                </DialogActions>
            </Dialog>

            <Snackbar
                open={showSuccessSnackbar}
                autoHideDuration={2000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <Alert
                    onClose={handleCloseSnackbar}
                    severity="success"
                    sx={{ width: '100%' }}
                >
                    Order placed successfully! Redirecting to orders...
                </Alert>
            </Snackbar>

            {/* Step Content */}
            <div className="mt-8">
                {currentStep === 1 && (
                    <div>
                        <h2 className="text-xl font-semibold mb-4">Select Delivery Address</h2>

                        {/* Existing Addresses */}
                        <div className="space-y-4 mb-6">
                            {addresses?.map(address => (
                                <div
                                    key={address.id}
                                    className={`p-4 border rounded-lg cursor-pointer ${selectedAddress?.id === address.id
                                        ? 'border-blue-500 bg-blue-50'
                                        : 'border-gray-200 hover:border-blue-200'
                                        }`}
                                    onClick={() => handleAddressSelect(address)}
                                >
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="font-medium">{address.name}</p>
                                            <p className="text-gray-600">{address.street}</p>
                                            <p className="text-gray-600">{address.city}, {address.state},{address.country}</p>
                                            <p className="text-gray-600">Zip Code: {address.zipCode}</p>
                                            <p className="text-gray-600">Phone: {address.phoneNo}</p>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedAddress?.id === address.id
                                                ? 'border-blue-500 bg-blue-500'
                                                : 'border-gray-400'
                                                }`} >
                                                {selectedAddress?.id === address.id && (
                                                    <Check className="w-2 h-2 text-white" />
                                                )}
                                            </div>
                                            <button
                                                onClick={(e) => openDeleteDialog(e, address)}
                                                className="text-gray-400 hover:text-red-500 transition-colors"
                                            >
                                                <Delete />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Add New Address Button/Form */}
                        {!showNewAddressForm ? (
                            <button
                                onClick={() => setShowNewAddressForm(true)}
                                className="text-blue-500 font-medium hover:text-blue-600"
                            >
                                + Add New Address
                            </button>
                        ) : (
                            <form onSubmit={handleNewAddressSubmit} className="space-y-4 border rounded-lg p-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <input
                                        type="text"
                                        placeholder="Full Name"
                                        className="p-2 border rounded"
                                        value={newAddress.name}
                                        onChange={(e) => setNewAddress({ ...newAddress, name: e.target.value })}
                                        required
                                    />
                                    <input
                                        type="text"
                                        placeholder="Phone Number"
                                        className="p-2 border rounded"
                                        value={newAddress.phoneNo}
                                        onChange={(e) => setNewAddress({ ...newAddress, phoneNo: e.target.value })}
                                        required
                                    />
                                    <input
                                        type="text"
                                        placeholder="Street Address"
                                        className="p-2 border rounded col-span-2"
                                        value={newAddress.street}
                                        onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
                                        required
                                    />
                                    <input
                                        type="text"
                                        placeholder="City"
                                        className="p-2 border rounded"
                                        value={newAddress.city}
                                        onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                                        required
                                    />
                                    <input
                                        type="text"
                                        placeholder="State"
                                        className="p-2 border rounded"
                                        value={newAddress.state}
                                        onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                                        required
                                    />
                                    <input
                                        type="text"
                                        placeholder="Country"
                                        className="p-2 border rounded"
                                        value={newAddress.country}
                                        onChange={(e) => setNewAddress({ ...newAddress, country: e.target.value })}
                                        required
                                    />
                                    <input
                                        type="text"
                                        placeholder="PIN Code"
                                        className="p-2 border rounded"
                                        value={newAddress.zipCode}
                                        onChange={(e) => setNewAddress({ ...newAddress, zipCode: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="flex gap-4">
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                                    >
                                        Save Address
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setShowNewAddressForm(false)}
                                        className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                )}

                {currentStep === 2 && (
                    <div>
                        <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
                        <div className="p-4 border rounded-lg">
                            <div className="flex items-center space-x-3">
                                <input
                                    type="radio"
                                    id="cod"
                                    name="payment"
                                    checked={paymentMethod === 'cod'}
                                    onChange={() => dispatch(setPaymentMethod('cod'))}
                                    className="w-4 h-4"
                                />
                                <label htmlFor="cod" className="font-medium">
                                    Cash on Delivery
                                </label>
                            </div>
                            <p className="text-gray-500 mt-2 ml-7">
                                Pay when your order is delivered
                            </p>
                        </div>
                    </div>
                )}

                {currentStep === 3 && (
                    <div>
                        <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
                        <div className="space-y-4">
                            <div className='border rounded-lg p-4'>
                                <div className="grid grid-cols-5 gap-4 mb-3 font-semibold text-gray-600">
                                    <div className="col-span-2">Product</div>
                                    <div>Quantity</div>
                                    <div>Price</div>
                                    <div>Total</div>
                                </div>
                                {cart.items.map((item, index) => (
                                    <div key={index} className="grid grid-cols-5 gap-4 py-3 border-b last:border-b-0">
                                        <div className="col-span-2 flex items-center gap-3">
                                            <img
                                                src={`${BASE_URL}${item.product.images[0]?.downloadUrl}`}
                                                alt={item.product.name}
                                                className="w-16 h-16 object-cover rounded"
                                                onError={(e) => e.target.src = "https://icrier.org/wp-content/uploads/2022/12/media-Event-Image-Not-Found.jpg"}
                                            />
                                            <div className="flex flex-col justify-center">
                                                <span className="font-medium">{item.product.name}</span>
                                                <span className="text-gray-600 text-sm">{item.product.brand}</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center">× {item.quantity}</div>
                                        <div className="flex items-center">₹ {item.unitPrice}</div>
                                        <div className="flex items-center font-medium">₹ {item.totalPrice}</div>
                                    </div>
                                ))}
                                <div className="mt-4 mr-24">
                                    <div className="flex justify-end gap-5">
                                        <div className="font-semibold text-lg">Sub Total:</div>
                                        <div className="font-semibold text-lg">₹ {cart.totalAmount}</div>
                                    </div>
                                </div>
                            </div>
                            <div className="border rounded-lg p-4">
                                <h3 className="font-medium mb-2">Delivery Address</h3>
                                <p className="text-gray-600">{selectedAddress?.name}</p>
                                <p className="text-gray-600">{selectedAddress?.street}</p>
                                <p className="text-gray-600">
                                    {selectedAddress?.city}, {selectedAddress?.state}, {selectedAddress?.country}
                                </p>
                                <p className="text-gray-600">Zip Code: {selectedAddress?.zipCode}</p>
                                <p className="text-gray-600">Phone: {selectedAddress?.phoneNo}</p>
                            </div>
                            <div className="border rounded-lg p-4">
                                <h3 className="font-medium mb-2">Payment Method</h3>
                                <p className="text-gray-600">
                                    {paymentMethod === 'cod' ? 'Cash on Delivery' : paymentMethod}
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8">
                {currentStep > 1 && (
                    <button
                        onClick={prevStep}
                        className="px-6 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                    >
                        Back
                    </button>
                )}
                {currentStep < steps.length ? (
                    <button
                        onClick={nextStep}
                        disabled={currentStep === 1 && !selectedAddress}
                        className={`px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 ml-auto
                            ${currentStep === 1 && !selectedAddress ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        Continue
                    </button>
                ) : (
                    <button
                        onClick={handlePlaceOrder}
                        disabled={orderProcessing || !selectedAddress}
                        className={`px-6 py-2 bg-green-500 text-white rounded hover:bg-green-600 ml-auto flex items-center gap-2
                            ${(orderProcessing || !selectedAddress) ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        {orderProcessing ? (
                            <>
                                <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                                Processing...
                            </>
                        ) : (
                            'Place Order'
                        )}
                    </button>
                )}
            </div>
            {orderError && (
                <div className="mt-4 p-4 bg-red-50 text-red-500 rounded-md border border-red-100">
                    {orderError}
                </div>
            )}
        </div>
    )
}

export default Checkout