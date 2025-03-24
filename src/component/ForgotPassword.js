import React, { useState } from "react";
import { auth } from "../config/firebase";
import { sendPasswordResetEmail } from "firebase/auth";
import axios from "axios";
import { toast } from "react-toastify";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    try {
      // Firebase ma password reset link generate karo
      await sendPasswordResetEmail(auth, email);

      // Backend API call karo
      await axios.post("http://localhost:8888/api/user/forgot-password", { email });

      toast.success("Password reset email sent!");
    } catch (error) {
      toast.error("Error sending password reset email.");
    }
  };

  return (
    <div>
      <h2>Forgot Password</h2>
      <form onSubmit={handleForgotPassword}>
        <input type="email" placeholder="Enter your email" onChange={(e) => setEmail(e.target.value)} required />
        <button type="submit">Reset Password</button>
      </form>
    </div>
  );
};

export default ForgotPassword;
