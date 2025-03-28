import React, { useState } from "react";
import { Form, Button, Container, Alert, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaUser, FaEnvelope, FaLock, FaCheck } from "react-icons/fa";
import "../assets/style/RegistrationPage.css"; // Custom CSS for additional styling

const RegistrationPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [passwordStrength, setPasswordStrength] = useState("");
  const navigate = useNavigate();

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Real-time password strength feedback
    if (name === "password") {
      if (value.length === 0) {
        setPasswordStrength("");
      } else if (value.length < 8) {
        setPasswordStrength("Weak");
      } else if (!/(?=.*\d)(?=.*[@$!%*#?&])/.test(value)) {
        setPasswordStrength("Medium");
      } else {
        setPasswordStrength("Strong");
      }
    }
  };

  // Validate email format
  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  // Validate password strength
  const validatePassword = (password) => {
    const regex =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
    return regex.test(password);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Reset errors and success messages
    setError("");
    setSuccess("");

    // Validate form fields
    if (
      !formData.name ||
      !formData.email ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      setError("Please fill in all fields.");
      return;
    }

    if (!validateEmail(formData.email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!validatePassword(formData.password)) {
      setError(
        "Password must be at least 8 characters long, include a number, and a special character."
      );
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      // Send registration request to the backend
      const response = await axios.post(
        "http://localhost:5000/api/auth/register",
        {
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }
      );

      // Handle success
      if (response.data) {
        setSuccess("Registration successful! Redirecting to login...");
        setError("");
        setTimeout(() => {
          navigate("/login"); // Redirect to login page after 2 seconds
        }, 2000);
      }
    } catch (err) {
      // Handle errors
      setError(
        err.response?.data?.message || "Registration failed. Please try again."
      );
      setSuccess("");
    }
  };

  return (
    <div className="registration-page">
      <Container
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "100vh" }}
      >
        <Card className="registration-card p-4">
          <h2 className="text-center mb-4" style={{ color: "#FF6F61" }}>
            <FaUser className="me-2" />
            Register
          </h2>
          {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success">{success}</Alert>}
          <Form onSubmit={handleSubmit}>
            {/* Name Field */}
            <Form.Group className="mb-3">
              <Form.Label>
                <FaUser className="me-2" />
                Name
              </Form.Label>
              <Form.Control
                type="text"
                name="name"
                placeholder="Enter your name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </Form.Group>

            {/* Email Field */}
            <Form.Group className="mb-3">
              <Form.Label>
                <FaEnvelope className="me-2" />
                Email
              </Form.Label>
              <Form.Control
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </Form.Group>

            {/* Password Field */}
            <Form.Group className="mb-3">
              <Form.Label>
                <FaLock className="me-2" />
                Password
              </Form.Label>
              <Form.Control
                type="password"
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required
              />
              {passwordStrength && (
                <div
                  className={`password-strength ${passwordStrength.toLowerCase()}`}
                >
                  Password Strength: {passwordStrength}
                </div>
              )}
            </Form.Group>

            {/* Confirm Password Field */}
            <Form.Group className="mb-3">
              <Form.Label>
                <FaCheck className="me-2" />
                Confirm Password
              </Form.Label>
              <Form.Control
                type="password"
                name="confirmPassword"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </Form.Group>

            {/* Submit Button */}
            <Button
              variant="primary"
              type="submit"
              className="w-100 mt-3"
              style={{ backgroundColor: "#FF6F61", borderColor: "#FF6F61" }}
            >
              Register
            </Button>
          </Form>

          {/* Link to Login Page */}
          <p className="text-center mt-3">
            Already have an account?{" "}
            <a href="/login" style={{ color: "#FF6F61" }}>
              Login here
            </a>
            .
          </p>
        </Card>
      </Container>
    </div>
  );
};

export default RegistrationPage;
