import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { auth, db } from "../config/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import Navbar from "./Navbar";
import axios from "axios";
import "./Order.css";

const Order = () => {
    const location = useLocation();
    const [cart, setCart] = useState(location.state?.cart || JSON.parse(localStorage.getItem("order")) || []);
    const [user, setUser] = useState({});
    const [loading, setLoading] = useState(true);
    const [orderPlaced, setOrderPlaced] = useState(false);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                try {
                    const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
                    if (userDoc.exists()) {
                        setUser(userDoc.data());
                    }
                } catch (error) {
                    console.error("Error fetching user data:", error);
                }
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    useEffect(() => {
        localStorage.setItem("order", JSON.stringify(cart));
    }, [cart]);

    const placeOrder = async () => {
        try {
            if (!cart.length) {
                alert("No items in the cart!");
                return;
            }
    
            const orderData = cart.map((item, index) => ({
                username: user.name || "Guest",
                useraddress: user.address || "Address not provided",
                productName: item.name,
                productId: `PROD-${Date.now()}-${index}`,
                quantity: item.quantity || 1,
                price: item.discount_price.toFixed(2),
                status: "Pending",
            }));
    
            await axios.post("https://mern-backend-sable.vercel.app/api/orders/place", { orders: orderData });
    
            setOrderPlaced(true);
            alert("Order placed successfully!");
            localStorage.removeItem("order");
            setCart([]);
        } catch (error) {
            console.error("Error placing order:", error);
            alert("Failed to place order. Please try again.");
        }
    };

    
    if (loading) {
        return (
            <>
                <Navbar />
                <div className="container loading-container">
                    <div className="loader"></div>
                    <p>Loading your orders...</p>
                </div>
            </>
        );
    }

    return (
        <>  
            <Navbar />
            <div className="orders-container order-container">
                <h2 className="order-title">Your Orders</h2>
                {cart.length === 0 ? (
                    <div className="empty-order">
                        <img src="/images/empty-cart.png" alt="Empty order" className="empty-order-img" />
                        <p>No orders yet.</p>
                    </div>
                ) : (
                    <>
                        <div className="order-list">
                            {cart.map((item, index) => {
                                const productId = `PROD-${Date.now()}-${index}`;
                                return (
                                    <div key={index} className="order-item">
                                        <div className="order-item-image-container">
                                            <img 
                                                src={item.image} 
                                                alt={item.name} 
                                                className="order-item-image" 
                                                loading="lazy"
                                            />
                                        </div>
                                        <div className="order-item-details">
                                            <p className="order-greeting">Dear: {user.name || "Guest"}</p>
                                            <h3 className="order-product-name">{item.name}</h3>
                                            <p className="order-product-id">Product ID: {productId}</p>
                                            <div className="order-meta">
                                                <span className="order-quantity">Qty: {item.quantity || 1}</span>
                                                <span className="order-price">${item.discount_price.toFixed(2)}</span>
                                            </div>
                                            <p className="order-address">
                                                <i className="fas fa-map-marker-alt"></i> {user.address || "Address not provided"}
                                            </p>
                                            <div className="order-status pending">
                                                <i className="fas fa-clock"></i> Status: Pending
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                        <button className="place-order-btn" onClick={placeOrder}>Place Order</button>
                    </>
                )}
            </div>
        </>
    );
};

export default Order;
