import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Card,
  Button,
  Container,
  Row,
  Col,
  Form,
  ListGroup,
  Badge,
  Spinner,
} from "react-bootstrap";
import { useParams, useNavigate, Link } from "react-router-dom";
import { FaStar, FaHeart, FaShareAlt } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import NavigationBar from "../components/Nav";
import Footer from "../components/Footer";

const RecipeDetail = () => {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [randomRecipes, setRandomRecipes] = useState([]);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [likes, setLikes] = useState(0);
  const [userRating, setUserRating] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    fetchRecipe();
    fetchRandomRecipes();
    fetchComments();
  }, [id]);

  const fetchRecipe = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/recipe/${id}`
      );
      setRecipe(response.data);
    } catch (error) {
      setError("Failed to fetch recipe details.");
    } finally {
      setLoading(false);
    }
  };

  const fetchRandomRecipes = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/recipe");
      const allRecipes = response.data;
      const shuffledRecipes = allRecipes.sort(() => 0.5 - Math.random());
      const selectedRecipes = shuffledRecipes.slice(0, 3);
      setRandomRecipes(selectedRecipes);
    } catch (error) {
      console.error("Error fetching random recipes:", error);
    }
  };

  const fetchComments = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/comment/${id}/comments/recipe`
      );
      setComments(response.data);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  const handleAddComment = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Please log in to add a comment.");
        return;
      }

      const response = await axios.post(
        `http://localhost:5000/api/comment/${id}/comments/recipe`,
        { text: newComment },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setComments([...comments, response.data]);
      setNewComment("");
      toast.success("Comment added successfully!");
    } catch (error) {
      toast.error("Failed to add comment.");
    }
  };

  const handleRateRecipe = async (rating) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Please log in to rate this recipe.");
        return;
      }

      const response = await axios.post(
        `http://localhost:5000/api/recipe/${id}/rate`,
        { rating },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setRecipe({ ...recipe, averageRating: response.data.averageRating });
      toast.success("Recipe rated successfully!");
    } catch (error) {
      toast.error("Failed to rate recipe.");
    }
  };

  const saveRecipe = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Please log in to save this recipe.");
        return;
      }

      await axios.post(
        `http://localhost:5000/api/recipe/${id}/save`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("Recipe saved successfully!");
    } catch (error) {
      toast.error("Failed to save recipe.");
    }
  };

  const shareRecipe = () => {
    const link = `${window.location.origin}/recipe/${id}`;
    navigator.clipboard.writeText(link).then(() => {
      toast.info("Link copied to clipboard!");
    });
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

  if (!recipe) {
    return <Container>Recipe not found.</Container>;
  }

  return (
    <>
      <NavigationBar />
      <Container className="mt-5 pt-5">
        <Row>
          {/* Left Side: Recipe Details */}
          <Col md={8}>
            <Card>
              <Card.Img
                variant="top"
                src={recipe.image || "https://via.placeholder.com/300"}
                style={{ height: "300px", objectFit: "cover" }}
              />
              <Card.Body>
                <Card.Title className="text-center mb-4">
                  {recipe.title}
                </Card.Title>
                <Card.Text>{recipe.description}</Card.Text>
                <Card.Text>
                  <strong>Ingredients:</strong> {recipe.ingredients.join(", ")}
                </Card.Text>
                <Card.Text>
                  <strong>Steps:</strong> {recipe.steps.join(", ")}
                </Card.Text>
                <Card.Text>
                  <strong>Tags:</strong> {recipe.tags.join(", ")}
                </Card.Text>

                {/* Rating */}
                <div className="mb-3">
                  <strong>Rating:</strong> {recipe.averageRating || "N/A"}
                  <div className="mt-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Button
                        key={star}
                        variant="outline-warning"
                        onClick={() => handleRateRecipe(star)}
                        className="me-2"
                      >
                        <FaStar />
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Save and Share Buttons */}
                <div className="d-flex justify-content-center mt-4">
                  <Button
                    variant="success"
                    onClick={saveRecipe}
                    className="me-2"
                  >
                    Save Recipe
                  </Button>
                  <Button variant="info" onClick={shareRecipe}>
                    <FaShareAlt /> Share Recipe
                  </Button>
                </div>
              </Card.Body>
            </Card>

            {/* Comments Section */}
            <Card className="mt-4">
              <Card.Body>
                <Card.Title>Comments</Card.Title>
                <Form.Group className="mb-3">
                  <Form.Control
                    as="textarea"
                    rows={3}
                    placeholder="Add a comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                  />
                </Form.Group>
                <Button variant="primary" onClick={handleAddComment}>
                  Add Comment
                </Button>

                <ListGroup className="mt-3">
                  {comments.map((comment) => (
                    <ListGroup.Item key={comment._id}>
                      <strong>{comment.user.name}:</strong> {comment.text}
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              </Card.Body>
            </Card>
          </Col>

          {/* Right Side: Random Recipes */}
          <Col md={4}>
            <h4 className="mb-4">You Might Also Like</h4>
            {randomRecipes.map((randomRecipe) => (
              <Card key={randomRecipe._id} className="mb-3">
                <Card.Img
                  variant="top"
                  src={randomRecipe.image || "https://via.placeholder.com/300"}
                  style={{ height: "150px", objectFit: "cover" }}
                />
                <Card.Body>
                  <Card.Title>{randomRecipe.title}</Card.Title>
                  <Card.Text>{randomRecipe.description}</Card.Text>
                  <Button
                    variant="primary"
                    as={Link}
                    to={`/recipes/${randomRecipe._id}`}
                    className="w-100"
                  >
                    View Recipe
                  </Button>
                </Card.Body>
              </Card>
            ))}
          </Col>
        </Row>

        {/* Toast Notifications */}
        <ToastContainer />
      </Container>
      <Footer />
    </>
  );
};

export default RecipeDetail;
