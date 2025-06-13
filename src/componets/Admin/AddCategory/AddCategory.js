import React, { useState } from 'react';
import axios from 'axios';

const AddCategory = () => {
  const [categoryName, setCategoryName] = useState('');
  const [description, setDescription] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [message, setMessage] = useState('');

  const handleNameChange = (e) => {
    setCategoryName(e.target.value);
  };

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!categoryName || !description || !imageFile) {
      setMessage("Please provide category name, description, and image.");
      return;
    }

    const formData = new FormData();
    formData.append('categoryName', categoryName);
    formData.append('description', description);
    formData.append('file', imageFile);

    try {
      const response = await axios.post('http://localhost:8086/categories', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setMessage(`Category "${response.data.categoryName}" added successfully.`);
      setCategoryName('');
      setDescription('');
      setImageFile(null);
    } catch (error) {
      console.error(error);
      setMessage("Error uploading category.");
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '0 auto' }}>
      <h2>Add Category</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Category Name:</label>
          <input
            type="text"
            value={categoryName}
            onChange={handleNameChange}
            required
            style={{ width: '100%', padding: '8px' }}
          />
        </div>

        <div style={{ marginTop: '10px' }}>
          <label>Description:</label>
          <textarea
            value={description}
            onChange={handleDescriptionChange}
            required
            style={{ width: '100%', padding: '8px' }}
          />
        </div>

        <div style={{ marginTop: '10px' }}>
          <label>Category Image:</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            required
          />
        </div>

        <button type="submit" style={{ marginTop: '15px' }}>Upload Category</button>
      </form>
      {message && <p style={{ marginTop: '20px', color: 'green' }}>{message}</p>}
    </div>
  );
};

export default AddCategory;
