import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './AdminCarousel.css';

const BASE_URL = 'http://localhost:8086';

const CarouselAdmin = () => {
    const [images, setImages] = useState([]);
    const [altText, setAltText] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const [editingId, setEditingId] = useState(null);

    useEffect(() => {
        fetchImages();
    }, []);

    const fetchImages = async () => {
        try {
            const res = await axios.get(`${BASE_URL}/api/v1/carousel/all`);
            setImages(res.data);
        } catch (error) {
            console.error('Error fetching images:', error);
        }
    };

    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!altText.trim()) {
            alert("Please provide alternative text for the image.");
            return;
        }

        const formData = new FormData();
        formData.append("carousalAltText", altText);
        if (selectedFile) {
            formData.append("file", selectedFile);
        }

        try {
            if (editingId) {
                await axios.put(`${BASE_URL}/api/v1/carousel/update/${editingId}`, formData, {
                    headers: { "Content-Type": "multipart/form-data" }
                });
            } else {
                if (!selectedFile) {
                    alert("Please select an image to upload.");
                    return;
                }

                await axios.post(`${BASE_URL}/api/v1/carousel/add`, formData, {
                    headers: { "Content-Type": "multipart/form-data" }
                });
            }

            resetForm();
            fetchImages();
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    };

    const handleEdit = (img) => {
        setEditingId(img.id);
        setAltText(img.carousalAltText);
        setSelectedFile(null); // Let user pick a new file
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`${BASE_URL}/api/v1/carousel/delete/${id}`);
            fetchImages();
        } catch (error) {
            console.error('Error deleting image:', error);
        }
    };

    const resetForm = () => {
        setAltText('');
        setSelectedFile(null);
        setEditingId(null);
    };

    return (
        <div className="carousel-admin">
            <h2>Carousel Image Manager</h2>

            <form onSubmit={handleSubmit} className="image-form">
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    required={!editingId}
                />
                <input
                    type="text"
                    placeholder="Alt Text"
                    value={altText}
                    onChange={(e) => setAltText(e.target.value)}
                    required
                />
                <button type="submit">
                    {editingId ? 'Update' : 'Add'} Image
                </button>
                {editingId && (
                    <button type="button" onClick={resetForm} className="cancel-btn">
                        Cancel
                    </button>
                )}
            </form>

            <div className="carousel-preview">
                {images.map((img) => (
                    <div key={img.id} className="carousel-card">
                        <img
                            src={`${BASE_URL}/uploads/${img.carousalImages}`}
                            alt={img.carousalAltText}
                            className="preview-img"
                            onError={(e) => e.target.src = '/placeholder.png'}
                        />
                        <p>{img.carousalAltText}</p>
                        <div className="actions">
                            <button onClick={() => handleEdit(img)}>Edit</button>
                            <button onClick={() => handleDelete(img.id)} className="delete-btn">
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CarouselAdmin;
