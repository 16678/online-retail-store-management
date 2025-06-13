import React, { useEffect, useState } from 'react';
import './Customers.css';
import axios from 'axios';

const Users = () => {
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8086/api/v1/customer/all') // Calling the new GET API
      .then((response) => {
        setCustomers(response.data);
      })
      .catch((error) => {
        console.error('Error fetching customer data:', error);
      });
  }, []);

  return (
    <div className="view-users-container">
      <p>View Customers</p>
      <table className="users-table">
        <thead>
          <tr>
            <th>Customer ID</th>
            <th>Full Name</th>
            <th>Email</th>
            <th>Phone Number</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((customer) => (
            <tr key={customer.customerId}>
              <td>{customer.customerId}</td>
              <td>{customer.customerName}</td>
              <td>{customer.email}</td>
              <td>{customer.phoneNumber}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Users;
