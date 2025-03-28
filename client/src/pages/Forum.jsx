import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Card,
  Container,
  Row,
  Col,
  Form,
  Spinner,
  Alert,
  Button,
  Pagination,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaSearch, FaUser, FaComment, FaHeart } from "react-icons/fa";
import NavigationBar from "../components/Nav";
import Footer from "../components/Footer";

const CommunityPage = () => {
  const [forumPosts, setForumPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(6); // Number of posts per page
  const navigate = useNavigate();

  // Fetch all forum posts
  useEffect(() => {
    fetchForumPosts();
  }, []);

  const fetchForumPosts = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/forum");
      setForumPosts(response.data);
    } catch (error) {
      setError("Failed to fetch forum posts.");
      toast.error("Failed to fetch forum posts.");
    } finally {
      setLoading(false);
    }
  };

  // Filter posts based on search term
  const filteredPosts = forumPosts.filter((post) =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Navigate to a specific post's detailed page
  const handleViewPost = (postId) => {
    navigate(`/forum-posts/${postId}`);
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
      <Container className="my-5 py-4">
        <h1 className="text-center mb-4">Community Forum</h1>

        {/* Search Bar */}
        <Form.Group className="mb-4">
          <div className="input-group">
            <span className="input-group-text">
              <FaSearch />
            </span>
            <Form.Control
              type="text"
              placeholder="Search posts by title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </Form.Group>

        {/* Forum Posts */}
        <Row>
          {currentPosts.map((post) => (
            <Col key={post._id} md={6} className="mb-4">
              <Card className="shadow-sm h-100">
                {post.image && (
                  <Card.Img
                    variant="top"
                    src={`http://localhost:5000/uploads/${post.image}`}
                    style={{ height: "200px", objectFit: "cover" }}
                  />
                )}
                <Card.Body className="d-flex flex-column">
                  <Card.Title>{post.title}</Card.Title>
                  <Card.Text>{post.content.slice(0, 100)}...</Card.Text>
                  <div className="mt-auto">
                    <div className="d-flex align-items-center mb-3">
                      <FaUser className="me-2" />
                      <span className="text-muted">
                        {post.author?.name || "Unknown"}
                      </span>
                    </div>
                    <div className="d-flex justify-content-between">
                      <div className="d-flex align-items-center">
                        <FaComment className="me-2" />
                        <span className="text-muted">
                          {post.comments?.length || 0} Comments
                        </span>
                      </div>
                      <div className="d-flex align-items-center">
                        <FaHeart className="me-2" />
                        <span className="text-muted">
                          {post.likes?.length || 0} Likes
                        </span>
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="primary"
                    className="mt-3"
                    onClick={() => handleViewPost(post._id)}
                  >
                    View Post
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>

        {/* Pagination */}
        <div className="d-flex justify-content-center mt-4">
          <Pagination>
            {Array.from({
              length: Math.ceil(filteredPosts.length / postsPerPage),
            }).map((_, index) => (
              <Pagination.Item
                key={index + 1}
                active={index + 1 === currentPage}
                onClick={() => paginate(index + 1)}
              >
                {index + 1}
              </Pagination.Item>
            ))}
          </Pagination>
        </div>

        {/* Toast Notifications */}
        <ToastContainer />
      </Container>
      <Footer />
    </>
  );
};

export default CommunityPage;
