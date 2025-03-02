import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
    Box, Button, Card, CardContent, Dialog, DialogActions, DialogContent, DialogTitle,
    Stepper, Step, StepLabel, StepContent, Typography, TextField, CircularProgress
} from '@mui/material';
import { Download, Cancel, Replay } from '@mui/icons-material';
import { fetchAddressById } from '../../../features/checkoutReducer';
import { fetchInvoiceByOrderId } from '../../../features/InvoiceReducer';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { fetchOrderById, updateOrderStatus } from '../../../features/OrderReducer';
import { getReturnByOrder, requestReturn } from '../../../features/ReturnReducer';

const getSteps = (orderStatus, returnStatus) => {
    const steps = [
        { label: 'Order Placed', description: 'Your order has been placed successfully' },
        { label: 'Processing', description: 'We are preparing your order for shipment' },
        { label: 'Shipped', description: 'Your order has been shipped' },
        { label: 'Delivered', description: 'Your order has been delivered' }
    ];

    if (orderStatus === 'CANCELLED') {
        return [
            { label: 'Order Placed', description: 'Your order has been placed successfully' },
            { label: 'Cancelled', description: 'Your order has been cancelled' }
        ];
    }

    if (returnStatus) {
        const returnStep = {
            'PENDING': { label: 'Return Requested', description: 'Return request is being processed' },
            'APPROVED': { label: 'Return Approved', description: 'Your return request has been approved' },
            'COMPLETED': { label: 'Return Completed', description: 'Return process has been completed' }
        }[returnStatus];

        if (returnStep) {
            return [...steps, returnStep];
        }
    }

    return steps;
};

const getActiveStep = (orderStatus, returnStatus) => {
    if (orderStatus === 'CANCELLED') return 1;
    if (returnStatus) return 4;

    return {
        'PENDING': 0,
        'PROCESSING': 1,
        'SHIPPED': 2,
        'DELIVERED': 3
    }[orderStatus] || 0;
};

function UserOrderDetails() {
    const { orderId, userId } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
    const [returnDialogOpen, setReturnDialogOpen] = useState(false);
    const [reason, setReason] = useState("");

    const { selectedOrder: order, loading: orderLoading } = useSelector((state) => state.order);
    const { currentInvoice, loading: invoiceLoading } = useSelector((state) => state.invoice);
    const { singleReturn, loading: returnLoading } = useSelector((state) => state.return);
    const [address, setAddress] = useState(null);
    const [addressLoading, setAddressLoading] = useState(false);

    useEffect(() => {
        dispatch(fetchOrderById(orderId));
        dispatch(fetchInvoiceByOrderId(orderId));
        dispatch(getReturnByOrder(orderId));
    }, [orderId, dispatch]);

    console.log("invoice", currentInvoice);
    console.log("return", singleReturn);
    
    

    useEffect(() => {
        if (order?.addressId) {
            setAddressLoading(true);
            dispatch(fetchAddressById(order.addressId))
                .then((response) => {
                    if (response.payload) {
                        setAddress(response.payload);
                    }
                })
                .catch((error) => {
                    console.error('Error fetching address:', error);
                })
                .finally(() => {
                    setAddressLoading(false);
                });
        }
    }, [order?.addressId, dispatch]);

    const generatePDF = () => {
        const doc = new jsPDF();

        doc.setFontSize(20);
        doc.text('INVOICE', 105, 15, { align: 'center' });

        doc.setFontSize(12);
        doc.text(`Invoice No: ${currentInvoice?.invoiceNumber}`, 15, 30);
        doc.text(`Date: ${new Date(currentInvoice?.invoiceDate).toLocaleDateString()}`, 15, 40);

        doc.setFontSize(14);
        doc.text('Shipping Address:', 15, 55);
        doc.setFontSize(12);
        const addressLines = [
            address?.name,
            address?.street,
            `${address?.city}, ${address?.state}, ${address?.country}`,
            `${address?.zipCode}`,
            `Phone: ${address?.phoneNo}`
        ];
        addressLines.forEach((line, index) => {
            if (line) doc.text(line, 15, 65 + (index * 7));
        });

        const tableHeaders = [['Product', 'Brand', 'Quantity', 'Price', 'Total']];
        const tableData = order.items.map(item => [
            item.productName,
            item.productBrand,
            item.quantity.toString(),
            `₹${item.price}`,
            `₹${item.quantity * item.price}`
        ]);

        doc.autoTable({
            head: tableHeaders,
            body: tableData,
            startY: 110,
            theme: 'grid',
            styles: { fontSize: 10 },
            headStyles: { fillColor: [66, 66, 66] }
        });

        const finalY = doc.previousAutoTable.finalY || 150;
        doc.setFontSize(14);
        doc.text(`Total Amount: ₹${order.totalAmount}`, 15, finalY + 20);

        doc.save(`${currentInvoice?.invoiceNumber}.pdf`);
    };

    const handleCancel = () => {
        dispatch(updateOrderStatus({ orderId, status: 'CANCELLED' }))
            .then(() => {
                setCancelDialogOpen(false);
                navigate('/user/orders');
            });
    };

    const handleReturn = () => {
        if (!reason.trim()) {
            alert("Please provide a reason for return.");
            return;
        }
        dispatch(requestReturn({ userId, orderId, reason }))
            .then(() => {
                setReturnDialogOpen(false);
                dispatch(getReturnByOrder(orderId));
            });
    };

    const renderAddress = () => {
        if (addressLoading) return <Typography>Loading address...</Typography>;
        if (!address) return <Typography>Address not available</Typography>;

        return (
            <Typography variant="body1">
                {address.name}<br />
                {address.street}<br />
                {address.city}, {address.state}, {address.country}<br />
                {address.zipCode}<br />
                Phone: {address.phoneNo}
            </Typography>
        );
    };

    if (orderLoading || invoiceLoading || returnLoading) {
        return <Box display="flex" justifyContent="center" mt={5}><CircularProgress /></Box>;
    }

    if (!order) {
        return <Typography variant="h6" className="mt-32 text-center">Order not found</Typography>;
    }

    const steps = getSteps(order.status, singleReturn?.status.toUpperCase());
    const activeStep = getActiveStep(order.status, singleReturn?.status.toUpperCase());

    return (
        <div className="container mt-32 mb-20">
            <div className="row">
                <div className="col-md-8">
                    <Card className="mb-4">
                        <CardContent>
                            <Box className="d-flex justify-content-between align-items-center mb-4">
                                <Typography variant="h5">Order #{order.id}</Typography>
                                <Box>
                                    <Button
                                        startIcon={<Download />}
                                        onClick={generatePDF}
                                        className="me-2"
                                        disabled={order.status === 'PENDING' || order.status === 'SHIPPED' || order.status === 'PROCESSING' || order.status === 'CANCELLED'}
                                    >
                                        Download Invoice
                                    </Button>

                                    <Button
                                        startIcon={<Replay />}
                                        color="warning"
                                        onClick={() => setReturnDialogOpen(true)}
                                        disabled={order.status !== 'DELIVERED' || !!singleReturn}
                                    >
                                        Return Order
                                    </Button>

                                    <Button
                                        startIcon={<Cancel />}
                                        color="error"
                                        onClick={() => setCancelDialogOpen(true)}
                                        disabled={order.status === 'SHIPPED' || order.status === 'DELIVERED' || order.status === 'CANCELLED'}
                                    >
                                        Cancel Order
                                    </Button>
                                </Box>
                            </Box>

                            <Box sx={{ maxWidth: 400 }}>
                                <Stepper activeStep={activeStep} orientation="vertical">
                                    {steps.map((step, index) => (
                                        <Step key={step.label}>
                                            <StepLabel>
                                                <Typography variant="subtitle1">{step.label}</Typography>
                                            </StepLabel>
                                            <StepContent>
                                                <Typography>{step.description}</Typography>
                                            </StepContent>
                                        </Step>
                                    ))}
                                </Stepper>
                            </Box>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent>
                            <Typography variant="h6" className="mb-3">Order Items</Typography>
                            {order.items.map((item, index) => (
                                <div key={index} className="d-flex justify-content-between align-items-center mb-3">
                                    <div>
                                        <Typography variant="subtitle1">{item.productName}</Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {item.productBrand}
                                        </Typography>
                                    </div>
                                    <div className="text-end">
                                        <Typography variant="subtitle1">
                                            ₹{item.price} × {item.quantity}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            ₹{item.price * item.quantity}
                                        </Typography>
                                    </div>
                                </div>
                            ))}
                            <div className="border-top pt-3 mt-3">
                                <Typography variant="h6" className="text-end">
                                    Total: ₹{order.totalAmount}
                                </Typography>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="col-md-4">
                    <Card>
                        <CardContent>
                            <Typography variant="h6" className="mb-3">Shipping Details</Typography>
                            {renderAddress()}
                        </CardContent>
                    </Card>
                </div>
            </div>

            <Dialog open={cancelDialogOpen} onClose={() => setCancelDialogOpen(false)}>
                <DialogTitle>Cancel Order</DialogTitle>
                <DialogContent>
                    Are you sure you want to cancel this order?
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setCancelDialogOpen(false)}>No</Button>
                    <Button onClick={handleCancel} color="error">Yes, Cancel Order</Button>
                </DialogActions>
            </Dialog>

            <Dialog open={returnDialogOpen} onClose={() => setReturnDialogOpen(false)}>
                <DialogTitle>Return Order</DialogTitle>
                <DialogContent>
                    <p className='mb-3'>Are you sure you want to return this order?</p>
                    <TextField
                        label="Return Reason"
                        variant="outlined"
                        fullWidth
                        multiline
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setReturnDialogOpen(false)}>No</Button>
                    <Button onClick={handleReturn} color="warning">Yes, Return Order</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default UserOrderDetails;