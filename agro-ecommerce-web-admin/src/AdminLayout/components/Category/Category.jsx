import { IconButton, Tab, Tabs, Tooltip } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { deleteCategory, fetchCategories } from '../../../features/CategoryReducer';
import { FaEdit } from 'react-icons/fa';
import { RiDeleteBin5Fill } from 'react-icons/ri';
import { deleteSubCategory, fetchSubCategories } from '../../../features/SubCategoryReducer';
import { showSuccessSnackbar } from '../../../utils/snackbar';

function Category() {

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const initialTab = parseInt(searchParams.get('tab') || '0');

  const { categories, loading: categoriesLoading, error: categoriesError } = useSelector((state) => state.category);
  const { subCategories, loading: subcategoriesLoading, error: subcategoriesError } = useSelector((state) => state.subCategory);

  const [activeTab, setActiveTab] = useState(initialTab);
  const [filter, setFilter] = useState("all");
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [filteredSubcategories, setFilteredSubcategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab) {
      setActiveTab(parseInt(tab));
    }
  }, [location.search]);
  useEffect(() => {
    dispatch(fetchCategories());
    dispatch(fetchSubCategories());
  }, [dispatch]);

  useEffect(() => {
    let result = [...categories];

    if (filter === 'name') {
      result = result.sort((a, b) => a.name.localeCompare(b.name));
    }

    if (searchQuery) {
      result = result.filter((category) => category.name.toLowerCase().includes(searchQuery.toLowerCase()));
    }

    setFilteredCategories(result);
  }, [categories, filter, searchQuery]);

  useEffect(() => {
    let result = Array.isArray(subCategories) ? [...subCategories] : [];

    if (filter === 'name') {
      result = result.sort((a, b) => a.name.localeCompare(b.name));
    }

    if (searchQuery) {
      result = result.filter((subcategory) => subcategory.name.toLowerCase().includes(searchQuery.toLowerCase()));
    }
    setFilteredSubcategories(result);
  }, [subCategories, filter, searchQuery]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    const newSearchParams = new URLSearchParams(location.search);
    newSearchParams.set('tab', newValue.toString());
    navigate({ search: newSearchParams.toString() });
  };

  const handleEditCategory = (category) => {
    navigate(`/admin/edit-category/${category.id}`);
  }

  const handleEditSubCategory = (subcategory) => {
    navigate(`/admin/edit-subcategory/${subcategory.id}`);
  }

  const handleDeleteCategory = (id) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      dispatch(deleteCategory(id));
      showSuccessSnackbar(dispatch, "Category deleted successfully");
    }
  }

  const handleDeleteSubCategory = (id) => {
    if (window.confirm('Are you sure you want to delete this subcategory?')) {
      dispatch(deleteSubCategory(id));
    }
  }

  if (categoriesLoading || subcategoriesLoading)
    return <div className="flex justify-center items-center h-screen">
      <div className="h-20 w-20 animate-spin rounded-full border-8 border-gray-300 border-t-green-600"></div>
    </div>;
  if (categoriesError || subcategoriesError)
    return (
      <div className="px-2 text-center">
          <div className="flex flex-col justify-center items-center">
              <h1 className="text-3xl font-extrabold text-red-500">Session Expired!</h1>
              <p className="text-xl mt-5 font-medium text-gray-800">Please login again</p>
          </div>
      </div>
  );

  return (
    <div className="container mx-auto px-6 py-5">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-extrabold bg-gradient-to-r from-[#5A9A7A] to-[#2DD4BF] bg-clip-text text-transparent">
                    Category Management
                </h2>
                <Link
                    to={activeTab === 0 ? '/admin/add-category' : '/admin/add-subcategory'}
                    className="bg-gradient-to-r from-[#5A9A7A] to-[#2DD4BF] text-white px-6 py-2 rounded-lg shadow-md hover:from-[#2DD4BF] hover:to-[#5A9A7A] transform hover:scale-105 transition-all duration-200"
                >
                    {activeTab === 0 ? '+ Add Category' : '+ Add Subcategory'}
                </Link>
            </div>

            <Tabs
                value={activeTab}
                onChange={handleTabChange}
                aria-label="Category and Subcategory Tabs"
                sx={{
                    '& .MuiTabs-indicator': { backgroundColor: '#2DD4BF' },
                    '& .Mui-selected': { color: '#2DD4BF !important', fontWeight: 'bold' },
                    '& .MuiTab-root': { textTransform: 'none', fontSize: '1rem', padding: '10px 20px' },
                }}
                className="bg-gray-50 rounded-lg shadow-sm mb-2"
            >
                <Tab label="Categories" />
                <Tab label="Subcategories" />
            </Tabs>

            <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border border-gray-100">
                <div className="flex flex-col md:flex-row gap-4">
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
                            placeholder={`Search ${activeTab === 0 ? 'Categories' : 'Subcategories'}...`}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <select
                        className="w-full md:w-48 py-2.5 px-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#2DD4BF] focus:border-transparent outline-none transition-all duration-200 bg-white"
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                    >
                        <option value="all">All Items</option>
                        <option value="name">Sort by Name</option>
                    </select>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-200">
                            <tr>
                                {['SL', activeTab === 0 ? 'Category' : 'Subcategory', 'Actions'].map((header) => (
                                    <th key={header} className="p-4 text-left text-sm font-semibold text-gray-700 tracking-wide">
                                        {header}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {(activeTab === 0 ? filteredCategories : filteredSubcategories).length > 0 ? (
                                (activeTab === 0 ? filteredCategories : filteredSubcategories).map((item, index) => (
                                    <tr 
                                        key={item.id} 
                                        className="hover:bg-gray-100 transition-all duration-200 transform "
                                    >
                                        <td className="p-4 text-gray-600">{index + 1}</td>
                                        <td className="p-4 font-medium text-gray-800">{item.name}</td>
                                        <td className="p-4">
                                            <div className="flex gap-2">
                                                <Tooltip title="Edit">
                                                    <IconButton 
                                                        onClick={() => activeTab === 0 ? handleEditCategory(item) : handleEditSubCategory(item)}
                                                        className="hover:bg-teal-100"
                                                    >
                                                        <FaEdit className="text-blue-600" />
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title="Delete">
                                                    <IconButton 
                                                        onClick={() => activeTab === 0 ? handleDeleteCategory(item.id) : handleDeleteSubCategory(item.id)}
                                                        className="hover:bg-red-100"
                                                    >
                                                        <RiDeleteBin5Fill className="text-red-600" />
                                                    </IconButton>
                                                </Tooltip>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="3" className="p-8 text-center text-gray-500">
                                        <div className="flex flex-col items-center gap-2">
                                            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                                            </svg>
                                            <span>No {activeTab === 0 ? 'categories' : 'subcategories'} found</span>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
  )
}

export default Category