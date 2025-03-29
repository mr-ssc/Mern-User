import React, { useState, useEffect } from "react";
import { auth, db } from "../config/firebase";
import { Link, useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import axios from "axios";
import "./Signup.css";
import Navbar from "./Navbar";

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    gender: "male",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    // Calculate password strength
    const strength = calculatePasswordStrength(formData.password);
    setPasswordStrength(strength);
  }, [formData.password]);

  const calculatePasswordStrength = (password) => {
    if (!password) return 0;
    
    let strength = 0;
    if (password.length >= 6) strength += 1;
    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    
    return Math.min(strength, 5);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    setIsLoading(true);

    try {
      // Register user in Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      const user = userCredential.user;

      // Store user data in Firebase Firestore
      await setDoc(doc(db, "users", user.uid), {
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        address: formData.address,
        gender: formData.gender,
        uid: user.uid,
        createdAt: new Date().toISOString(),
      });

      // Send user data to MongoDB via backend API
      await axios.post("https://mern-backend-sable.vercel.app/api/users/signup", {
        uid: user.uid,
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        address: formData.address,
        gender: formData.gender,
        password: formData.password,
        createdAt: new Date().toISOString(),
      });

      setSuccess(true);
      setTimeout(() => {
        navigate("/signin");
      }, 2000);
    } catch (error) {
      let errorMessage = "An error occurred during signup.";
      if (error.code === "auth/email-already-in-use") {
        errorMessage = "Email is already in use. Please use a different email.";
      } else if (error.code === "auth/weak-password") {
        errorMessage = "Password should be at least 6 characters.";
      } else if (error.code === "auth/invalid-email") {
        errorMessage = "Please enter a valid email address.";
      }
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const getPasswordStrengthColor = () => {
    const colors = ["#ff0000", "#ff4000", "#ff8000", "#ffbf00", "#80ff00", "#00ff00"];
    return colors[passwordStrength];
  };

  return (
    <>
      <Navbar />
      <div className="signup-container">
        <div className="signup-card">
          <h2 className="signup-title">Create Your Account</h2>
          {error && <div className="error-message">{error}</div>}
          {success && (
            <div className="success-message">
              Signup Successful! Redirecting to login...
            </div>
          )}
          <form className="signup-form" onSubmit={handleSubmit}>
            <input 
              type="text" 
              name="name" 
              placeholder="Full Name" 
              value={formData.name} 
              onChange={handleChange} 
              required 
            />
            <input 
              type="tel" 
              name="phone" 
              placeholder="Phone Number" 
              value={formData.phone} 
              onChange={handleChange} 
              required 
            />
            <input 
              type="email" 
              name="email" 
              placeholder="Email Address" 
              value={formData.email} 
              onChange={handleChange} 
              required 
            />
            <input 
              type="text" 
              name="address" 
              placeholder="Full Address" 
              value={formData.address} 
              onChange={handleChange} 
              required 
            />
            <select 
              name="gender" 
              value={formData.gender} 
              onChange={handleChange} 
              required
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
              <option value="prefer-not-to-say">Prefer not to say</option>
            </select>
            <input 
              type="password" 
              name="password" 
              placeholder="Password (min 6 characters)" 
              value={formData.password} 
              onChange={handleChange} 
              required 
            />
            {formData.password && (
              <div className="password-strength">
                <div 
                  className="strength-meter" 
                  style={{
                    width: `${(passwordStrength / 5) * 100}%`,
                    backgroundColor: getPasswordStrengthColor(),
                  }}
                ></div>
                <div className="strength-label">
                  Password strength: {["Very Weak", "Weak", "Fair", "Good", "Strong", "Very Strong"][passwordStrength]}
                </div>
              </div>
            )}
            <input 
              type="password" 
              name="confirmPassword" 
              placeholder="Confirm Password" 
              value={formData.confirmPassword} 
              onChange={handleChange} 
              required 
            />
            <button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <span className="spinner"></span> Creating Account...
                </>
              ) : (
                "Create Account"
              )}
            </button>
            <div className="login-link">
              Already have an account? <Link to="/signin">Sign In</Link>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Signup;