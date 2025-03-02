import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { fetchProducts } from '../../../features/ProductReducer';
import { restockInventory } from '../../../features/InventoryReducer';

function PurchaseForm() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isEditing = false;

  const [error, setError] = useState('');

  const { products, loading, error: productError } = useSelector((state) => state.product);
  const { loading: inventoryLoading, error: inventoryError } = useSelector((state) => state.inventory);


  const [purchaseData, setPurchaseData] = useState({
    productId: null,
    quantityAdded: null,
    source: '',
    reason: '',
    unitPrice: null,
    totalPrice: null
  });

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const numericValue = name === 'quantityAdded' || name === 'unitPrice'
      ? parseFloat(value)
      : value;

    const updatedData = {
      ...purchaseData,
      [name]: numericValue
    };

    if (name === 'unitPrice' || name === 'quantityAdded') {
      if (updatedData.unitPrice > 0 && updatedData.quantityAdded > 0) {
        updatedData.totalPrice = (updatedData.unitPrice * updatedData.quantityAdded).toFixed(2);
      } else {
        updatedData.totalPrice = null;
      }
    }

    setPurchaseData(updatedData);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!purchaseData.productId) {
      setError('Please select a product');
      return;
    }
    if (purchaseData.quantityAdded <= 0) {
      setError('Quantity must be greater than 0');
      return;
    }
    if (!purchaseData.source.trim()) {
      setError('Supplier is required');
      return;
    }
    if (!purchaseData.reason.trim()) {
      setError('Reason is required');
      return;
    }
    if (!purchaseData.unitPrice || purchaseData.unitPrice <= 0) {
      setError('Unit price must be greater than 0');
      return;
    }

    try {
      await dispatch(restockInventory(purchaseData)).unwrap();
      alert('Purchase Record added successfully');
      navigate('/sales');
    } catch (error) {
      setError(error?.message || 'Failed to add purchase record');
    }
  }

  return (
    <form onSubmit={handleFormSubmit} className="max-w-2xl mt-5 mx-auto p-6 bg-white border rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6">{isEditing ? "Update Record" : "Add Purchase Record"}</h2>

      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">Product</label>
        <select
          name="productId"
          value={purchaseData.productId || ''}
          onChange={handleInputChange}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        >
          <option value="">Select a Product</option>
          
          {products.length > 0 ? (
            products.map(product => (
              <option key={product.id} value={product.id}>
                {product.name}
              </option>
            ))
          ) : (
            <option disabled>No products found. Please add products.</option>
          )}
        </select>
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">Quantity Added</label>
        <input
          type="number"
          name="quantityAdded"
          value={purchaseData.quantityAdded}
          onChange={handleInputChange}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          min="1"
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">Unit Price</label>
        <input
          type="number"
          name="unitPrice"
          value={purchaseData.unitPrice}
          onChange={handleInputChange}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          placeholder="Enter unit price"
          step="0.01"
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">Total Price</label>
        <input
          type="number"
          name="totalPrice"
          value={purchaseData.totalPrice}
          disabled
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 bg-gray-200 leading-tight focus:outline-none focus:shadow-outline"
          placeholder="Total price will be calculated automatically"
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">Supplier</label>
        <input
          type="text"
          name="source"
          value={purchaseData.source}
          onChange={handleInputChange}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          placeholder="Enter supplier name"
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">Reason</label>
        <textarea
          name="reason"
          value={purchaseData.reason}
          onChange={handleInputChange}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          placeholder="Enter purchase reason"
          rows={3}
        />
      </div>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <div className="flex justify-end gap-4">
        <Link to="/sales"
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          type="button"
        >
          Cancel
        </Link>
        <button
          className="bg-green-500 hover:bg-green-700 cursor-pointer text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          type="submit"
        >
          {isEditing ? 'Update' : 'Add'}
        </button>
      </div>
    </form>

  )
}

export default PurchaseForm