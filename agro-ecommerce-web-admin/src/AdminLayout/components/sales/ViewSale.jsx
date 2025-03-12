// ViewSale.jsx
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';

const ViewSale = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { sale } = location.state || {};

  if (!sale) {
    return (
      <div className="container mx-auto px-6 py-5">
        <p className="text-red-500">No sale data available</p>
        <button
          onClick={() => navigate('/admin/sales')}
          className="mt-4 flex items-center gap-2 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
        >
          <FaArrowLeft /> Back to Sales
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-5">
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Sale Details - #{sale.id}</h2>
          {/* <button
            onClick={() => navigate('/admin/sales')}
            className="flex items-center gap-2 bg-gradient-to-r from-[#5A9A7A] to-[#2DD4BF] text-white px-4 py-2 rounded-lg hover:from-[#2DD4BF] hover:to-[#5A9A7A]"
          >
            <FaArrowLeft /> Back to Sales
          </button> */}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Customer Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-700">Customer Details</h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p><strong>Name:</strong> {sale.customerName || 'N/A'}</p>
              <p><strong>Phone:</strong> {sale.customerPhone || 'N/A'}</p>
            </div>
          </div>

          {/* Sale Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-700">Sale Information</h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p><strong>Date:</strong> {new Date(sale.saleDate).toLocaleString()}</p>
              <p><strong>Payment Method:</strong> {sale.paymentMethod || 'N/A'}</p>
              <p><strong>Total Amount:</strong> ₹{sale.totalAmount}</p>
              <p><strong>GST:</strong> {sale.gstPercentage}%</p>
              <p><strong>Final Amount:</strong> ₹{sale.finalAmount}</p>
            </div>
          </div>
        </div>

        {/* Items List */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Items Purchased</h3>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead className="bg-gray-200">
                <tr>
                  <th className="p-3 text-left text-sm font-semibold text-gray-700">Product</th>
                  <th className="p-3 text-left text-sm font-semibold text-gray-700">Quantity</th>
                  <th className="p-3 text-left text-sm font-semibold text-gray-700">Unit Price</th>
                  <th className="p-3 text-left text-sm font-semibold text-gray-700">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {sale.items.map((item) => (
                  <tr key={item.productId} className="hover:bg-gray-50">
                    <td className="p-3 text-gray-600">{item.productName}</td>
                    <td className="p-3 text-gray-600">{item.quantity}</td>
                    <td className="p-3 text-gray-600">₹{item.unitPrice}</td>
                    <td className="p-3 text-gray-600">₹{item.totalPrice}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewSale;