import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Cart.css";
import Navbar from "./Navbar"

const Cart = () => {
    const [cart, setCart] = useState(JSON.parse(localStorage.getItem("cart")) || []);
    const navigate = useNavigate();

    useEffect(() => {
        localStorage.setItem("cart", JSON.stringify(cart));
    }, [cart]);

    const increaseQuantity = (index) => {
        const newCart = [...cart];
        newCart[index].quantity = (newCart[index].quantity || 1) + 1;
        setCart(newCart);
    };

    const decreaseQuantity = (index) => {
        const newCart = [...cart];
        if (newCart[index].quantity > 1) {
            newCart[index].quantity -= 1;
        } else {
            newCart.splice(index, 1);
        }
        setCart(newCart);
    };

    const removeItem = (index) => {
        const newCart = cart.filter((_, i) => i !== index);
        setCart(newCart);
    };

    const getTotalPrice = () => {
        return cart.reduce((total, item) => total + item.discount_price * (item.quantity || 1), 0).toFixed(2);
    };

    return (
        <>
            <Navbar />
            <div className="cart-container">
                <h2 className="cart-header">Shopping Cart</h2>
                {cart.length === 0 ? (
                    <p className="empty-cart">Your cart is empty.</p>
                ) : (
                    <div className="cart-items">
                        {cart.map((item, index) => (
                            <div
                                key={index}
                                className="cart-item"
                                style={{ animationDelay: `${index * 0.1}s` }}
                            >
                                <img src={item.image} alt={item.name} className="cart-img" />
                                <div className="cart-details">
                                    <h3>{item.name}</h3>
                                    <p>Price: ${item.discount_price.toFixed(2)}</p>
                                    <div className="quantity-control">
                                        <button onClick={() => decreaseQuantity(index)}>-</button>
                                        <span>{item.quantity || 1}</span>
                                        <button onClick={() => increaseQuantity(index)}>+</button>
                                    </div>
                                    <button className="remove-btn" onClick={() => removeItem(index)}>Remove</button>
                                </div>
                            </div>
                        ))}
                        <h3 className="total-price">Total: ${getTotalPrice()}</h3>
                        <div className="cart-actions">
                            <button className="continue-shopping" onClick={() => navigate("/")}>Continue Shopping</button>
                            <button
                                className="checkout-btn"
                                onClick={() => {
                                    localStorage.setItem("order", JSON.stringify(cart)); // Store cart in localStorage
                                    navigate("/Order", { state: { cart } }); // Pass cart using React Router
                                }}
                            >
                                Place Order
                            </button>

                        </div>
                    </div>
                )}
            </div>
        </>

    );
};

export default Cart;