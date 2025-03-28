import React, { useState } from "react";
import { Form, Button, Container, Alert, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaEnvelope, FaLock } from "react-icons/fa";
import "../assets/style/LoginPage.css"; // Custom CSS for additional styling

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Validate email format
  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Reset errors
    setError("");

    // Validate form fields
    if (!formData.email || !formData.password) {
      setError("Please fill in all fields.");
      return;
    }

    if (!validateEmail(formData.email)) {
      setError("Please enter a valid email address.");
      return;
    }

    try {
      // Send login request to the backend
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        formData
      );

      // Handle success
      if (response.data) {
        // Save token to localStorage
        localStorage.setItem("token", response.data.token);

        // Redirect to home page or dashboard
        navigate("/");
      }
    } catch (err) {
      // Handle errors
      setError(
        err.response?.data?.message || "Invalid credentials. Please try again."
      );
    }
  };

  return (
    <div className="login-page">
      <Container
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "100vh" }}
      >
        <Card className="login-card p-4">
          <h2 className="text-center mb-4" style={{ color: "#FF6F61" }}>
            <FaEnvelope className="me-2" />
            Login
          </h2>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
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
            </Form.Group>

            {/* Submit Button */}
            <Button
              variant="primary"
              type="submit"
              className="w-100 mt-3"
              style={{ backgroundColor: "#FF6F61", borderColor: "#FF6F61" }}
            >
              Login
            </Button>
          </Form>

          {/* Link to Registration Page */}
          <p className="text-center mt-3">
            Don't have an account?{" "}
            <a href="/signup" style={{ color: "#FF6F61" }}>
              Register here
            </a>
            .
          </p>
        </Card>
      </Container>
    </div>
  );
};

export default LoginPage;
