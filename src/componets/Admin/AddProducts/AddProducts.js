import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AddProducts.css';

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
    const [message, setMessage] = useState('');
    const [previewImages, setPreviewImages] = useState([]);
    const [categories, setCategories] = useState([]);

    // ✅ Updated fetchCategories URL to match your working endpoint
    const fetchCategories = async () => {
        try {
            const response = await axios.get('http://localhost:8086/categories/all');
            setCategories(response.data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProductData({ ...productData, [name]: value });
    };

    const handleFileChange = (e) => {
        const selectedFiles = Array.from(e.target.files);
        if (selectedFiles.length + files.length > 5) {
            alert("You can only upload a maximum of 5 images.");
            return;
        }

        setFiles(prev => [...prev, ...selectedFiles]);
        const previews = selectedFiles.map(file => URL.createObjectURL(file));
        setPreviewImages(prev => [...prev, ...previews]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();

        Object.entries(productData).forEach(([key, value]) => {
            formData.append(key, value);
        });

        files.forEach(file => formData.append('files', file));

        try {
            await axios.post(
                'http://localhost:8086/api/products/add',
                formData,
                { headers: { 'Content-Type': 'multipart/form-data' } }
            );

            setMessage('✅ Product uploaded successfully!');
            setProductData({
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
            setFiles([]);
            setPreviewImages([]);
            fetchCategories();
        } catch (error) {
            console.error('Error uploading product:', error);
            setMessage('❌ Failed to upload product.');
        }
    };

    return (
        <div className="product-upload-container">
            <h2>Upload New Product</h2>
            {message && <p className="upload-message">{message}</p>}

            <form onSubmit={handleSubmit} encType="multipart/form-data">
                <div className="form-group">
                    <label>Product Name:</label>
                    <input type="text" name="productName" value={productData.productName} onChange={handleInputChange} required />
                </div>

                <div className="form-group">
                    <label>Brand:</label>
                    <input type="text" name="brand" value={productData.brand} onChange={handleInputChange} required />
                </div>

                <div className="form-group">
                    <label>Price:</label>
                    <input type="number" name="price" value={productData.price} onChange={handleInputChange} required />
                </div>

                <div className="form-group">
                    <label>Discounted Price:</label>
                    <input type="number" name="discountedPrice" value={productData.discountedPrice} onChange={handleInputChange} />
                </div>

                <div className="form-group">
                    <label>Discount Percentage:</label>
                    <input type="number" name="discountPercentage" value={productData.discountPercentage} onChange={handleInputChange} />
                </div>

                <div className="form-group">
                    <label>Stock:</label>
                    <input type="number" name="stock" value={productData.stock} onChange={handleInputChange} required />
                </div>

                <div className="form-group">
                    <label>Top Category:</label>
                    <select name="topCategory" value={productData.topCategory} onChange={handleInputChange} required>
                        <option value="">-- Select a category --</option>
                        {categories.map((cat) => (
                            <option key={cat.id} value={cat.categoryName}>
                                {cat.categoryName}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label>Second Category:</label>
                    <input type="text" name="secondCategory" value={productData.secondCategory} onChange={handleInputChange} />
                </div>

                <div className="form-group">
                    <label>Third Category:</label>
                    <input type="text" name="thirdCategory" value={productData.thirdCategory} onChange={handleInputChange} />
                </div>

                <div className="form-group">
                    <label>Size:</label>
                    <input type="text" name="sizeName" value={productData.sizeName} onChange={handleInputChange} />
                </div>

                <div className="form-group">
                    <label>Product Images (Max 5):</label>
                    <input type="file" multiple accept="image/*" onChange={handleFileChange} />
                    <div className="image-previews">
                        {previewImages.map((src, index) => (
                            <img key={index} src={src} alt={`preview-${index}`} height="80" style={{ marginRight: '10px' }} />
                        ))}
                    </div>
                </div>

                <button type="submit" className="upload-button">Upload Product</button>
            </form>
        </div>
    );
};

export default ProductUploadForm;
