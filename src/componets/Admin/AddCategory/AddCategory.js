import React, { useState, useEffect } from 'react';
import './AddCategory.css';
import axios from 'axios';

const AddCategory = () => {
  const [categoryName, setCategoryName] = useState('');
  const [description, setDescription] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [categories, setCategories] = useState([]);

  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/categories');
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', categoryName);
    formData.append('description', description);
    formData.append('image', imageFile);

    try {
      await axios.post('http://localhost:8080/api/categories', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      alert('Category added successfully!');
      setCategoryName('');
      setDescription('');
      setImageFile(null);
      fetchCategories();
    } catch (error) {
      console.error('Error adding category:', error);
    }
  };

  return (
    <div className="category-container">
      <h2>Add Category</h2>
      <form className="add-category-form" onSubmit={handleSubmit}>
        <label>
          Category Name:
          <input
            type="text"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            placeholder="Enter category name"
            required
          />
        </label>
        <label>
          Description:
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter category description"
            required
          />
        </label>
        <label>
          Category Image:
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files[0])}
            required
          />
        </label>
        <button type="submit">Add Category</button>
      </form>

      <table className="category-table">
        <thead>
          <tr>
            <th>Category Name</th>
            <th>Description</th>
            <th>Category Image</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((cat) => (
            <tr key={cat.id}>
              <td>{cat.name}</td>
              <td>{cat.description}</td>
              <td>
                <img
                  src={`http://localhost:8080/uploads/${cat.imagePath}`}
                  alt={cat.name}
                  className="category-image"
                />
              </td>
              <td>
                <button>Delete</button>
                <button>Edit</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AddCategory;
