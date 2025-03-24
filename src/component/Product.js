import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Product.css";

const Product = () => {
    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await axios.get("http://localhost:8888/api/product");
            setProducts(response.data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching products:", error);
            setLoading(false);
        }
    };

    const addToCart = (product) => {
        setCart([...cart, product]);
        // Optional: Add animation/feedback here
    };

    const buyNow = (product) => {
        alert(`Proceeding to buy: ${product.name}`);
    };

    return (
        <div className="product-container">
            <h2 className="product-header">Our Products</h2>
            
            {loading ? (
                <div className="loading-spinner">
                    <div className="spinner"></div>
                    <p>Loading products...</p>
                </div>
            ) : (
                <div className="product-grid">
                    {products.map((product) => (
                        <div key={product.id} className="product-card">
                            <div className="product-image-container">
                                <img 
                                    src={product.image} 
                                    alt={product.name} 
                                    className="product-img"
                                    onError={(e) => {
                                        e.target.src = "https://via.placeholder.com/300x250?text=Product+Image";
                                        e.target.className = "product-img error";
                                    }}
                                />
                                {product.discount_price < product.original_price && (
                                    <span className="discount-badge">
                                        {Math.round(100 - (product.discount_price / product.original_price * 100))}% OFF
                                    </span>
                                )}
                            </div>
                            <div className="product-info">
                                <h3 className="product-name">{product.name}</h3>
                                <div className="price-container">
                                    {product.discount_price < product.original_price && (
                                        <p className="original-price">${product.original_price.toFixed(2)}</p>
                                    )}
                                    <p className="discounted-price">${product.discount_price.toFixed(2)}</p>
                                </div>
                                <div className="button-group">
                                    <button 
                                        className="cart-btn" 
                                        onClick={() => addToCart(product)}
                                        aria-label={`Add ${product.name} to cart`}
                                    >
                                        Add to Cart
                                    </button>
                                    <button 
                                        className="buy-btn" 
                                        onClick={() => buyNow(product)}
                                        aria-label={`Buy ${product.name} now`}
                                    >
                                        Buy Now
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Product;