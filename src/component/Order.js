import React, { useEffect, useState } from "react";
import { auth } from "../config/firebase";
import { onAuthStateChanged } from "firebase/auth";
import Navbar from "./Navbar";
import "./Order.css"; // Import the CSS file

const Order = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
                try {
                    const res = await fetch(`http://localhost:8888/api/orders/user-orders/${currentUser.uid}`);
                    const data = await res.json();
                    setOrders(data);
                } catch (error) {
                    console.error("Error fetching orders:", error);
                } finally {
                    setLoading(false);
                }
            } else {
                setLoading(false);
            }
        });
    }, []);

    const getStatusClass = (status) => {
        status = status.toLowerCase();
        return status === 'completed' ? 'status-completed' :
               status === 'processing' ? 'status-processing' :
               status === 'cancelled' ? 'status-cancelled' : 'status-pending';
    };

    if (loading) {
        return (
            <>
                <Navbar />
                <div className="order-container">
                    <h2>Your Orders</h2>
                    <div className="empty-state">
                        <p>Loading your orders...</p>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <Navbar />
            <div className="order-container">
                <h2>Your Orders</h2>
                {orders.length === 0 ? (
                    <div className="empty-state pulse-animation">
                        <p>No orders found. Start shopping to see your orders here!</p>
                    </div>
                ) : (
                    <div className="order-grid">
                        {orders.map((order, index) => (
                            <div key={index} className="order-card fade-in">
                                <img
                                    src={order.image}
                                    alt={order.productName}
                                />
                                <p><strong>Product:</strong> {order.productName}</p>
                                <p><strong>Quantity:</strong> {order.quantity}</p>
                                <p><strong>Price:</strong> ${order.price.toFixed(2)}</p>
                                <p>
                                    <strong>Status:</strong> 
                                    <span className={`status-badge ${getStatusClass(order.status)}`}>
                                        {order.status}
                                    </span>
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
};

export default Order;