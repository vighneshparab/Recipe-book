import React, { useState, useEffect } from "react";
import { Form, Button, Container, Card, Alert, Image } from "react-bootstrap";
import axios from "axios";
import { FaUser, FaEnvelope, FaLock, FaCamera } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "../assets/style/Profile.css"; // Custom CSS for additional styling
import NavigationBar from "../components/Nav";
import Footer from "../components/Footer";

const Profile = () => {
  const [user, setUser] = useState({
    name: "",
    email: "",
    profilePic: "",
    role: "",
  });
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    profilePic: null,
  });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  // Fetch user data on component mount
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "http://localhost:5000/api/auth/profile",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setUser(response.data);
        setFormData({
          name: response.data.name,
          email: response.data.email,
          password: "",
          profilePic: null,
        });
      } catch (err) {
        setErrors({ fetchError: "Failed to fetch user data." });
      }
    };

    fetchUser();
  }, []);

  // Validate name
  const validateName = (name) => {
    const regex = /^[A-Za-z\s]{2,}$/;
    return regex.test(name);
  };

  // Validate email
  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  // Validate password
  const validatePassword = (password) => {
    const regex =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
    return regex.test(password);
  };

  // Validate profile picture
  const validateProfilePic = (file) => {
    if (!file) return true; // No file is acceptable
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!allowedTypes.includes(file.type)) {
      return "Only JPEG, JPG, and PNG files are allowed.";
    }
    if (file.size > maxSize) {
      return "File size must be less than 5MB.";
    }
    return true;
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Real-time validation
    if (name === "name") {
      setErrors({
        ...errors,
        name: validateName(value)
          ? ""
          : "Name must be at least 2 characters long and contain only letters.",
      });
    } else if (name === "email") {
      setErrors({
        ...errors,
        email: validateEmail(value)
          ? ""
          : "Please enter a valid email address.",
      });
    } else if (name === "password") {
      setErrors({
        ...errors,
        password: value
          ? validatePassword(value)
            ? ""
            : "Password must be at least 8 characters long, include a number, and a special character."
          : "",
      });
    }
  };

  // Handle file input change
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const validationResult = validateProfilePic(file);
    if (validationResult === true) {
      setFormData({ ...formData, profilePic: file });
      setErrors({ ...errors, profilePic: "" });
    } else {
      setErrors({ ...errors, profilePic: validationResult });
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Reset errors and success messages
    setErrors({});
    setSuccess("");

    // Validate all fields
    const newErrors = {};
    if (!validateName(formData.name)) {
      newErrors.name =
        "Name must be at least 2 characters long and contain only letters.";
    }
    if (!validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email address.";
    }
    if (formData.password && !validatePassword(formData.password)) {
      newErrors.password =
        "Password must be at least 8 characters long, include a number, and a special character.";
    }
    const profilePicValidation = validateProfilePic(formData.profilePic);
    if (profilePicValidation !== true) {
      newErrors.profilePic = profilePicValidation;
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("email", formData.email);
      if (formData.password)
        formDataToSend.append("password", formData.password);
      if (formData.profilePic)
        formDataToSend.append("profilePic", formData.profilePic);

      const response = await axios.put(
        "http://localhost:5000/api/auth/profile",
        formDataToSend,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Handle success
      setSuccess("Profile updated successfully!");
      setUser(response.data);
      setFormData({ ...formData, password: "" }); // Clear password field
    } catch (err) {
      setErrors({
        submitError: err.response?.data?.message || "Failed to update profile.",
      });
    }
  };

  return (
    <>
      <NavigationBar />
      <div className="profile-page mt-4">
        <Container
          className="d-flex justify-content-center align-items-center my-5"
          style={{ minHeight: "100vh" }}
        >
          <Card className="profile-card p-4">
            <h2 className="text-center mb-4" style={{ color: "#FF6F61" }}>
              <FaUser className="me-2" />
              Profile
            </h2>
            {errors.fetchError && (
              <Alert variant="danger">{errors.fetchError}</Alert>
            )}
            {errors.submitError && (
              <Alert variant="danger">{errors.submitError}</Alert>
            )}
            {success && <Alert variant="success">{success}</Alert>}

            {/* Profile Picture */}
            <div className="text-center mb-4">
              <Image
                src={
                  user.profilePic
                    ? `http://localhost:5000${user.profilePic}` // Prepend local backend URL
                    : "https://via.placeholder.com/150" // Fallback image
                }
                roundedCircle
                style={{ width: "150px", height: "150px", objectFit: "cover" }}
              />
            </div>

            {/* Edit Profile Form */}
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
                  isInvalid={!!errors.name}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.name}
                </Form.Control.Feedback>
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
                  isInvalid={!!errors.email}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.email}
                </Form.Control.Feedback>
              </Form.Group>

              {/* Password Field */}
              <Form.Group className="mb-3">
                <Form.Label>
                  <FaLock className="me-2" />
                  New Password
                </Form.Label>
                <Form.Control
                  type="password"
                  name="password"
                  placeholder="Enter new password"
                  value={formData.password}
                  onChange={handleChange}
                  isInvalid={!!errors.password}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.password}
                </Form.Control.Feedback>
              </Form.Group>

              {/* Profile Picture Upload */}
              <Form.Group className="mb-3">
                <Form.Label>
                  <FaCamera className="me-2" />
                  Profile Picture
                </Form.Label>
                <Form.Control
                  type="file"
                  name="profilePic"
                  accept="image/*"
                  onChange={handleFileChange}
                  isInvalid={!!errors.profilePic}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.profilePic}
                </Form.Control.Feedback>
              </Form.Group>

              {/* Submit Button */}
              <Button
                variant="primary"
                type="submit"
                className="w-100 mt-3"
                style={{ backgroundColor: "#FF6F61", borderColor: "#FF6F61" }}
              >
                Update Profile
              </Button>
            </Form>
          </Card>
        </Container>
      </div>
      <Footer />
    </>
  );
};

export default Profile;
