import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './AddAdmin.css';

const AddAdmin = () => {
  const [adminList, setAdminList] = useState([]);
  const [admin, setAdmin] = useState({
    adminFullName: '',
    adminEmail: '',
    adminPassword: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editingAdminId, setEditingAdminId] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      const response = await axios.get('http://localhost:8086/api/admin/all');
      setAdminList(response.data);
    } catch (error) {
      console.error('Error fetching admins:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAdmin((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (isEditing) {
        await axios.put(`http://localhost:8086/api/admin/update/${editingAdminId}`, admin);
        setMessage('Admin updated successfully!');
      } else {
        await axios.post('http://localhost:8086/api/admin/add', admin);
        setMessage('Admin added successfully!');
      }

      resetForm();
      fetchAdmins();
    } catch (error) {
      console.error('Error submitting form:', error);
      setMessage('Something went wrong.');
    }
  };

  const handleEdit = (admin) => {
    setAdmin({
      adminFullName: admin.adminFullName,
      adminEmail: admin.adminEmail,
      adminPassword: admin.adminPassword,
    });
    setEditingAdminId(admin.id);
    setIsEditing(true);
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this admin?');
    if (!confirmDelete) return;

    try {
      await axios.delete(`http://localhost:8086/api/admin/delete/${id}`);
      setAdminList((prev) => prev.filter((a) => a.id !== id));
      setMessage('Admin deleted successfully!');
    } catch (error) {
      console.error('Error deleting admin:', error);
      setMessage('Failed to delete admin.');
    }
  };

  const resetForm = () => {
    setAdmin({ adminFullName: '', adminEmail: '', adminPassword: '' });
    setEditingAdminId(null);
    setIsEditing(false);
    setMessage('');
  };

  return (
    <div className="admin-wrapper">
      <div className="admin-container">
        <div className="admin-form-container">
          <h2 className="admin-title">{isEditing ? 'Edit Admin' : 'Add New Admin'}</h2>

          <form onSubmit={handleSubmit} className="admin-form">
            <div className="input-group">
              <label>Full Name</label>
              <input
                type="text"
                name="adminFullName"
                value={admin.adminFullName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="input-group">
              <label>Email</label>
              <input
                type="email"
                name="adminEmail"
                value={admin.adminEmail}
                onChange={handleChange}
                required
              />
            </div>

            <div className="input-group">
              <label>Password</label>
              <input
                type="password"
                name="adminPassword"
                value={admin.adminPassword}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-buttons">
              <button type="submit">{isEditing ? 'Update Admin' : 'Add Admin'}</button>
              {isEditing && (
                <button type="button" onClick={resetForm} className="cancel-button">
                  Cancel
                </button>
              )}
            </div>
          </form>

          {message && <p className="message">{message}</p>}
        </div>

        <div className="admin-list-container">
          <h3 className="admin-list-title">Admin List</h3>
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Full Name</th>
                <th>Email</th>
                <th>Password</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {adminList.map((adminItem) => (
                <tr key={adminItem.id}>
                  <td>{adminItem.id}</td>
                  <td>{adminItem.adminFullName}</td>
                  <td>{adminItem.adminEmail}</td>
                  <td>{adminItem.adminPassword}</td>
                  <td>
                    <button className="edit-button" onClick={() => handleEdit(adminItem)}>
                      Edit
                    </button>
                    <button className="delete-button" onClick={() => handleDelete(adminItem.id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {adminList.length === 0 && (
                <tr>
                  <td colSpan="5">No admins found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AddAdmin;
