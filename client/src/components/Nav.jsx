import React from "react";
import { Navbar, Nav, Container, Button, Dropdown } from "react-bootstrap";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FaUser,
  FaSignOutAlt,
  FaBook,
  FaHeart,
  FaComments,
} from "react-icons/fa";

const NavigationBar = () => {
  const location = useLocation(); // Get current route location
  const navigate = useNavigate(); // For programmatic navigation
  const isLoggedIn = localStorage.getItem("token"); // Check if user is logged in

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("token"); // Remove token from localStorage
    navigate("/"); // Redirect to home page
  };

  return (
    <Navbar
      bg="light"
      expand="lg"
      fixed="top"
      className="shadow-sm"
      style={{ backgroundColor: "#F9F5F0" }} // Soft Beige background
    >
      <Container>
        {/* Brand Logo with Link to Home */}
        <Navbar.Brand
          as={Link}
          to="/"
          className="fw-bold"
          style={{ color: "#FF6F61" }}
        >
          {" "}
          {/* Coral */}
          <FaBook className="me-2" />
          Recipe Book
        </Navbar.Brand>

        {/* Toggle Button for Mobile */}
        <Navbar.Toggle aria-controls="basic-navbar-nav" />

        {/* Navbar Links */}
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto align-items-center">
            {/* Home Link */}
            <Nav.Link
              as={Link}
              to="/"
              className={`mx-2 ${location.pathname === "/" ? "active" : ""}`}
              style={{ color: "#333333" }} // Charcoal text
            >
              Home
            </Nav.Link>

            {/* Recipes Link */}
            <Nav.Link
              as={Link}
              to="/recipes"
              className={`mx-2 ${
                location.pathname === "/recipes" ? "active" : ""
              }`}
              style={{ color: "#333333" }} // Charcoal text
            >
              Recipes
            </Nav.Link>

            {/* Community Link */}
            <Nav.Link
              as={Link}
              to="/community"
              className={`mx-2 ${
                location.pathname === "/community" ? "active" : ""
              }`}
              style={{ color: "#333333" }} // Charcoal text
            >
              Community
            </Nav.Link>

            {/* Conditional Rendering Based on Login Status */}
            {isLoggedIn ? (
              // If logged in, show Profile Dropdown
              <Dropdown align="end">
                <Dropdown.Toggle
                  variant="light"
                  id="dropdown-profile"
                  className="d-flex align-items-center"
                  style={{ color: "#FF6F61" }} // Coral text
                >
                  <FaUser className="me-2" />
                  Profile
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  <Dropdown.Item
                    as={Link}
                    to="/profile"
                    style={{ color: "#333333" }}
                  >
                    {" "}
                    {/* Charcoal text */}
                    <FaUser className="me-2" />
                    My Profile
                  </Dropdown.Item>
                  <Dropdown.Item
                    as={Link}
                    to="/my-recipes"
                    style={{ color: "#333333" }}
                  >
                    {" "}
                    {/* Charcoal text */}
                    <FaBook className="me-2" />
                    My Recipes
                  </Dropdown.Item>
                  <Dropdown.Item
                    as={Link}
                    to="/saved-recipes"
                    style={{ color: "#333333" }}
                  >
                    {" "}
                    {/* Charcoal text */}
                    <FaHeart className="me-2" />
                    Saved Recipes
                  </Dropdown.Item>
                  <Dropdown.Item
                    as={Link}
                    to="/my-community-posts"
                    style={{ color: "#333333" }}
                  >
                    {" "}
                    {/* Charcoal text */}
                    <FaComments className="me-2" />
                    My Community Posts
                  </Dropdown.Item>
                  <Dropdown.Divider />
                  <Dropdown.Item
                    onClick={handleLogout}
                    style={{ color: "#E64A19" }}
                  >
                    {" "}
                    {/* Burnt Orange text */}
                    <FaSignOutAlt className="me-2" />
                    Logout
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            ) : (
              // If not logged in, show Login and Sign Up Buttons
              <>
                <Nav.Link
                  as={Link}
                  to="/login"
                  className={`mx-2 ${
                    location.pathname === "/login" ? "active" : ""
                  }`}
                  style={{ color: "#333333" }} // Charcoal text
                >
                  Login
                </Nav.Link>
                <Button
                  as={Link}
                  to="/signup"
                  variant="primary"
                  className="ms-2"
                  style={{ backgroundColor: "#FF6F61", borderColor: "#FF6F61" }} // Coral button
                >
                  Sign Up
                </Button>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavigationBar;
