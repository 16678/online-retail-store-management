import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./CategoryPage.css";

function CategoryPage() {
    const { category } = useParams(); // Get the category from the URL
    const [products, setProducts] = useState([]);

    useEffect(() => {
        async function fetchProducts() {
            try {
                const response = await axios.get(`http://localhost:8086/api/products/${category}`);
                setProducts(response.data);
            } catch (error) {
                console.error("Error fetching products:", error);
            }
        }

        fetchProducts();
    }, [category]);

    return (
        <div>
            <h1>{category} Products</h1>
            <div className="product-grid">
                {products.map((product) => (
                    <div className="product-card" key={product.id}>
                        <img src={product.thumbnail_path} alt={product.title} />
                        <h3>{product.title}</h3>
                        <p>{product.description}</p>
                        <p><strong>Price:</strong> ${product.price}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default CategoryPage;
