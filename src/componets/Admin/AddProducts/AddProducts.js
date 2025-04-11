import React, { useState } from 'react';
import axios from 'axios';
import './AddProducts.css'
const ProductUploadForm = () => {
    const [productData, setProductData] = useState({
        productName: '',
        brand: '',
        price: '',
        discountedPrice: '',
        discountPercentage: '',
        stock: '',
        topCategory: '',
        secondCategory: '',
        thirdCategory: '',
        sizeName: ''
    });
    const [files, setFiles] = useState([]);

    // Handle input change
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProductData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    // Handle file selection
    const handleFileChange = (e) => {
        setFiles(e.target.files);
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();

        // Append product data to FormData
        for (let key in productData) {
            formData.append(key, productData[key]);
        }

        // Append files to FormData
        for (let i = 0; i < files.length; i++) {
            formData.append('files', files[i]);
        }

        try {
            // Send POST request to backend to upload product and images
            const response = await axios.post(
                'http://localhost:8086/api/products/add', // Update this URL based on your backend API endpoint
                formData,
                { headers: { 'Content-Type': 'multipart/form-data' } }
            );
            console.log(response.data); // Handle the response data (e.g., success message)
        } catch (error) {
            console.error('Error uploading product:', error);
        }
    };

    return (
        <div>
            <h2>Upload Product</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Product Name:</label>
                    <input
                        type="text"
                        name="productName"
                        value={productData.productName}
                        onChange={handleInputChange}
                    />
                </div>
                <div>
                    <label>Brand:</label>
                    <input
                        type="text"
                        name="brand"
                        value={productData.brand}
                        onChange={handleInputChange}
                    />
                </div>
                <div>
                    <label>Price:</label>
                    <input
                        type="number"
                        name="price"
                        value={productData.price}
                        onChange={handleInputChange}
                    />
                </div>
                <div>
                    <label>Discounted Price:</label>
                    <input
                        type="number"
                        name="discountedPrice"
                        value={productData.discountedPrice}
                        onChange={handleInputChange}
                    />
                </div>
                <div>
                    <label>Discount Percentage:</label>
                    <input
                        type="number"
                        name="discountPercentage"
                        value={productData.discountPercentage}
                        onChange={handleInputChange}
                    />
                </div>
                <div>
                    <label>Stock:</label>
                    <input
                        type="number"
                        name="stock"
                        value={productData.stock}
                        onChange={handleInputChange}
                    />
                </div>
                <div>
                    <label>Top Category:</label>
                    <input
                        type="text"
                        name="topCategory"
                        value={productData.topCategory}
                        onChange={handleInputChange}
                    />
                </div>
                <div>
                    <label>Second Category:</label>
                    <input
                        type="text"
                        name="secondCategory"
                        value={productData.secondCategory}
                        onChange={handleInputChange}
                    />
                </div>
                <div>
                    <label>Third Category:</label>
                    <input
                        type="text"
                        name="thirdCategory"
                        value={productData.thirdCategory}
                        onChange={handleInputChange}
                    />
                </div>
                <div>
                    <label>Size:</label>
                    <input
                        type="text"
                        name="sizeName"
                        value={productData.sizeName}
                        onChange={handleInputChange}
                    />
                </div>
                <div>
                    <label>Product Images:</label>
                    <input
                        type="file"
                        multiple
                        onChange={handleFileChange}
                    />
                </div>
                <button type="submit">Upload Product</button>
            </form>
        </div>
    );
};

export default ProductUploadForm;
