import React, { useState, useEffect } from "react";
import "./CategoryAdmin.css";

function CategoryAdmin() {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [editingCategory, setEditingCategory] = useState(null);
  const [updatedCategory, setUpdatedCategory] = useState("");

  useEffect(() => {
    fetch("http://localhost:8080/api/categories") // adjust backend URL later
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch((err) => console.error("Error fetching categories:", err));
  }, []);

  const handleAddCategory = () => {
    if (newCategory.trim() === "") return;

    // Placeholder for POST request later
    const newCat = { name: newCategory };
    setCategories([...categories, newCategory]);
    setNewCategory("");
  };

  const handleEditClick = (category) => {
    setEditingCategory(category);
    setUpdatedCategory(category);
  };

  const handleUpdateCategory = () => {
    if (updatedCategory.trim() === "") return;

    // Placeholder for PUT request later
    setCategories(categories.map(cat => cat === editingCategory ? updatedCategory : cat));
    setEditingCategory(null);
    setUpdatedCategory("");
  };

  const handleDeleteCategory = (categoryToDelete) => {
    // Placeholder for DELETE request later
    setCategories(categories.filter(cat => cat !== categoryToDelete));
  };

  return (
    <div className="category-admin">
      <h2>Manage Categories</h2>

      <div className="add-category">
        <input
          type="text"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          placeholder="Enter new category"
        />
        <button onClick={handleAddCategory}>Add Category</button>
      </div>

      <ul className="category-list">
        {categories.map((category, index) => (
          <li key={index}>
            {editingCategory === category ? (
              <>
                <input
                  type="text"
                  value={updatedCategory}
                  onChange={(e) => setUpdatedCategory(e.target.value)}
                />
                <button onClick={handleUpdateCategory}>Update</button>
                <button onClick={() => setEditingCategory(null)}>Cancel</button>
              </>
            ) : (
              <>
                <span>{category}</span>
                <button onClick={() => handleEditClick(category)}>Edit</button>
                <button onClick={() => handleDeleteCategory(category)}>Delete</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CategoryAdmin;
