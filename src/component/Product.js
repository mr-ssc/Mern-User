import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { auth } from "../config/firebase";
import "./Product.css";

const Product = () => {
    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState(JSON.parse(localStorage.getItem("cart")) || []);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        fetchProducts();
        checkAuthStatus();
    }, []);

    useEffect(() => {
        localStorage.setItem("cart", JSON.stringify(cart));
    }, [cart]);

    const fetchProducts = async () => {
        try {
            const response = await axios.get("https://mern-backend-sable.vercel.app/api/product");
            setProducts(response.data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching products:", error);
            setLoading(false);
        }
    };

    const checkAuthStatus = () => {
        auth.onAuthStateChanged((user) => {
            setIsAuthenticated(!!user);
        });
    };

    const addToCart = (product) => {
        setCart([...cart, product]);
    };

    const handleBuyNow = (product) => {
        if (isAuthenticated) {
            const updatedCart = [...cart, product];
            setCart(updatedCart); // Add to cart before navigating
            navigate("/Cart", { state: { product } });
        } else {
            alert("Please sign in to proceed with the purchase.");
            navigate("/signin");
        }
    };

    return (
        <div className="product-container">
            <h2 className="product-header">Our Products</h2>

            {loading ? (
                <div className="loading-spinner-product">
                    <div className="spinner-product"></div>
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
                                    <button className="cart-btn" onClick={() => addToCart(product)}>
                                        Add to Cart
                                    </button>
                                    <button className="buy-btn" onClick={() => handleBuyNow(product)}>
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
