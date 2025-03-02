import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchAllSales, fetchSalesByDateRange } from '../../../features/salesReducer';
import { fetchAllInventories } from '../../../features/InventoryReducer';
import { FaEye, FaPrint, FaFilePdf, FaFileDownload } from 'react-icons/fa';
import { IconButton, Tab, Tabs, Tooltip } from '@mui/material';
import { fetchInvoiceBySaleId } from '../../../features/InvoiceReducer';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

function Sales() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const printRef = useRef();
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: ''
  });

  const { sales, loading: salesLoading, error: salesError } = useSelector((state) => state.sales);
  const { inventories, loading: inventoryLoading, error: inventoryError } = useSelector((state) => state.inventory);
  const {currentInvoice} = useSelector((state)=> state.invoice);

  useEffect(() => {
    dispatch(fetchAllSales());
    dispatch(fetchAllInventories());
  }, [dispatch]);

  const handleAddSaleRecord = () => {
    navigate('/admin/add-sale');
  };

  const handleAddPurchaseRecord = () => {
    navigate('/admin/add-purchase');
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    setSearchQuery('');
    setFilter('all');
  };

  const handlePrint = () => {
    const printContent = printRef.current;
    const originalContent = document.body.innerHTML;
    document.body.innerHTML = printContent.innerHTML;
    window.print();
    document.body.innerHTML = originalContent;
    window.location.reload();
  };

  const handleDateRangeSubmit = (e) => {
    e.preventDefault();
    if (dateRange.startDate && dateRange.endDate) {
      dispatch(fetchSalesByDateRange({
        startDate: new Date(dateRange.startDate),
        endDate: new Date(dateRange.endDate)
      }));
    }
  };

  const handleDateChange = (e) => {
    const { name, value } = e.target;
    setDateRange(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleViewSale = (sale) => {
    // Handle view sale details
    console.log('View sale:', sale);
  };

  const handleDownloadInvoice = async (saleId) => {
    try {
      const sale = sales.find(s => s.id === saleId);
      
      await dispatch(fetchInvoiceBySaleId(saleId)).unwrap();
      const doc = new jsPDF();

        doc.setFontSize(20);
        doc.text('INVOICE', 105, 15, { align: 'center' });

        doc.setFontSize(12);
        doc.text(`Invoice No: ${currentInvoice?.invoiceNumber}`, 15, 30);
        doc.text(`Date: ${new Date(currentInvoice?.invoiceDate).toLocaleDateString()}`, 15, 40);

        doc.setFontSize(14);
        doc.text('Customer Information:', 15, 55);
        doc.setFontSize(12);
        const addressLines = [
            sale?.customerName,
            `Phone: ${sale?.customerPhone}`
        ];
        addressLines.forEach((line, index) => {
            if (line) doc.text(line, 15, 65 + (index * 7));
        });

        const tableHeaders = [['Product', 'Quantity', 'Price', 'Total']];
        const tableData = sale.items.map(item => [
            item.productName,
            item.quantity.toString(),
            `₹${item.unitPrice}`,
            `₹${item.totalPrice}`
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
        doc.text(`Total Amount: ₹${sale.totalAmount}`, 15, finalY + 20);

        doc.save(`${currentInvoice?.invoiceNumber}.pdf`);
      
      
    } catch (error) {
      console.error('Error downloading invoice:', error);
    }
  };

  const filteredTableData = activeTab === 0
    ? sales?.filter(sale => {
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch = 
        sale.id?.toString().toLowerCase().includes(searchLower) ||
        sale.paymentMethod?.toLowerCase().includes(searchLower) ||
        sale.totalAmount?.toString().includes(searchLower);

      const matchesFilter = 
        filter === 'all' || 
        sale.paymentMethod?.toLowerCase() === filter.toLowerCase();

      return matchesSearch && matchesFilter;
    })
    : inventories?.filter(item => {
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch = item.stock.product?.name?.toLowerCase().includes(searchLower);

      const matchesFilter = 
        filter === 'all' || 
        (filter === 'name' && item.stock.product?.name);

      return matchesSearch && matchesFilter;
    });

  if (salesLoading || inventoryLoading) {
    return <div className="flex justify-center items-center h-screen">
      <div className="h-20 w-20 animate-spin rounded-full border-8 border-gray-300 border-t-green-600"></div>
    </div>;
  }

  if (salesError || inventoryError) {
    return (
      <div className="px-2 text-center">
          <div className="flex flex-col justify-center items-center">
              <h1 className="text-3xl font-extrabold text-red-500">Session Expired!</h1>
              <p className="text-xl mt-5 font-medium text-gray-800">Please login again</p>
          </div>
      </div>
  );
  }

  return (
    <div className="container mx-auto px-6 py-5">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-extrabold bg-gradient-to-r from-[#5A9A7A] to-[#2DD4BF] bg-clip-text text-transparent">
                    Sales & Purchases
                </h2>
                <div className="flex gap-4">
                    <Tooltip title="Print Table">
                        <IconButton 
                            onClick={handlePrint}
                            className="bg-gradient-to-r from-[#5A9A7A] to-[#2DD4BF] text-white p-2 rounded-lg shadow-md hover:from-[#2DD4BF] hover:to-[#5A9A7A] transform hover:scale-105 transition-all duration-200"
                        >
                            <FaPrint className="text-white" />
                        </IconButton>
                    </Tooltip>
                    <button
                        onClick={activeTab === 0 ? handleAddSaleRecord : handleAddPurchaseRecord}
                        className="bg-gradient-to-r from-[#5A9A7A] to-[#2DD4BF] text-white px-6 py-2 rounded-lg shadow-md hover:from-[#2DD4BF] hover:to-[#5A9A7A] transform hover:scale-105 transition-all duration-200"
                    >
                        {activeTab === 0 ? '+ Add Sale' : '+ Add Purchase'}
                    </button>
                </div>
            </div>

            <Tabs
                value={activeTab}
                onChange={handleTabChange}
                aria-label="sales tabs"
                sx={{
                    '& .MuiTabs-indicator': { backgroundColor: '#2DD4BF' },
                    '& .Mui-selected': { color: '#2DD4BF !important', fontWeight: 'bold' },
                    '& .MuiTab-root': { textTransform: 'none', fontSize: '1rem', padding: '10px 20px' },
                }}
                className="bg-gray-50 rounded-lg shadow-sm mb-2"
            >
                <Tab label="Sales" />
                <Tab label="Purchases" />
            </Tabs>

            <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border border-gray-100">
                <div className="flex flex-col md:flex-row gap-4 items-center">
                    <div className="relative flex-1">
                        <svg className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" 
                             xmlns="http://www.w3.org/2000/svg" 
                             viewBox="0 0 20 20" 
                             fill="currentColor">
                            <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                        </svg>
                        <input
                            className="w-full py-2.5 pl-10 pr-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#2DD4BF] focus:border-transparent outline-none transition-all duration-200"
                            type="search"
                            placeholder={activeTab === 0 ? "Search Sales..." : "Search Purchases..."}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <select
                        className="w-full md:w-48 py-2.5 px-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#2DD4BF] focus:border-transparent outline-none transition-all duration-200 bg-white"
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                    >
                        {activeTab === 0 ? (
                            <>
                                <option value="all">All Sales</option>
                                <option value="cash">Cash</option>
                                <option value="card">Card</option>
                                <option value="upi">UPI</option>
                            </>
                        ) : (
                            <>
                                <option value="all">All Purchases</option>
                                <option value="name">Sort by Name</option>
                            </>
                        )}
                    </select>
                    {/* {activeTab === 0 && (
                        <form onSubmit={handleDateRangeSubmit} className="flex gap-4">
                            <input
                                type="date"
                                name="startDate"
                                value={dateRange.startDate}
                                onChange={handleDateChange}
                                className="py-2 px-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#5A9A7A] focus:border-transparent outline-none transition-all duration-200"
                            />
                            <input
                                type="date"
                                name="endDate"
                                value={dateRange.endDate}
                                onChange={handleDateChange}
                                className="py-2 px-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#5A9A7A] focus:border-transparent outline-none transition-all duration-200"
                            />
                            <button
                                type="submit"
                                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-all duration-200"
                            >
                                Filter
                            </button>
                        </form>
                    )} */}
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
                <div ref={printRef}>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                                <tr>
                                    {activeTab === 0
                                        ? ['SL', 'Date', 'Products', 'Total Amount', 'Payment Method', 'Customer', 'Actions'].map(header => (
                                            <th key={header} className="p-4 text-left text-sm font-semibold text-gray-700 tracking-wide">
                                                {header}
                                            </th>
                                        ))
                                        : ['SL', 'Date', 'Product', 'Quantity Added', 'Unit Price', 'Supplier', 'Reason', 'Total Price'].map(header => (
                                            <th key={header} className="p-4 text-left text-sm font-semibold text-gray-700 tracking-wide">
                                                {header}
                                            </th>
                                        ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredTableData?.length > 0 ? filteredTableData.map((item, index) => (
                                    <tr 
                                        key={item.id} 
                                        className="hover:bg-gray-50 transition-all duration-200 transform hover:-translate-y-0.5"
                                    >
                                        <td className="p-4 text-gray-600">{index + 1}</td>
                                        {activeTab === 0 ? (
                                            <>
                                                <td className="p-4 text-gray-600">{new Date(item.saleDate).toLocaleString()}</td>
                                                <td className="p-4">
                                                    {item.items.map(product => (
                                                        <div key={product.productId} className="text-sm text-gray-800">
                                                            {product.productName} × {product.quantity}
                                                        </div>
                                                    ))}
                                                </td>
                                                <td className="p-4 font-medium text-gray-800">₹{item.totalAmount}</td>
                                                <td className="p-4">
                                                    <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                                                        {item.paymentMethod}
                                                    </span>
                                                </td>
                                                <td className="p-4 text-gray-600">
                                                    <div>{item.customerName}</div>
                                                    <div className="text-xs text-gray-500">{item.customerPhone}</div>
                                                </td>
                                                <td className="p-4">
                                                    <div className="flex gap-2">
                                                        <Tooltip title="View">
                                                            <IconButton onClick={() => handleViewSale(item)} className="hover:bg-blue-100">
                                                                <FaEye className="text-blue-600" />
                                                            </IconButton>
                                                        </Tooltip>
                                                        <Tooltip title="Download Invoice">
                                                            <IconButton onClick={() => handleDownloadInvoice(item.id)} className="hover:bg-blue-100">
                                                                <FaFileDownload className="text-blue-600" />
                                                            </IconButton>
                                                        </Tooltip>
                                                    </div>
                                                </td>
                                            </>
                                        ) : (
                                            <>
                                                <td className="p-4 text-gray-600">
                                                    {new Date(item.timestamp).toLocaleString('en-GB', {
                                                        day: '2-digit',
                                                        month: '2-digit',
                                                        year: 'numeric',
                                                        hour: 'numeric',
                                                        minute: 'numeric',
                                                        hour12: true
                                                    })}
                                                </td>
                                                <td className="p-4">
                                                    <div className="font-medium text-gray-800">{item.stock?.product?.name}</div>
                                                    <div className="text-xs text-gray-500">{item.stock?.product?.brand}</div>
                                                </td>
                                                <td className="p-4 text-gray-600">{item.quantityAdded}</td>
                                                <td className="p-4 text-gray-600">₹{item.unitPrice}</td>
                                                <td className="p-4 text-gray-600">{item.source}</td>
                                                <td className="p-4 text-gray-600">{item.reason}</td>
                                                <td className="p-4 font-medium text-gray-800">₹{item.totalPrice}</td>
                                            </>
                                        )}
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={activeTab === 0 ? 7 : 8} className="p-8 text-center text-gray-500">
                                            <div className="flex flex-col items-center gap-2">
                                                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                                                </svg>
                                                <span>No {activeTab === 0 ? 'sales' : 'purchases'} found</span>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
  );
}

export default Sales;
