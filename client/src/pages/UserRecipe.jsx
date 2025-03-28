import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Card,
  Button,
  Container,
  Row,
  Col,
  Form,
  Modal,
} from "react-bootstrap";
import NavigationBar from "../components/Nav";
import Footer from "../components/Footer";

const UserRecipe = () => {
  const [recipes, setRecipes] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentRecipe, setCurrentRecipe] = useState({
    _id: "",
    title: "",
    description: "",
    ingredients: [],
    steps: [],
    category: "",
    tags: [],
    image: "",
  });

  const BASE_URL = "http://localhost:5000/api/recipe";

  // Fetch recipes on component mount
  useEffect(() => {
    fetchRecipes();
  }, []);

  // Fetch all recipes
  const fetchRecipes = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/my-recipes`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setRecipes(response.data);
    } catch (error) {
      console.error("Error fetching recipes:", error);
    }
  };

  // Handle input change for form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentRecipe({ ...currentRecipe, [name]: value });
  };

  // Handle array input change (ingredients, steps, tags)
  const handleArrayChange = (e, field) => {
    const { value } = e.target;
    setCurrentRecipe({ ...currentRecipe, [field]: value.split(",") });
  };

  // Handle form submission (add or update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editMode) {
        // Update existing recipe
        await axios.put(`${BASE_URL}/${currentRecipe._id}`, currentRecipe, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
      } else {
        // Add new recipe
        await axios.post(BASE_URL, currentRecipe, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
      }
      setShowModal(false);
      fetchRecipes(); // Refresh the list
    } catch (error) {
      console.error("Error saving recipe:", error);
    }
  };

  // Handle delete recipe
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${BASE_URL}/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      fetchRecipes(); // Refresh the list
    } catch (error) {
      console.error("Error deleting recipe:", error);
    }
  };

  // Open modal for adding a new recipe
  const handleAddRecipe = () => {
    setCurrentRecipe({
      _id: "",
      title: "",
      description: "",
      ingredients: [],
      steps: [],
      category: "",
      tags: [],
      image: "",
    });
    setEditMode(false);
    setShowModal(true);
  };

  // Open modal for editing an existing recipe
  const handleEditRecipe = (recipe) => {
    setCurrentRecipe(recipe);
    setEditMode(true);
    setShowModal(true);
  };

  return (
    <>
      <NavigationBar />
      <Container className="mt-4">
        <h1 className="text-center mb-4">My Recipes</h1>
        <Button variant="primary" onClick={handleAddRecipe} className="mb-4">
          Add Recipe
        </Button>

        {/* Recipe List */}
        <Row>
          {recipes.map((recipe) => (
            <Col key={recipe._id} md={4} className="mb-4">
              <Card>
                <Card.Img variant="top" src={recipe.image} />
                <Card.Body>
                  <Card.Title>{recipe.title}</Card.Title>
                  <Card.Text>{recipe.description}</Card.Text>
                  <Card.Text>
                    <strong>Ingredients:</strong>{" "}
                    {recipe.ingredients.join(", ")}
                  </Card.Text>
                  <Card.Text>
                    <strong>Steps:</strong> {recipe.steps.join(", ")}
                  </Card.Text>
                  <Card.Text>
                    <strong>Tags:</strong> {recipe.tags.join(", ")}
                  </Card.Text>
                  <Button
                    variant="primary"
                    onClick={() => handleEditRecipe(recipe)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => handleDelete(recipe._id)}
                    className="ms-2"
                  >
                    Delete
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>

        {/* Add/Edit Recipe Modal */}
        <Modal show={showModal} onHide={() => setShowModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>{editMode ? "Edit Recipe" : "Add Recipe"}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Title</Form.Label>
                <Form.Control
                  type="text"
                  name="title"
                  value={currentRecipe.title}
                  onChange={handleInputChange}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  name="description"
                  value={currentRecipe.description}
                  onChange={handleInputChange}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Ingredients (comma-separated)</Form.Label>
                <Form.Control
                  as="textarea"
                  name="ingredients"
                  value={currentRecipe.ingredients.join(",")}
                  onChange={(e) => handleArrayChange(e, "ingredients")}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Steps (comma-separated)</Form.Label>
                <Form.Control
                  as="textarea"
                  name="steps"
                  value={currentRecipe.steps.join(",")}
                  onChange={(e) => handleArrayChange(e, "steps")}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Category</Form.Label>
                <Form.Control
                  type="text"
                  name="category"
                  value={currentRecipe.category}
                  onChange={handleInputChange}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Tags (comma-separated)</Form.Label>
                <Form.Control
                  type="text"
                  name="tags"
                  value={currentRecipe.tags.join(",")}
                  onChange={(e) => handleArrayChange(e, "tags")}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Image URL</Form.Label>
                <Form.Control
                  type="text"
                  name="image"
                  value={currentRecipe.image}
                  onChange={handleInputChange}
                />
              </Form.Group>
              <Button variant="primary" type="submit">
                {editMode ? "Update Recipe" : "Add Recipe"}
              </Button>
            </Form>
          </Modal.Body>
        </Modal>
      </Container>
      <Footer />
    </>
  );
};

export default UserRecipe;
