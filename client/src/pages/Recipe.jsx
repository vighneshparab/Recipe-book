import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Card,
  Button,
  Container,
  Row,
  Col,
  Form,
  Pagination,
  Spinner,
  Alert,
  Modal,
  Badge,
} from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { FaStar, FaShareAlt, FaRandom, FaEye } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../assets/style/RecipeList.css"; // Custom CSS for animations and styling
import NavigationBar from "../components/Nav";
import Footer from "../components/Footer";

const RecipeList = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [tagFilter, setTagFilter] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const [recipesPerPage] = useState(6); // Number of recipes per page
  const [showQuickView, setShowQuickView] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchRecipes();
  }, []);

  const fetchRecipes = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/recipe");
      setRecipes(response.data);
    } catch (error) {
      setError("Failed to fetch recipes. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Filter recipes based on search query, category, and tags
  const filteredRecipes = recipes.filter((recipe) => {
    const matchesSearch =
      recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      recipe.ingredients
        .join(" ")
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      recipe.tags.join(" ").toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = categoryFilter
      ? recipe.category === categoryFilter
      : true;

    const matchesTag = tagFilter ? recipe.tags.includes(tagFilter) : true;

    return matchesSearch && matchesCategory && matchesTag;
  });

  // Sort recipes
  const sortedRecipes = filteredRecipes.sort((a, b) => {
    if (sortBy === "rating") {
      return b.averageRating - a.averageRating;
    } else if (sortBy === "newest") {
      return new Date(b.createdAt) - new Date(a.createdAt);
    } else if (sortBy === "oldest") {
      return new Date(a.createdAt) - new Date(b.createdAt);
    }
    return 0;
  });

  // Pagination logic
  const indexOfLastRecipe = currentPage * recipesPerPage;
  const indexOfFirstRecipe = indexOfLastRecipe - recipesPerPage;
  const currentRecipes = sortedRecipes.slice(
    indexOfFirstRecipe,
    indexOfLastRecipe
  );

  const totalPages = Math.ceil(sortedRecipes.length / recipesPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Handle "Quick View" modal
  const handleQuickView = (recipe) => {
    setSelectedRecipe(recipe);
    setShowQuickView(true);
  };

  // Handle "Save Recipe" button
  const saveRecipe = async (recipeId) => {
    try {
      await axios.post(
        `http://localhost:5000/api/recipe/${recipeId}/save`,
        {},
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      toast.success("Recipe saved successfully!", { position: "bottom-right" });
    } catch (error) {
      console.error("Error saving recipe:", error.response?.data?.message);
      toast.error("Failed to save recipe. Please log in and try again.", {
        position: "bottom-right",
      });
    }
  };

  // Handle "Share Recipe" button
  const shareRecipe = (recipeId) => {
    const link = `${window.location.origin}/recipe/${recipeId}`;
    navigator.clipboard.writeText(link).then(() => {
      toast.info("Link copied to clipboard!", { position: "bottom-right" });
    });
  };

  // Handle "Random Recipe" button
  const getRandomRecipe = () => {
    const randomIndex = Math.floor(Math.random() * sortedRecipes.length);
    navigate(`/recipes/${sortedRecipes[randomIndex]._id}`);
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchQuery("");
    setCategoryFilter("");
    setTagFilter("");
    setCurrentPage(1);
  };

  // Navigate to single recipe page
  const goToRecipePage = (recipeId) => {
    navigate(`/recipe/${recipeId}`);
  };

  if (loading) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="danger" className="mt-4">
        {error}
      </Alert>
    );
  }

  return (
    <>
      <NavigationBar />
      <Container className="mt-4 pt-5">
        <h1 className="text-center mb-4">All Recipes</h1>

        {/* Search Bar and Filters */}
        <Row className="mb-4">
          <Col md={4}>
            <Form.Control
              type="text"
              placeholder="Search recipes by title, ingredients, or tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </Col>
          <Col md={2}>
            <Form.Select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="">All Categories</option>
              <option value="Breakfast">Breakfast</option>
              <option value="Lunch">Lunch</option>
              <option value="Dinner">Dinner</option>
              <option value="Dessert">Dessert</option>
            </Form.Select>
          </Col>
          <Col md={2}>
            <Form.Select
              value={tagFilter}
              onChange={(e) => setTagFilter(e.target.value)}
            >
              <option value="">All Tags</option>
              {[...new Set(recipes.flatMap((recipe) => recipe.tags))].map(
                (tag) => (
                  <option key={tag} value={tag}>
                    {tag}
                  </option>
                )
              )}
            </Form.Select>
          </Col>
          <Col md={2}>
            <Form.Select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
              <option value="rating">Top Rated</option>
            </Form.Select>
          </Col>
          <Col md={2}>
            <Button variant="secondary" onClick={clearFilters}>
              Clear Filters
            </Button>
          </Col>
        </Row>

        {/* Recipe Cards */}
        <Row>
          {currentRecipes.length > 0 ? (
            currentRecipes.map((recipe) => (
              <Col key={recipe._id} md={4} className="mb-4">
                <Card className="h-100 recipe-card">
                  <Card.Img
                    variant="top"
                    src={recipe.image || "https://via.placeholder.com/300"}
                    style={{ height: "200px", objectFit: "cover" }}
                  />
                  <Card.Body>
                    <Card.Title>{recipe.title}</Card.Title>
                    <Card.Text>{recipe.description}</Card.Text>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <Badge bg="primary">{recipe.category}</Badge>
                      <div>
                        <FaStar className="text-warning" />{" "}
                        {recipe.averageRating || "N/A"}
                      </div>
                    </div>
                    <div className="d-flex justify-content-between">
                      <Button
                        variant="primary"
                        onClick={() => handleQuickView(recipe)}
                        className="me-2"
                      >
                        Quick View
                      </Button>
                      <Button
                        variant="success"
                        onClick={() => saveRecipe(recipe._id)}
                        className="me-2"
                      >
                        Save
                      </Button>
                      <Button
                        variant="info"
                        onClick={() => shareRecipe(recipe._id)}
                      >
                        <FaShareAlt />
                      </Button>
                      <Button
                        variant="secondary"
                        onClick={() => goToRecipePage(recipe._id)}
                      >
                        <FaEye />
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))
          ) : (
            <Col className="text-center">
              <p>No recipes found.</p>
            </Col>
          )}
        </Row>

        {/* Pagination */}
        <div className="d-flex justify-content-center mt-4">
          <Pagination>
            <Pagination.Prev
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
            />
            {Array.from({ length: totalPages }).map((_, index) => (
              <Pagination.Item
                key={index + 1}
                active={index + 1 === currentPage}
                onClick={() => paginate(index + 1)}
              >
                {index + 1}
              </Pagination.Item>
            ))}
            <Pagination.Next
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
            />
          </Pagination>
        </div>

        {/* Quick View Modal */}
        <Modal show={showQuickView} onHide={() => setShowQuickView(false)}>
          <Modal.Header closeButton>
            <Modal.Title>{selectedRecipe?.title}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selectedRecipe && (
              <>
                <p>{selectedRecipe.description}</p>
                <h5>Ingredients</h5>
                <ul>
                  {selectedRecipe.ingredients.map((ingredient, index) => (
                    <li key={index}>{ingredient}</li>
                  ))}
                </ul>
                <h5>Steps</h5>
                <ol>
                  {selectedRecipe.steps.map((step, index) => (
                    <li key={index}>{step}</li>
                  ))}
                </ol>
              </>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowQuickView(false)}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Toast Notifications */}
        <ToastContainer />
      </Container>
      <Footer />
    </>
  );
};

export default RecipeList;
