import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router-dom'
import { createCategory, fetchCategories, setSelectedCategory, updateCategory } from '../../../../features/CategoryReducer';
import { createSubCategory, fetchSubCategoryById, setSelectedSubCategory, updateSubCategory } from '../../../../features/SubCategoryReducer';

function AddSubCategoryForm() {
  
  const {id} = useParams();
  const isEditing = !!id;
  const [name, setName] = useState("");
  const [categoryId, setCategoryId] = useState(null);
  const [error, seterror] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const categories = useSelector((state) => state.category.categories);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  useEffect(() => {
          if (isEditing) {
              dispatch(fetchSubCategoryById(id)).then((action) => {
                  if (action.payload) {
                      setName(action.payload.name);
                      setCategoryId(action.payload.category.id);
                  }
              })
          }
      }, [id, isEditing, dispatch]);


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      seterror('Category name is required !');
      return;
    }
    if (!categoryId) {
      seterror('Please select a category!');
      return;
    }
    try {
      if (isEditing) {
        await dispatch(updateSubCategory({ categoryId: categoryId ,subCategoryId: id, subCategoryData: { name } })).unwrap();
        alert("SubCategory updated successfully");
      } else {
        await dispatch(createSubCategory({ categoryId, subCategoryData: { name } })).unwrap();
        alert("SubCategory added successfully !");
      }

      navigate("/admin/category?tab=1");
    } catch (e) {
      seterror(e.message);
    }
  }

  const handleCancel = () => {
    navigate('/admin/category?tab=1');
  }
  return (

    <form
      className="max-w-md mx-auto mt-5 p-6 bg-white border rounded-lg shadow-lg"
      onSubmit={handleSubmit}
    >
      <h2 className="text-2xl font-bold mb-6">{isEditing ? 'Edit SubCategory' : 'Add New SubCategory'}</h2>

      <div className="mb-4">
        <label className="block text-gray-700 font-bold mb-2" htmlFor="category">
          Category:
        </label>
        <select
          className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="category"
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
        >
          <option value="">
            Select a category
          </option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 font-bold mb-2" for="name">
          Name:
        </label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="name"
          type="text"
          placeholder="Enter subcategory name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <div className="flex justify-end gap-4">
        <button onClick={handleCancel}
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          type="button"
        >
          Cancel
        </button>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          type="submit"
        >
          {isEditing ? 'save' : 'Add'}
        </button>
      </div>
    </form>
  )
}

export default AddSubCategoryForm