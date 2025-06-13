import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './CategoryUploader.css';

const CategoryUploader = () => {
  const [categoryName, setCategoryName] = useState('');
  const [description, setDescription] = useState('');
  const [categoryImage, setCategoryImage] = useState(null);
  const [categories, setCategories] = useState([]);
  const [statusMessage, setStatusMessage] = useState('');
  const [editingCategoryId, setEditingCategoryId] = useState(null);
  const [editName, setEditName] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editImage, setEditImage] = useState(null);
  const editFileInputRef = useRef(null);
  const fileInputRef = useRef(null);

  const BASE_URL = 'http://localhost:8086';

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/categories/all`);
      setCategories(response.data);
      setStatusMessage('');
    } catch (error) {
      console.error('Error fetching categories:', error);
      setStatusMessage('Failed to load categories.');
    }
  };

  const handleUpload = async () => {
    if (!categoryName.trim() || !description.trim() || !categoryImage) {
      setStatusMessage('All fields are required.');
      return;
    }

    const formData = new FormData();
    formData.append('categoryName', categoryName);
    formData.append('description', description);
    formData.append('file', categoryImage);

    try {
      await axios.post(`${BASE_URL}/categories`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setStatusMessage('Category uploaded successfully!');
      setCategoryName('');
      setDescription('');
      setCategoryImage(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      fetchCategories();
    } catch (error) {
      console.error('Error uploading category:', error);
      setStatusMessage('Upload failed. Please try again.');
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${BASE_URL}/categories/${id}`);
      setStatusMessage('Category deleted.');
      if (editingCategoryId === id) {
        setEditingCategoryId(null);
        setEditName('');
        setEditDescription('');
        setEditImage(null);
      }
      fetchCategories();
    } catch (error) {
      console.error('Error deleting category:', error);
      setStatusMessage('Deletion failed. Please try again.');
    }
  };

  // Start editing: populate fields with current category data
  const startEditing = (cat) => {
    setEditingCategoryId(cat.id);
    setEditName(cat.categoryName);
    setEditDescription(cat.description);
    setEditImage(null); // no new image yet
    if (editFileInputRef.current) editFileInputRef.current.value = '';
    setStatusMessage('');
  };

  // Cancel editing
  const cancelEditing = () => {
    setEditingCategoryId(null);
    setEditName('');
    setEditDescription('');
    setEditImage(null);
    setStatusMessage('');
  };

  // Update category
  const handleUpdate = async () => {
    if (!editName.trim() || !editDescription.trim()) {
      setStatusMessage('Name and description cannot be empty.');
      return;
    }

    const formData = new FormData();
    formData.append('categoryName', editName);
    formData.append('description', editDescription);
    if (editImage) {
      formData.append('file', editImage);
    }

    try {
      await axios.put(`${BASE_URL}/categories/${editingCategoryId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setStatusMessage('Category updated successfully!');
      cancelEditing();
      fetchCategories();
    } catch (error) {
      console.error('Error updating category:', error);
      setStatusMessage('Update failed. Please try again.');
    }
  };

  return (
    <div className="category-container">
      <h2>Add New Category</h2>
      <div className="category-form">
        <input
          type="text"
          placeholder="Category Name"
          value={categoryName}
          onChange={(e) => setCategoryName(e.target.value)}
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={(e) => setCategoryImage(e.target.files[0])}
        />
        <button onClick={handleUpload}>Upload Category</button>
        {statusMessage && <p className="status">{statusMessage}</p>}
      </div>

      <h2>All Categories</h2>
      <table className="category-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Image</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.length > 0 ? (
            categories.map((cat) => (
              <tr key={cat.id}>
                <td>
                  {editingCategoryId === cat.id ? (
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                    />
                  ) : (
                    cat.categoryName
                  )}
                </td>
                <td>
                  {editingCategoryId === cat.id ? (
                    <textarea
                      value={editDescription}
                      onChange={(e) => setEditDescription(e.target.value)}
                    />
                  ) : (
                    cat.description
                  )}
                </td>
                <td>
                  {editingCategoryId === cat.id ? (
                    <>
                      <input
                        type="file"
                        accept="image/*"
                        ref={editFileInputRef}
                        onChange={(e) => setEditImage(e.target.files[0])}
                      />
                      {/* Show current image preview */}
                      <img
                        src={`${BASE_URL}/images/${cat.imagePath}`}
                        alt={cat.categoryName}
                        className="category-img"
                        style={{ marginTop: '8px', maxWidth: '100px' }}
                      />
                    </>
                  ) : (
                    <img
                      src={`${BASE_URL}/images/${cat.imagePath}`}
                      alt={cat.categoryName}
                      className="category-img"
                    />
                  )}
                </td>
                <td>
                  {editingCategoryId === cat.id ? (
                    <>
                      <button onClick={handleUpdate}>Update</button>
                      <button onClick={cancelEditing} style={{ marginLeft: '8px' }}>
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => startEditing(cat)}>Edit</button>
                      <button
                        onClick={() => handleDelete(cat.id)}
                        style={{ marginLeft: '8px' }}
                      >
                        Delete
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4">No categories found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default CategoryUploader;
