import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom'
import { fetchCategories } from '../../../../features/CategoryReducer';
import { createProduct, updateProduct } from '../../../../features/ProductReducer';
import { updateImage, uploadImages } from '../../../../features/imageReducer';
import { fetchSubcategoriesByCategory } from '../../../../features/SubCategoryReducer';

function AddProductForm() {

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { categories, loading, error } = useSelector((state) => state.category);
  const selectedProduct = useSelector((state) => state.product.selectedProduct);
  const isEditing = Boolean(selectedProduct);

  const [subcategories, setSubcategories] = useState([]);
  const [selectedSubcategory, setSelectedSubcategory] = useState('');

  const [previews, setPreviews] = useState([null, null, null]);
  const [images, setImages] = useState([]);
  const [existingImageIds, setExistingImageIds] = useState([]);
  const [productData, setProductData] = useState({
    name: '',
    brand: '',
    category: { name: '' },
    subCategory: {name:''},
    price: 0,
    description: '',
    isPopular: 'false',
  });

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  useEffect(() => {
    if (selectedProduct && selectedProduct.category) {
      dispatch(fetchSubcategoriesByCategory(selectedProduct.category.name)).then((action) => {
        if (action.payload) {
          setSubcategories(action.payload);
          setSelectedSubcategory(selectedProduct.subCategory.name);
        }
      });
    }
  }, [selectedProduct, dispatch]);

  useEffect(() => {
    if (selectedProduct) {
      setProductData({
        name: selectedProduct.name,
        brand: selectedProduct.brand,
        category: { name: selectedProduct.category.name },
        subCategory: {name:selectedProduct.subCategory.name},
        price: selectedProduct.price,
        description: selectedProduct.description,
        isPopular: selectedProduct.isPopular,
      });

      if (selectedProduct.images && selectedProduct.images.length > 0) {
        const baseUrl = (import.meta.env.VITE_ECOMMERCE_API_ENDPOINT || "").replace('/api/v1', '');
        const newPreviews = selectedProduct.images.map(img => `${baseUrl}${img.downloadUrl}`);
        setPreviews([...newPreviews, ...Array(3 - newPreviews.length).fill(null)]);

        const imageIds = selectedProduct.images.map(img => img.id);
        setExistingImageIds(imageIds);
      }
    }
  }, [selectedProduct]);

  const handleFileChange = (index, event) => {
    const file = event.target.files[0];

    if (file) {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          const newPreviews = [...previews];
          newPreviews[index] = reader.result;
          setPreviews(newPreviews);
        };
        reader.readAsDataURL(file);

        const newImages = [...images];
        newImages[index] = file;
        setImages(newImages);

        console.log(`File added at index ${index}:`, file.name);
      } else {
        alert('Please select a valid image file.');
      }
    } else {
      alert('No file selected.');
    }
  };

  const handleCategoryChange = (e) => {
    const selectedCategoryName = e.target.value;
    const selectedCategory = categories.find(cat => cat.name === selectedCategoryName);

    setProductData({ ...productData, category: { name: selectedCategoryName } });

    if(selectedCategory){
      dispatch(fetchSubcategoriesByCategory(selectedCategory.name)).then((action)=>{
        if(action.payload){
          setSubcategories(action.payload);
          setSelectedSubcategory('');
          setProductData(prev => ({...prev, subCategory: {name: ''}}));
        }
      })
    } else{
      setSubcategories([]);
      setSelectedSubcategory('');
    }
  };

  const handleSubcategoryChange = (e) => {
    const selectedSubcategoryName = e.target.value;
    setSelectedSubcategory(selectedSubcategoryName);
    setProductData({ 
      ...productData, 
      subCategory: { name: selectedSubcategoryName } 
    });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      let product;
      if (isEditing) {
        product = await dispatch(updateProduct({ id: selectedProduct.id, productData })).unwrap();
        alert("Product updated successfully");
      } else {
        product = await dispatch(createProduct(productData)).unwrap();
      }

      for (let i = 0; i < images.length; i++) {
        const file = images[i];
        if (file) {
          if (isEditing && existingImageIds[i]) {
            await dispatch(updateImage({ imageId: existingImageIds[i], file })).unwrap();
          } else {
            await dispatch(uploadImages({ files: [file], productId: product.id })).unwrap();
          }
        }
      }
      alert(`Product ${isEditing ? 'updated' : 'created'} successfully`);
      navigate("/admin/products");
    } catch (error) {
      console.log('error',error);
      alert("Failed to create product:" + error.message);
    }
  }

  return (
    <form onSubmit={handleFormSubmit} encType='multipart/form-data' className="max-w-2xl mt-5 mb-10 mx-auto p-6 bg-white border rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6">{isEditing ? "Update Product" : "Add Product"}</h2>
      <div className="mb-4 flex gap-4">
        <div className="w-1/2">
          <label className="block text-gray-700 font-bold mb-2" for="name">Name:</label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="name"
            type="text"
            placeholder="Enter product name"
            value={productData.name}
            onChange={(e) => setProductData({ ...productData, name: e.target.value })}
          />
        </div>
        <div className="w-1/2">
          <label className="block text-gray-700 font-bold mb-2" for="brand">Brand:</label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="brand"
            type="text"
            placeholder="Enter brand name"
            value={productData.brand}
            onChange={(e) => setProductData({ ...productData, brand: e.target.value })}
          />
        </div>
      </div>

      <div className="mb-4 flex gap-4">
        <div className="w-1/2">
          <label className="block text-gray-700 font-bold mb-2" for="category">Category:</label>
          <select
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="category"
            value={productData.category.name}
            onChange={handleCategoryChange}
          >
            <option value="">Select Category</option>
            {loading ? (
              <option disabled>Loading...</option>
            ) : error ? (
              <option disabled>Error loading categories</option>
            ) : categories.length === 0 ? (
              <option disabled>Category not found</option>
            ) : (
              categories.map((category) => (
                <option key={category.id} value={category.name}>{category.name}</option>
              ))
            )}
          </select>
        </div>
        <div className="w-1/2">
          <label className="block text-gray-700 font-bold mb-2" for="category">SubCategory:</label>
          <select
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="subcategory"
            value={productData.subCategory.name}
            onChange={handleSubcategoryChange}
          >
            <option value="">Select SubCategory</option>
            {loading ? (
              <option disabled>Loading...</option>
            ) : error ? (
              <option disabled>Error loading subcategories</option>
            ) : subcategories.length === 0 ? (
              <option disabled>SubCategory not found</option>
            ) : (
              subcategories.map((subcategory) => (
                <option key={subcategory.id} value={subcategory.name}>{subcategory.name}</option>
              ))
            )}
          </select>
        </div>
      </div>

      <div className="mb-4 flex gap-4">
      <div className="w-1/2">
          <label className="block text-gray-700 font-bold mb-2" for="ispopular">Is Popular:</label>
          <select
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="ispopular"
            value={productData.isPopular}
            onChange={(e) => setProductData({ ...productData, isPopular: e.target.value })}
          >
            <option value="true">True</option>
            <option value="false">False</option>
          </select>
        </div>
        <div className="w-1/2">
          <label className="block text-gray-700 font-bold mb-2" for="price">Price:</label>
          <div className="relative">
            <span className="absolute font-semibold inset-y-0 left-0 flex items-center pl-3 text-gray-700">₹</span>
            <input
              className="shadow appearance-none border rounded w-full py-2 pl-8 pr-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="price"
              type="number"
              placeholder="Enter price"
              value={productData.price}
              onChange={(e) => setProductData({ ...productData, price: e.target.value })}
            />
          </div>
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 font-bold mb-2" for="description">Description:</label>
        <textarea
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="description"
          rows="4"
          placeholder="Enter description"
          value={productData.description}
          onChange={(e) => setProductData({ ...productData, description: e.target.value })}
        ></textarea>
      </div>

      <div className='flex justify-center items-center mb-5'>
        {[0, 1, 2].map((index) => (
          <div key={index} className="mx-auto rounded-md border border-indigo-500 bg-gray-50 p-4 shadow-md w-36 h-36">
            <label for={`upload-${index}`} className="flex flex-col items-center gap-2 cursor-pointer">
              {previews[index] ? (
                <img src={previews[index]} alt='preview' className='h-20 w-20 object-cover rounded-md' />
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 fill-white stroke-indigo-500" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              )}

              <span className="text-gray-600 font-medium">{previews[index] ? (isEditing && existingImageIds[index] ? 'update' : 'change') : 'upload'}</span>
            </label>
            <input id={`upload-${index}`} type="file" className="hidden" accept='image/*' onChange={(event) => handleFileChange(index, event)} />
          </div>
        ))}

      </div>

      <div className="flex justify-end gap-4">
        <Link to="/admin/products"
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          type="button"
        >
          Cancel
        </Link>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          type="submit"
        >
          {isEditing ? 'Update' : 'Add'}
        </button>
      </div>
    </form>

  )
}

export default AddProductForm