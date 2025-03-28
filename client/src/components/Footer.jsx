import React from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import {
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaEnvelope,
  FaPhone,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer
      style={{
        backgroundColor: "#F9F5F0", // Soft Beige
        color: "#333333", // Charcoal
        padding: "40px 0",
        marginTop: "0px",
        borderTop: "1px solid #e0e0e0",
      }}
    >
      <Container>
        <Row className="text-center text-md-start">
          {/* Quick Links */}
          <Col md={3} className="mb-4 text-center text-md-start">
            <h5 style={{ color: "#FF6F61" }}>Quick Links</h5>
            <ul className="list-unstyled">
              <li>
                <a
                  href="/"
                  style={{ color: "#333333", textDecoration: "none" }}
                >
                  Home
                </a>
              </li>
              <li>
                <a
                  href="/recipes"
                  style={{ color: "#333333", textDecoration: "none" }}
                >
                  Recipes
                </a>
              </li>
              <li>
                <a
                  href="/community"
                  style={{ color: "#333333", textDecoration: "none" }}
                >
                  Community
                </a>
              </li>
              <li>
                <a
                  href="/profile"
                  style={{ color: "#333333", textDecoration: "none" }}
                >
                  Profile
                </a>
              </li>
            </ul>
          </Col>

          {/* Social Media */}
          <Col md={3} className="mb-4 text-center">
            <h5 style={{ color: "#FF6F61" }}>Follow Us</h5>
            <div className="d-flex justify-content-center justify-content-md-start">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "#333333", marginRight: "10px" }}
              >
                <FaFacebook size={24} />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "#333333", marginRight: "10px" }}
              >
                <FaTwitter size={24} />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "#333333" }}
              >
                <FaInstagram size={24} />
              </a>
            </div>
          </Col>

          {/* Contact Information */}
          <Col md={3} className="mb-4 text-center text-md-start">
            <h5 style={{ color: "#FF6F61" }}>Contact Us</h5>
            <ul className="list-unstyled">
              <li>
                <FaEnvelope className="me-2" />
                <a
                  href="mailto:support@recipebook.com"
                  style={{ color: "#333333", textDecoration: "none" }}
                >
                  support@recipebook.com
                </a>
              </li>
              <li>
                <FaPhone className="me-2" />
                <span>+1 (123) 456-7890</span>
              </li>
            </ul>
          </Col>

          {/* Newsletter Subscription */}
          <Col md={3} className="mb-4 text-center">
            <h5 style={{ color: "#FF6F61" }}>Subscribe</h5>
            <Form className="d-flex flex-column align-items-center align-items-md-start">
              <Form.Group controlId="formEmail" className="w-100">
                <Form.Control
                  type="email"
                  placeholder="Enter your email"
                  style={{ borderColor: "#4CAF50" }} // Leaf Green border
                />
              </Form.Group>
              <Button
                variant="primary"
                type="submit"
                className="mt-2"
                style={{ backgroundColor: "#FF6F61", borderColor: "#FF6F61" }} // Coral button
              >
                Subscribe
              </Button>
            </Form>
          </Col>
        </Row>

        {/* Copyright Notice */}
        <Row>
          <Col className="text-center mt-4">
            <p style={{ color: "#333333", margin: 0 }}>
              &copy; {new Date().getFullYear()} Recipe Book. All rights
              reserved.
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
