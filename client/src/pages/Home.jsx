import React from "react";
import { Container, Button, Row, Col, Card } from "react-bootstrap";
import { FaUtensils, FaComments, FaGlobe, FaStar } from "react-icons/fa"; // Icons
import "bootstrap/dist/css/bootstrap.min.css";
import "../assets/style/Home.css";
import communityImg from "../assets/images/Hero.jpg";
import NavigationBar from "../components/Nav";
import Footer from "../components/Footer";

const Home = () => {
  return (
    <div>
      {/* Navigation Bar */}
      <NavigationBar />
      {/* Hero Section */}
      <section className="hero-section vh-100 text-white d-flex align-items-center justify-content-center">
        <Container>
          <Row className="justify-content-center">
            <Col xs={12} md={8} lg={6} className="text-center">
              <h1 className="display-4 fw-bold mb-4">
                Welcome to Digital Recipe Box
              </h1>
              <p className="lead mb-4">
                Store, share, and discover recipes from around the world. Join
                our vibrant cooking community today!
              </p>
              <Button variant="primary" size="lg" className="fw-bold">
                Get Started
              </Button>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Features Section */}
      <section className="features-section py-5 bg-light">
        <Container>
          <h2 className="text-center mb-5 fw-bold">Why Choose Us?</h2>
          <Row>
            <Col md={4} className="mb-4">
              <Card className="text-center feature-card border-0 shadow">
                <Card.Body>
                  <FaUtensils size={50} className="mb-3 text-primary" />
                  <Card.Title className="fw-bold">
                    Personalized Recipe Collections
                  </Card.Title>
                  <Card.Text>
                    Create and organize your favorite recipes in one place.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4} className="mb-4">
              <Card className="text-center feature-card border-0 shadow">
                <Card.Body>
                  <FaComments size={50} className="mb-3 text-primary" />
                  <Card.Title className="fw-bold">Join Discussions</Card.Title>
                  <Card.Text>
                    Engage with other cooking enthusiasts and share your
                    experiences.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4} className="mb-4">
              <Card className="text-center feature-card border-0 shadow">
                <Card.Body>
                  <FaGlobe size={50} className="mb-3 text-primary" />
                  <Card.Title className="fw-bold">
                    Discover New Recipes
                  </Card.Title>
                  <Card.Text>
                    Explore a wide variety of recipes from around the world.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Community Section */}
      <section className="community-section py-5">
        <Container>
          <Row className="align-items-center">
            <Col md={6}>
              <h2 className="fw-bold mb-4">Join Our Cooking Community</h2>
              <p className="lead mb-4">
                Connect with thousands of cooking enthusiasts, share your
                recipes, and learn new techniques from experts.
              </p>
              <Button variant="outline-primary" size="lg">
                Join Now
              </Button>
            </Col>
            <Col md={6} className="text-center">
              <img
                src={communityImg}
                alt="Community"
                className="img-fluid rounded shadow"
              />
            </Col>
          </Row>
        </Container>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section py-5 bg-light">
        <Container>
          <h2 className="text-center mb-5 fw-bold">What Our Users Say</h2>
          <Row>
            <Col md={4} className="mb-4">
              <Card className="text-center testimonial-card border-0 shadow">
                <Card.Body>
                  <FaStar size={30} className="mb-3 text-warning" />
                  <Card.Text className="fst-italic">
                    "Digital Recipe Box has transformed the way I cook! I love
                    the community and the variety of recipes."
                  </Card.Text>
                  <Card.Title className="fw-bold">- Jane Doe</Card.Title>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4} className="mb-4">
              <Card className="text-center testimonial-card border-0 shadow">
                <Card.Body>
                  <FaStar size={30} className="mb-3 text-warning" />
                  <Card.Text className="fst-italic">
                    "This platform is amazing! I've discovered so many new
                    recipes and made friends along the way."
                  </Card.Text>
                  <Card.Title className="fw-bold">- John Smith</Card.Title>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4} className="mb-4">
              <Card className="text-center testimonial-card border-0 shadow">
                <Card.Body>
                  <FaStar size={30} className="mb-3 text-warning" />
                  <Card.Text className="fst-italic">
                    "The personalized recipe collections are a game-changer.
                    Highly recommend!"
                  </Card.Text>
                  <Card.Title className="fw-bold">- Emily Johnson</Card.Title>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Call-to-Action Section */}
      <section className="cta-section py-5 bg-primary text-white">
        <Container>
          <Row className="align-items-center">
            <Col md={8}>
              <h2 className="fw-bold mb-4">
                Ready to Start Your Culinary Journey?
              </h2>
              <p className="lead mb-4">
                Sign up today and join thousands of cooking enthusiasts
                worldwide!
              </p>
            </Col>
            <Col md={4} className="text-end">
              <Button variant="light" size="lg" className="fw-bold">
                Sign Up Now
              </Button>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Home;
