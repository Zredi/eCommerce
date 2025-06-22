





import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
    Box, Button, Card, CardContent, Dialog, DialogActions, DialogContent, DialogTitle,
    Stepper, Step, StepLabel, StepContent, Typography, TextField, CircularProgress,
    Grid, Paper, Chip, Divider, Avatar, Badge, IconButton, Tooltip
} from '@mui/material';
import {
    Download, Cancel, Replay, LocalShipping, CheckCircle,
    Inventory, Receipt, HomeOutlined, AccessTime, ShoppingBag
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { fetchAddressById } from '../../../features/checkoutReducer';
import { fetchInvoiceByOrderId } from '../../../features/InvoiceReducer';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { fetchOrderById, updateOrderStatus } from '../../../features/OrderReducer';
import { getReturnByOrder, requestReturn } from '../../../features/ReturnReducer';


const BASE_URL = process.env.REACT_APP_ECOMMERCE_API_ENDPOINT.replace('/api/v1', '');


const OrderCard = styled(Card)(({ theme }) => ({
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
    borderRadius: '12px',
    transition: 'all 0.3s ease',
    '&:hover': {
        boxShadow: '0 6px 25px rgba(0,0,0,0.15)',
    }
}));

const StatusChip = styled(Chip)(({ theme, status }) => {
    const colors = {
        'PENDING': { bg: '#FFF9C4', color: '#FBC02D', borderColor: '#FBC02D' },
        'PROCESSING': { bg: '#E3F2FD', color: '#1976D2', borderColor: '#1976D2' },
        'SHIPPED': { bg: '#E8F5E9', color: '#43A047', borderColor: '#43A047' },
        'DELIVERED': { bg: '#E8F5E9', color: '#2E7D32', borderColor: '#2E7D32' },
        'CANCELLED': { bg: '#FFEBEE', color: '#E53935', borderColor: '#E53935' },
        'PENDING_RETURN': { bg: '#FFF3E0', color: '#F57C00', borderColor: '#F57C00' },
        'APPROVED': { bg: '#E0F7FA', color: '#0097A7', borderColor: '#0097A7' },
        'COMPLETED': { bg: '#E8F5E9', color: '#388E3C', borderColor: '#388E3C' }
    }[status] || { bg: '#F5F5F5', color: '#757575', borderColor: '#757575' };

    return {
        backgroundColor: colors.bg,
        color: colors.color,
        borderColor: colors.borderColor,
        border: `1px solid ${colors.borderColor}`,
        fontWeight: 600,
        textTransform: 'uppercase',
        fontSize: '0.75rem',
        height: '24px'
    };
});

const ActionButton = styled(Button)(({ theme }) => ({
    borderRadius: '8px',
    textTransform: 'none',
    boxShadow: 'none',
    fontWeight: 600,
    padding: '8px 16px',
    '&:hover': {
        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
    }
}));

const ProductCard = styled(Paper)(({ theme }) => ({
    padding: '16px',
    marginBottom: '16px',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    transition: 'all 0.2s ease',
    '&:hover': {
        boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
        transform: 'translateY(-2px)'
    }
}));

const ProductAvatar = styled(Avatar)(({ theme }) => ({
    backgroundColor: theme.palette.grey[200],
    width: 50,
    height: 50
}));

const InfoLabel = styled(Typography)(({ theme }) => ({
    color: theme.palette.text.secondary,
    fontWeight: 500,
    fontSize: '0.875rem',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '4px'
}));

// Improved stepper component
const CustomStepper = styled(Stepper)(({ theme }) => ({
    '& .MuiStepLabel-root': {
        padding: '12px 0'
    },
    '& .MuiStepLabel-iconContainer': {
        paddingRight: '16px'
    },
    '& .MuiStepConnector-line': {
        minHeight: '32px'
    }
}));

const getSteps = (orderStatus, returnStatus) => {
    const steps = [
        {
            label: 'Order Placed',
            description: 'Your order has been placed successfully',
            icon: <ShoppingBag />
        },
        {
            label: 'Processing',
            description: 'We are preparing your order for shipment',
            icon: <Inventory />
        },
        {
            label: 'Shipped',
            description: 'Your order has been shipped',
            icon: <LocalShipping />
        },
        {
            label: 'Delivered',
            description: 'Your order has been delivered',
            icon: <CheckCircle />
        }
    ];

    if (orderStatus === 'CANCELLED') {
        return [
            {
                label: 'Order Placed',
                description: 'Your order has been placed successfully',
                icon: <ShoppingBag />
            },
            {
                label: 'Cancelled',
                description: 'Your order has been cancelled',
                icon: <Cancel />
            }
        ];
    }

    if (returnStatus) {
        const returnStep = {
            'PENDING': {
                label: 'Return Requested',
                description: 'Return request is being processed',
                icon: <Replay />
            },
            'APPROVED': {
                label: 'Return Approved',
                description: 'Your return request has been approved',
                icon: <CheckCircle />
            },
            'COMPLETED': {
                label: 'Return Completed',
                description: 'Return process has been completed',
                icon: <CheckCircle />
            }
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
    const [showInvoiceAlert, setShowInvoiceAlert] = useState(false);

    const { selectedOrder: order, loading: orderLoading } = useSelector((state) => state.order);
    const { currentInvoice, loading: invoiceLoading } = useSelector((state) => state.invoice);
    const { singleReturn, loading: returnLoading } = useSelector((state) => state.return);
    const [address, setAddress] = useState(null);
    const [addressLoading, setAddressLoading] = useState(false);


    console.log("orders", order);
    

    useEffect(() => {
        dispatch(fetchOrderById(orderId));
        dispatch(fetchInvoiceByOrderId(orderId));
        dispatch(getReturnByOrder(orderId));
    }, [orderId, dispatch]);

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
        setShowInvoiceAlert(true);
        setTimeout(() => setShowInvoiceAlert(false), 3000);
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
        if (addressLoading) return <CircularProgress size={20} />;
        if (!address) return <Typography>Address not available</Typography>;

        return (
            <Box>
                <InfoLabel><HomeOutlined fontSize="small" /> Delivery Address</InfoLabel>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {address.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {address.street}<br />
                    {address.city}, {address.state}, {address.country}<br />
                    {address.zipCode}<br />
                    Phone: {address.phoneNo}
                </Typography>
            </Box>
        );
    };

    const renderOrderDates = () => {
        return (
            <Box sx={{ mt: 3 }}>
                <InfoLabel><AccessTime fontSize="small" /> Order Timeline</InfoLabel>
                <Grid container spacing={2} sx={{ mt: 1 }}>
                    <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">Order Date:</Typography>
                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                            {new Date(order.orderDate).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric'
                            })}
                        </Typography>
                    </Grid>
                    {order.status === 'DELIVERED' && (
                        <Grid item xs={6}>
                            <Typography variant="body2" color="text.secondary">Delivered On:</Typography>
                            <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                {/* Simulated delivery date for demo purposes */}
                                {new Date(new Date(order.orderDate).getTime() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric'
                                })}
                            </Typography>
                        </Grid>
                    )}
                </Grid>
            </Box>
        );
    };

    if (orderLoading || invoiceLoading || returnLoading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="80vh" flexDirection="column">
                <CircularProgress />
                <Typography sx={{ mt: 2 }}>Loading order details...</Typography>
            </Box>
        );
    }

    if (!order) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="80vh">
                <Paper sx={{ p: 4, textAlign: 'center', maxWidth: 400 }}>
                    <Typography variant="h6">Order not found</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        The order you're looking for doesn't exist or has been removed.
                    </Typography>
                    <Button
                        variant="contained"
                        sx={{ mt: 3 }}
                        onClick={() => navigate('/user/orders')}
                    >
                        Back to Orders
                    </Button>
                </Paper>
            </Box>
        );
    }

    const steps = getSteps(order.status, singleReturn?.status?.toUpperCase());
    const activeStep = getActiveStep(order.status, singleReturn?.status?.toUpperCase());
    const canDownloadInvoice = order.status === 'DELIVERED' || singleReturn?.status?.toUpperCase() === 'COMPLETED';
    const canReturn = order.status === 'DELIVERED' && !singleReturn;
    const canCancel = !['SHIPPED', 'DELIVERED', 'CANCELLED'].includes(order.status);

    return (
        <div className="container mt-32 mb-20">
            {showInvoiceAlert && (
                <Box
                    sx={{
                        position: 'fixed',
                        top: '80px',
                        right: '20px',
                        zIndex: 1500,
                        p: 2,
                        bgcolor: 'success.light',
                        borderRadius: '8px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1
                    }}
                >
                    <CheckCircle color="success" />
                    <Typography>Invoice downloaded successfully!</Typography>
                </Box>
            )}

            <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                    <Typography variant="h4" sx={{ fontWeight: 700 }}>Order Details</Typography>
                    <Typography variant="body1" color="text.secondary">
                        Track and manage your order
                    </Typography>
                </Box>
                <Button variant="outlined" onClick={() => navigate(-1)}>
                    Back to All Orders
                </Button>
            </Box>

            <Grid container spacing={3}>
                <Grid item xs={12} md={8}>
                    <OrderCard className="mb-4">
                        <CardContent>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                                <Box>
                                    <Typography variant="h5" sx={{ fontWeight: 600 }}>
                                        Order #{order.id}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Placed on {new Date(order.orderDate).toLocaleDateString()}
                                    </Typography>
                                </Box>
                                <StatusChip
                                    label={singleReturn?.status?.toUpperCase() || order.status}
                                    status={singleReturn?.status?.toUpperCase() || order.status}
                                />
                            </Box>

                            <Grid container spacing={3}>
                                <Grid item xs={12} md={6}>
                                    <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                                        Order Progress
                                    </Typography>
                                    <Box sx={{ maxWidth: 400 }}>
                                        <CustomStepper activeStep={activeStep} orientation="vertical">
                                            {steps.map((step, index) => (
                                                <Step key={step.label}>
                                                    <StepLabel
                                                        StepIconProps={{
                                                            icon: step.icon,
                                                            active: index <= activeStep
                                                        }}
                                                    >
                                                        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                                                            {step.label}
                                                        </Typography>
                                                    </StepLabel>
                                                    <StepContent>
                                                        <Typography variant="body2">{step.description}</Typography>
                                                    </StepContent>
                                                </Step>
                                            ))}
                                        </CustomStepper>
                                    </Box>
                                </Grid>

                                <Grid item xs={12} md={6}>
                                    <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                                        Actions
                                    </Typography>
                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                        <ActionButton
                                            variant="outlined"
                                            startIcon={<Download />}
                                            onClick={generatePDF}
                                            disabled={!canDownloadInvoice}
                                            fullWidth
                                            sx={{
                                                bgcolor: canDownloadInvoice ? 'rgba(25, 118, 210, 0.05)' : undefined,
                                                borderColor: canDownloadInvoice ? 'primary.main' : undefined
                                            }}
                                        >
                                            Download Invoice
                                        </ActionButton>

                                        <ActionButton
                                            variant="outlined"
                                            startIcon={<Replay />}
                                            color="warning"
                                            onClick={() => setReturnDialogOpen(true)}
                                            disabled={!canReturn}
                                            fullWidth
                                            sx={{
                                                bgcolor: canReturn ? 'rgba(237, 108, 2, 0.05)' : undefined,
                                                borderColor: canReturn ? 'warning.main' : undefined
                                            }}
                                        >
                                            Return Order
                                        </ActionButton>

                                        <ActionButton
                                            variant="outlined"
                                            startIcon={<Cancel />}
                                            color="error"
                                            onClick={() => setCancelDialogOpen(true)}
                                            disabled={!canCancel}
                                            fullWidth
                                            sx={{
                                                bgcolor: canCancel ? 'rgba(211, 47, 47, 0.05)' : undefined,
                                                borderColor: canCancel ? 'error.main' : undefined
                                            }}
                                        >
                                            Cancel Order
                                        </ActionButton>
                                    </Box>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </OrderCard>

                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>Order Items</Typography>
                    {order.items.map((item, index) => (
                        <ProductCard key={index} elevation={1}>
                            <div className="w-16 h-16 bg-gray-100 rounded-md flex items-center justify-center">
                                <img
                                    src={`${BASE_URL}${item.productImageUrl}`}
                                    alt={item.productName}
                                    className="max-w-full max-h-full object-contain"
                                    onError={(e) => e.target.src = "https://icrier.org/wp-content/uploads/2022/12/media-Event-Image-Not-Found.jpg"}
                                />
                            </div>
                            <Box sx={{ flexGrow: 1 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                        {item.productName}
                                    </Typography>
                                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                        ₹{item.price * item.quantity}
                                    </Typography>
                                </Box>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                                    <Typography variant="body2" color="text.secondary">
                                        {item.productBrand}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        ₹{item.price} × {item.quantity}
                                    </Typography>
                                </Box>
                            </Box>
                        </ProductCard>
                    ))}

                    <Paper elevation={1} sx={{ p: 2, borderRadius: 2, mt: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="subtitle1">Subtotal</Typography>
                            <Typography variant="body1">₹{order.totalAmount}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
                            <Typography variant="subtitle1">Shipping</Typography>
                            <Typography variant="body1">Free</Typography>
                        </Box>
                        <Divider sx={{ my: 2 }} />
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="h6" sx={{ fontWeight: 600 }}>Order Total</Typography>
                            <Typography variant="h6" sx={{ fontWeight: 700 }}>₹{order.totalAmount}</Typography>
                        </Box>
                    </Paper>
                </Grid>

                <Grid item xs={12} md={4}>
                    <OrderCard sx={{ position: 'sticky', top: '100px' }}>
                        <CardContent>
                            <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                                Order Information
                            </Typography>

                            {/* Payment info */}
                            <Box sx={{ mb: 3 }}>
                                <InfoLabel><Receipt fontSize="small" /> Payment</InfoLabel>
                                <Chip
                                    label="PAID"
                                    size="small"
                                    sx={{
                                        bgcolor: 'success.light',
                                        color: 'success.dark',
                                        fontWeight: 600,
                                        mr: 1
                                    }}
                                />
                                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                    Payment method: Online
                                </Typography>
                            </Box>

                            <Divider sx={{ my: 2 }} />

                            {/* Shipping address */}
                            {renderAddress()}

                            <Divider sx={{ my: 2 }} />

                            {/* Order dates */}
                            {renderOrderDates()}

                            {/* If there's a return */}
                            {singleReturn && (
                                <>
                                    <Divider sx={{ my: 2 }} />
                                    <Box>
                                        <InfoLabel><Replay fontSize="small" /> Return Information</InfoLabel>
                                        <Typography variant="body2" sx={{ mt: 1 }}>
                                            <strong>Status:</strong> {singleReturn.status}
                                        </Typography>
                                        <Typography variant="body2" sx={{ mt: 1 }}>
                                            <strong>Reason:</strong> {singleReturn.reason}
                                        </Typography>
                                        <Typography variant="body2" sx={{ mt: 1 }}>
                                            <strong>Requested on:</strong> {new Date(singleReturn.createdAt).toLocaleDateString()}
                                        </Typography>
                                    </Box>
                                </>
                            )}
                        </CardContent>
                    </OrderCard>
                </Grid>
            </Grid>

            {/* Cancel Dialog */}
            <Dialog
                open={cancelDialogOpen}
                onClose={() => setCancelDialogOpen(false)}
                PaperProps={{
                    sx: { borderRadius: 2 }
                }}
            >
                <DialogTitle sx={{ fontWeight: 600 }}>Cancel Order</DialogTitle>
                <DialogContent>
                    <Typography>
                        Are you sure you want to cancel this order? This action cannot be undone.
                    </Typography>
                </DialogContent>
                <DialogActions sx={{ pb: 2, px: 3 }}>
                    <Button
                        onClick={() => setCancelDialogOpen(false)}
                        variant="outlined"
                    >
                        No, Keep Order
                    </Button>
                    <Button
                        onClick={handleCancel}
                        color="error"
                        variant="contained"
                        startIcon={<Cancel />}
                    >
                        Yes, Cancel Order
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Return Dialog */}
            <Dialog
                open={returnDialogOpen}
                onClose={() => setReturnDialogOpen(false)}
                PaperProps={{
                    sx: { borderRadius: 2 }
                }}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle sx={{ fontWeight: 600 }}>Return Order</DialogTitle>
                <DialogContent>
                    <Typography sx={{ mb: 3 }}>
                        Please tell us why you want to return this order. This will help us improve our products and services.
                    </Typography>
                    <TextField
                        label="Return Reason"
                        variant="outlined"
                        fullWidth
                        multiline
                        rows={4}
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        placeholder="Please describe why you're returning this order..."
                        InputProps={{
                            sx: { borderRadius: 2 }
                        }}
                    />
                </DialogContent>
                <DialogActions sx={{ pb: 2, px: 3 }}>
                    <Button
                        onClick={() => setReturnDialogOpen(false)}
                        variant="outlined"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleReturn}
                        color="warning"
                        variant="contained"
                        startIcon={<Replay />}
                        disabled={!reason.trim()}
                    >
                        Submit Return Request
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default UserOrderDetails;