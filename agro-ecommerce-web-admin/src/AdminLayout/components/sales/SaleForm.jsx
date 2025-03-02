import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { fetchProducts } from '../../../features/ProductReducer';
import { IconButton } from '@mui/material';
import { FaTrash } from 'react-icons/fa';
import { fetchStockByProductId } from '../../../features/StockReducer';
import { createOfflineSale } from '../../../features/salesReducer';

function SaleForm() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [error, setError] = useState('');

  const { products, loading: productsLoading } = useSelector((state) => state.product);
  const { loading: saleLoading } = useSelector((state) => state.sales);
  const { stock, loading: stockLoading } = useSelector((state) => state.stock);

  const [saleData, setSaleData] = useState({
    customerName: '',
    customerPhone: '',
    paymentMethod: '',
    items: [],
    totalAmount: 0,
    gstPercentage: 18,
    gstAmount: 0,
    finalAmount: 0
  });

  const [currentItem, setCurrentItem] = useState({
    productId: '',
    quantity: 1
  });

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);


  const calculateAmounts = (items, gstPercentage) => {
    const totalAmount = items.reduce((sum, item) => sum + item.totalPrice, 0);
    const gstAmount = (totalAmount * gstPercentage) / 100;
    const finalAmount = totalAmount + gstAmount;

    return {
      totalAmount,
      gstAmount,
      finalAmount
    };
  };


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSaleData(prev => {
      const newData = {
        ...prev,
        [name]: value
      };

      
      if (name === 'gstPercentage') {
        const amounts = calculateAmounts(prev.items, parseFloat(value));
        return {
          ...newData,
          ...amounts
        };
      }

      return newData;
    });
  };

  const handleItemChange = (e) => {
    const { name, value } = e.target;
    setCurrentItem(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const addItem = async () => {
    if (!currentItem.productId || currentItem.quantity <= 0) {
      setError('Please select a product and enter a valid quantity');
      return;
    }

    try {
      await dispatch(fetchStockByProductId(currentItem.productId)).unwrap();
      
      if (!stock || stock.currentStock < 1) {
        setError('This product is out of stock');
        return;
      }

      if (stock.currentStock < currentItem.quantity) {
        setError(`Only ${stock.currentStock} units available in stock`);
        return;
      }

      const product = products.find(p => p.id === parseInt(currentItem.productId));
      if (!product) return;

      const newItem = {
        productId: parseInt(currentItem.productId),
        productName: product.name,
        quantity: parseInt(currentItem.quantity),
        unitPrice: product.price,
        totalPrice: product.price * parseInt(currentItem.quantity)
      };

      setSaleData(prev => {
        const newItems = [...prev.items, newItem];
        const amounts = calculateAmounts(newItems, prev.gstPercentage);
  
        return {
          ...prev,
          items: newItems,
          ...amounts
        };
      });

      setCurrentItem({
        productId: '',
        quantity: 1
      });
      setError(''); 
    } catch (err) {
      setError('Failed to check product stock');
    }
  };

  const removeItem = (index) => {
    setSaleData(prev => {
      const newItems = [...prev.items];
      newItems.splice(index, 1);
      const amounts = calculateAmounts(newItems, prev.gstPercentage);

      return {
        ...prev,
        items: newItems,
        ...amounts
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!saleData.customerName.trim()) {
      setError('Customer name is required');
      return;
    }
    if (!saleData.customerPhone.trim()) {
      setError('Customer phone is required');
      return;
    }
    if (!saleData.paymentMethod) {
      setError('Payment method is required');
      return;
    }
    if (saleData.items.length === 0) {
      setError('Please add at least one item');
      return;
    }

    try {
      await dispatch(createOfflineSale(saleData)).unwrap();
      navigate('/admin/sales');
    } catch (err) {
      
      setError(err.message || 'Failed to create sale');
    }
  };

  if (productsLoading) {
    return <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-20 w-20 border-t-2 border-b-2 border-green-500"></div>
    </div>;
  }

  const calculateTotalWithGST = () => {
    const gstAmount = (saleData.totalAmount * saleData.gstPercentage) / 100;
    return saleData.totalAmount + gstAmount;
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-4xl mx-auto">
      <form onSubmit={handleSubmit} className="bg-white border rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-6">Create New Sale</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Customer Name
            </label>
            <input
              type="text"
              name="customerName"
              value={saleData.customerName}
              onChange={handleInputChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Enter customer name"
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Customer Phone
            </label>
            <input
              type="tel"
              name="customerPhone"
              value={saleData.customerPhone}
              onChange={handleInputChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Enter phone number"
            />
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Payment Method
          </label>
          <select
            name="paymentMethod"
            value={saleData.paymentMethod}
            onChange={handleInputChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          >
            <option value="">Select Payment Method</option>
            <option value="CASH">Cash</option>
            <option value="CARD">Card</option>
            <option value="UPI">UPI</option>
          </select>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-4">Add Items</h3>
          <div className="flex flex-col sm:flex-row gap-4">
            <select
              name="productId"
              value={currentItem.productId}
              onChange={handleItemChange}
              className="shadow appearance-none border rounded w-full sm:w-1/2 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            >
              <option value="">Select Product</option>
              {products.map(product => (
                <option key={product.id} value={product.id}>
                  {product.name} - ₹{product.price}
                </option>
              ))}
            </select>

            <input
              type="number"
              name="quantity"
              value={currentItem.quantity}
              onChange={handleItemChange}
              min="1"
              className="shadow appearance-none border rounded w-full sm:w-1/4 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Quantity"
            />

            <button
              type="button"
              onClick={addItem}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full sm:w-auto"
            >
              Add Item
            </button>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-4">Items</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unit Price</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {saleData.items.map((item, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap">{item.productName}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{item.quantity}</td>
                    <td className="px-6 py-4 whitespace-nowrap">₹{item.unitPrice}</td>
                    <td className="px-6 py-4 whitespace-nowrap">₹{item.totalPrice}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <IconButton onClick={() => removeItem(index)} color="error">
                        <FaTrash size={16} />
                      </IconButton>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mb-6 bg-gray-50 p-6 rounded-lg shadow-sm">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="w-full md:w-48">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                GST (%)
              </label>
              <input
                type="number"
                name="gstPercentage"
                value={saleData.gstPercentage}
                onChange={handleInputChange}
                min="0"
                max="100"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            <div className="w-full md:w-auto space-y-3">
              <div className="flex justify-between items-center gap-4">
                <span className="text-gray-600 font-medium">Subtotal:</span>
                <span className="text-lg font-semibold">₹ {saleData.totalAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center gap-4">
                <span className="text-gray-600 font-medium">GST ({saleData.gstPercentage}%):</span>
                <span className="text-lg font-semibold">₹ {saleData.gstAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center gap-4 pt-2 border-t">
                <span className="text-gray-800 font-bold">Final Amount:</span>
                <span className="text-xl font-bold text-green-600">₹ {saleData.finalAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-6">
            <p className="text-red-500">{error}</p>
          </div>
        )}

        <div className="flex justify-end gap-4">
          <Link
            to="/admin/sales"
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={saleLoading}
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50"
          >
            {saleLoading ? 'Creating...' : 'Create Sale'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default SaleForm;