import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Cart.css";
import Navbar from "./Navbar";
import { auth, db } from "../config/firebase";
import { doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

const Cart = () => {
    const [cart, setCart] = useState(JSON.parse(localStorage.getItem("cart")) || []);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // Save cart to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem("cart", JSON.stringify(cart));
    }, [cart]);

    // Check auth state and fetch user data
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            setLoading(true);
            if (currentUser) {
                try {
                    const userDoc = await getDoc(doc(db, "users", currentUser.uid));
                    if (userDoc.exists()) {
                        setUser(userDoc.data());
                    }
                } catch (error) {
                    console.error("Error fetching user data:", error);
                }
            } else {
                setUser(null);
            }
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

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
        return cart.reduce(
            (total, item) => total + item.discount_price * (item.quantity || 1), 
            0
        ).toFixed(2);
    };

    const placeOrder = async () => {
        if (cart.length === 0) return;

        // First check the immediate auth state
        const currentUser = auth.currentUser;
        if (!currentUser) {
            alert("Please sign in to place an order");
            navigate("/signin");
            return;
        }

        // If we don't have user data, try to fetch it
        if (!user) {
            try {
                const userDoc = await getDoc(doc(db, "users", currentUser.uid));
                if (userDoc.exists()) {
                    setUser(userDoc.data());
                } else {
                    throw new Error("User data not found");
                }
            } catch (error) {
                alert("Error loading user data. Please try again.");
                return;
            }
        }

        const newOrders = cart.map((item) => ({
            username: user?.name || currentUser.displayName || "Customer",
            useraddress: user?.address || "",
            productName: item.name,
            productId: item.id,
            quantity: item.quantity || 1,
            price: item.discount_price,
            image: item.image,
            status: "pending",
            userId: currentUser.uid,
        }));

        try {
            const res = await fetch("http://localhost:8888/api/orders/place-order", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newOrders),
            });

            if (res.ok) {
                localStorage.removeItem("cart");
                setCart([]);
                navigate("/Order");
            } else {
                const data = await res.json();
                alert(data.error || "Something went wrong");
            }
        } catch (error) {
            console.error("Order placement error:", error);
            alert("Failed to place order. Please try again.");
        }
    };

    if (loading) {
        return (
            <>
                <Navbar />
                <div className="cart-container">
                    <h2 className="cart-header">Shopping Cart</h2>
                    <p>Loading your cart...</p>
                </div>
            </>
        );
    }

    return (
        <>
            <Navbar />
            <div className="cart-container">
                <h2 className="cart-header">Shopping Cart</h2>
                {cart.length === 0 ? (
                    <div className="empty-cart-message">
                        <p>Your cart is empty.</p>
                        <button 
                            className="continue-shopping" 
                            onClick={() => navigate("/")}
                        >
                            Continue Shopping
                        </button>
                    </div>
                ) : (
                    <div className="cart-items">
                        {cart.map((item, index) => (
                            <div key={index} className="cart-item">
                                <img 
                                    src={item.image} 
                                    alt={item.name} 
                                    className="cart-img" 
                                />
                                <div className="cart-details">
                                    <h3>{item.name}</h3>
                                    <p>Price: ${item.discount_price.toFixed(2)}</p>
                                    <div className="quantity-control">
                                        <button onClick={() => decreaseQuantity(index)}>
                                            -
                                        </button>
                                        <span>{item.quantity || 1}</span>
                                        <button onClick={() => increaseQuantity(index)}>
                                            +
                                        </button>
                                    </div>
                                    <button 
                                        className="remove-btn" 
                                        onClick={() => removeItem(index)}
                                    >
                                        Remove
                                    </button>
                                </div>
                            </div>
                        ))}
                        <div className="cart-summary">
                            <h3 className="total-price">
                                Total: ${getTotalPrice()}
                            </h3>
                            <div className="cart-actions">
                                <button 
                                    className="continue-shopping" 
                                    onClick={() => navigate("/")}
                                >
                                    Continue Shopping
                                </button>
                                <button 
                                    className="checkout-btn" 
                                    onClick={placeOrder}
                                    disabled={loading}
                                >
                                    {loading ? "Processing..." : "Place Order"}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default Cart;