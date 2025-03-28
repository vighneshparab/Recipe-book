import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import {
  Card,
  Container,
  Spinner,
  Alert,
  Form,
  Button,
  ListGroup,
  Row,
  Col,
} from "react-bootstrap";
import NavigationBar from "../components/Nav";
import Footer from "../components/Footer";

const PostDetailPage = () => {
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [randomPosts, setRandomPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [commentText, setCommentText] = useState("");
  const [showMorePosts, setShowMorePosts] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();

  // Fetch the specific post by ID, its comments, and random posts
  useEffect(() => {
    fetchPost();
    fetchComments();
    fetchRandomPosts();
  }, [id]);

  const fetchPost = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/forum/${id}`);
      setPost(response.data);
    } catch (error) {
      setError("Failed to fetch the post.");
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/comment/${id}/comments/forum`
      );
      setComments(response.data);
    } catch (error) {
      setError("Failed to fetch comments.");
    }
  };

  const fetchRandomPosts = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/forum");
      const allPosts = response.data;
      const shuffledPosts = allPosts.sort(() => 0.5 - Math.random()); // Shuffle posts
      const selectedPosts = shuffledPosts.slice(0, 3); // Pick 3 random posts
      setRandomPosts(selectedPosts);
    } catch (error) {
      setError("Failed to fetch random posts.");
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `http://localhost:5000/api/comment/${id}/comments/forum`,
        { text: commentText },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setComments([response.data, ...comments]); // Add new comment to the top
      setCommentText(""); // Clear the input field
    } catch (error) {
      setError("Failed to add comment.");
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await axios.delete(`http://localhost:5000/api/comment/${commentId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setComments(comments.filter((comment) => comment._id !== commentId)); // Remove deleted comment
    } catch (error) {
      setError("Failed to delete comment.");
    }
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

  if (!post) {
    return <Alert variant="warning">Post not found.</Alert>;
  }

  return (
    <>
      <NavigationBar />
      <Container className="my-5 pt-5">
        <Row>
          {/* Post Details and Comments */}
          <Col md={8}>
            <Card className="mb-4 shadow-sm">
              {post.image && (
                <Card.Img
                  variant="top"
                  src={`http://localhost:5000/uploads/${post.image}`}
                  style={{ height: "300px", objectFit: "cover" }}
                />
              )}
              <Card.Body>
                <Card.Title className="mb-3">{post.title}</Card.Title>
                <Card.Text>{post.content}</Card.Text>
              </Card.Body>
            </Card>

            {/* Add Comment Form */}
            <Card className="mb-4 shadow-sm">
              <Card.Body>
                <Form onSubmit={handleAddComment}>
                  <Form.Group controlId="commentText">
                    <Form.Control
                      as="textarea"
                      rows={3}
                      placeholder="Add a comment..."
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      required
                    />
                  </Form.Group>
                  <Button variant="primary" type="submit" className="mt-2">
                    Add Comment
                  </Button>
                </Form>
              </Card.Body>
            </Card>

            {/* Comments Section */}
            <Card className="mb-4 shadow-sm">
              <Card.Body>
                <h5 className="mb-3">Comments</h5>
                <ListGroup>
                  {comments.map((comment) => (
                    <ListGroup.Item key={comment._id} className="mb-2">
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <strong>{comment.user.name}</strong>
                          <p className="mb-0">{comment.text}</p>
                        </div>
                        {comment.user._id ===
                          localStorage.getItem("userId") && (
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => handleDeleteComment(comment._id)}
                          >
                            Delete
                          </Button>
                        )}
                      </div>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              </Card.Body>
            </Card>
          </Col>

          {/* Random Posts */}
          <Col md={4}>
            <Card className="shadow-sm">
              <Card.Body>
                <h5 className="mb-3">You Might Also Like</h5>
                {randomPosts.map((randomPost) => (
                  <Card
                    key={randomPost._id}
                    className="mb-3 cursor-pointer"
                    onClick={() => navigate(`/forum/${randomPost._id}`)}
                  >
                    {randomPost.image && (
                      <Card.Img
                        variant="top"
                        src={`http://localhost:5000/uploads/${randomPost.image}`}
                        style={{ height: "150px", objectFit: "cover" }}
                      />
                    )}
                    <Card.Body>
                      <Card.Title>{randomPost.title}</Card.Title>
                      <Card.Text>
                        {randomPost.content.slice(0, 100)}...
                      </Card.Text>
                    </Card.Body>
                  </Card>
                ))}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
      <Footer />
    </>
  );
};

export default PostDetailPage;
