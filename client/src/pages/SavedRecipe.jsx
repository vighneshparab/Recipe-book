import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Card,
  Button,
  Container,
  Row,
  Col,
  Spinner,
  Alert,
  Modal,
} from "react-bootstrap";
import { useNavigate, Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import NavigationBar from "../components/Nav";
import Footer from "../components/Footer";

const SavedRecipes = () => {
  const [savedRecipes, setSavedRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [unsaving, setUnsaving] = useState(false); // Loading state for unsave action
  const [showConfirmation, setShowConfirmation] = useState(false); // Confirmation dialog
  const [recipeToUnsave, setRecipeToUnsave] = useState(null); // Recipe to unsave
  const navigate = useNavigate();

  useEffect(() => {
    fetchSavedRecipes();
  }, []);

  const fetchSavedRecipes = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Please log in to view saved recipes.");
        navigate("/login");
        return;
      }

      console.log("Fetching saved recipes...");
      const response = await axios.get(
        "http://localhost:5000/api/recipe/saved-recipes",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log("Saved recipes response:", response.data);
      setSavedRecipes(response.data);
    } catch (error) {
      console.error("Error fetching saved recipes:", error);
      if (error.response) {
        setError(
          error.response.data.message || "Failed to fetch saved recipes."
        );
      } else {
        setError(
          "Failed to fetch saved recipes. Please check your connection."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleUnsaveRecipe = async () => {
    if (!recipeToUnsave) return;

    try {
      setUnsaving(true); // Start loading
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Please log in to unsave recipes.");
        navigate("/login");
        return;
      }

      console.log("Unsaving recipe:", recipeToUnsave);
      await axios.delete(
        `http://localhost:5000/api/recipe/${recipeToUnsave}/unsave`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("Recipe removed from saved recipes!");
      fetchSavedRecipes(); // Refresh the list after unsaving
    } catch (error) {
      console.error("Error unsaving recipe:", error);
      toast.error("Failed to unsave recipe.");
    } finally {
      setUnsaving(false); // Stop loading
      setShowConfirmation(false); // Close confirmation dialog
    }
  };

  const openConfirmationDialog = (recipeId) => {
    setRecipeToUnsave(recipeId);
    setShowConfirmation(true);
  };

  const closeConfirmationDialog = () => {
    setRecipeToUnsave(null);
    setShowConfirmation(false);
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
      <Container className="mt-5 pt-5">
        <h1 className="text-center mb-4">Saved Recipes</h1>

        {/* Go Back Button */}
        <Button
          variant="secondary"
          onClick={() => navigate(-1)}
          className="mb-4"
        >
          Go Back
        </Button>

        {savedRecipes.length > 0 ? (
          <Row>
            {savedRecipes.map((recipe) => (
              <Col key={recipe._id} md={4} className="mb-4">
                <Card>
                  <Card.Img
                    variant="top"
                    src={recipe.image || "https://via.placeholder.com/300"}
                    style={{ height: "200px", objectFit: "cover" }}
                  />
                  <Card.Body>
                    <Card.Title>{recipe.title}</Card.Title>
                    <Card.Text>{recipe.description}</Card.Text>
                    <Button
                      variant="primary"
                      as={Link}
                      to={`/recipe/${recipe._id}`}
                      className="me-2"
                    >
                      View Recipe
                    </Button>
                    <Button
                      variant="danger"
                      onClick={() => openConfirmationDialog(recipe._id)}
                      disabled={unsaving}
                    >
                      {unsaving ? "Unsaving..." : "Unsave Recipe"}
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        ) : (
          <p className="text-center">No saved recipes found.</p>
        )}

        {/* Confirmation Dialog */}
        <Modal show={showConfirmation} onHide={closeConfirmationDialog}>
          <Modal.Header closeButton>
            <Modal.Title>Confirm Unsave</Modal.Title>
          </Modal.Header>
          <Modal.Body>Are you sure you want to unsave this recipe?</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={closeConfirmationDialog}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleUnsaveRecipe}>
              Unsave
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

export default SavedRecipes;
