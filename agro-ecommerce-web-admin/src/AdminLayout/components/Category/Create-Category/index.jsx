import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router-dom'
import { createCategory, fetchCategoryById, setSelectedCategory, updateCategory } from '../../../../features/CategoryReducer';
import { showSuccessSnackbar, showErrorSnackbar } from '../../../../utils/snackbar';
import CustomSnackbar from '../../common/Snackbar';

function AddCategoryForm() {

    const [name, setName] = useState("");
    const [error, setError] = useState(null);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditing = !!id;


    useEffect(() => {
        if (isEditing) {

            dispatch(fetchCategoryById(id)).then((action) => {
                if (action.payload) {
                    setName(action.payload.name);
                }
            })
        }
    }, [id, isEditing, dispatch]);


    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!name.trim()) {
            setError('Category name is required !');
            return;
        }
        try {
            if (isEditing) {
                await dispatch(updateCategory({ id: id, categoryData: { name } })).unwrap();
                showSuccessSnackbar(dispatch, "Category updated successfully");
                // alert("Category updated successfully");
            } else {
                await dispatch(createCategory({ name })).unwrap();
                showSuccessSnackbar(dispatch, "Category added successfully");
                // alert("Category added successfully !");
            }

            navigate("/admin/category");
        } catch (e) {
            setError(e.message);
        }
    }

    const handleCancel = () => {
        navigate('/admin/category');
    }
    return (
        
            <form
                className="max-w-md mx-auto mt-5 p-6 bg-white border rounded-lg shadow-lg"
                onSubmit={handleSubmit}
            >
                <h2 className="text-3xl font-extrabold bg-gradient-to-r from-[#5A9A7A] to-[#2DD4BF] bg-clip-text text-transparent mb-6">{isEditing ? 'Edit Category' : 'Add New Category'}</h2>
                <div className="mb-4">
                    <label className="block text-gray-700 font-bold mb-2" for="name">
                        Name:
                    </label>
                    <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="name"
                        type="text"
                        placeholder="Enter category name"
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

export default AddCategoryForm