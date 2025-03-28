import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Card,
  Button,
  Container,
  Row,
  Col,
  Form,
  Spinner,
  Alert,
  Modal,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import NavigationBar from "../components/Nav";
import Footer from "../components/Footer";

const MyCommunityPosts = () => {
  const [myPosts, setMyPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showCreatePostModal, setShowCreatePostModal] = useState(false);
  const [showEditPostModal, setShowEditPostModal] = useState(false);
  const [newPost, setNewPost] = useState({
    title: "",
    content: "",
    image: null,
  });
  const [editPost, setEditPost] = useState({
    id: "",
    title: "",
    content: "",
    image: null,
  });
  const navigate = useNavigate();

  // Fetch user-specific posts
  useEffect(() => {
    fetchMyPosts();
  }, []);

  const fetchMyPosts = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Please log in to view your posts.");
        navigate("/login");
        return;
      }

      const response = await axios.get(
        "http://localhost:5000/api/forum/my-community-posts",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setMyPosts(response.data);
    } catch (error) {
      setError("Failed to fetch your posts.");
      toast.error("Failed to fetch your posts.");
    } finally {
      setLoading(false);
    }
  };

  // Handle create post
  const handleCreatePost = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Please log in to create a post.");
        navigate("/login");
        return;
      }

      const formData = new FormData();
      formData.append("title", newPost.title);
      formData.append("content", newPost.content);
      if (newPost.image) {
        formData.append("image", newPost.image);
      }

      const response = await axios.post(
        "http://localhost:5000/api/forum",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setMyPosts([response.data, ...myPosts]);
      setShowCreatePostModal(false);
      setNewPost({ title: "", content: "", image: null }); // Reset form
      toast.success("Post created successfully!");
    } catch (error) {
      toast.error("Failed to create post.");
    }
  };

  // Handle edit post
  const handleEditPost = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Please log in to edit a post.");
        navigate("/login");
        return;
      }

      const formData = new FormData();
      formData.append("title", editPost.title);
      formData.append("content", editPost.content);
      if (editPost.image) {
        formData.append("image", editPost.image);
      }

      const response = await axios.put(
        `http://localhost:5000/api/forum/${editPost.id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setMyPosts(
        myPosts.map((post) => (post._id === editPost.id ? response.data : post))
      );
      setShowEditPostModal(false);
      setEditPost({ id: "", title: "", content: "", image: null }); // Reset form
      toast.success("Post updated successfully!");
    } catch (error) {
      toast.error("Failed to update post.");
    }
  };

  // Handle delete post
  const handleDeletePost = async (postId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Please log in to delete a post.");
        navigate("/login");
        return;
      }

      await axios.delete(`http://localhost:5000/api/forum/${postId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMyPosts(myPosts.filter((post) => post._id !== postId));
      toast.success("Post deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete post.");
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

  return (
    <>
      <NavigationBar />
      <Container className="my-5 py-5 vh-100">
        <h1 className="text-center mb-4">My Community Posts</h1>

        {/* Create Post Button */}
        <Button
          variant="primary"
          onClick={() => setShowCreatePostModal(true)}
          className="mb-4"
        >
          Create New Post
        </Button>

        {/* My Posts */}
        <Row>
          {myPosts.length === 0 ? (
            <Col className="text-center">
              <Alert variant="info">No posts available. Create one!</Alert>
            </Col>
          ) : (
            myPosts.map((post) => (
              <Col key={post._id} md={6} className="mb-4">
                <Card>
                  {post.image && (
                    <Card.Img
                      variant="top"
                      src={`http://localhost:5000/uploads/${post.image}`}
                      style={{ height: "200px", objectFit: "cover" }}
                    />
                  )}
                  <Card.Body>
                    <Card.Title>{post.title}</Card.Title>
                    <Card.Text>{post.content}</Card.Text>
                    <Button
                      variant="primary"
                      onClick={() => {
                        setEditPost({
                          id: post._id,
                          title: post.title,
                          content: post.content,
                          image: post.image,
                        });
                        setShowEditPostModal(true);
                      }}
                      className="me-2"
                    >
                      Edit Post
                    </Button>
                    <Button
                      variant="danger"
                      onClick={() => handleDeletePost(post._id)}
                    >
                      Delete Post
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            ))
          )}
        </Row>

        {/* Create Post Modal */}
        <Modal
          show={showCreatePostModal}
          onHide={() => setShowCreatePostModal(false)}
        >
          <Modal.Header closeButton>
            <Modal.Title>Create New Post</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Title</Form.Label>
                <Form.Control
                  type="text"
                  value={newPost.title}
                  onChange={(e) =>
                    setNewPost({ ...newPost, title: e.target.value })
                  }
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Content</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={newPost.content}
                  onChange={(e) =>
                    setNewPost({ ...newPost, content: e.target.value })
                  }
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Image (optional)</Form.Label>
                <Form.Control
                  type="file"
                  onChange={(e) =>
                    setNewPost({ ...newPost, image: e.target.files[0] })
                  }
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => setShowCreatePostModal(false)}
            >
              Cancel
            </Button>
            <Button variant="primary" onClick={handleCreatePost}>
              Create Post
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Edit Post Modal */}
        <Modal
          show={showEditPostModal}
          onHide={() => setShowEditPostModal(false)}
        >
          <Modal.Header closeButton>
            <Modal.Title>Edit Post</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Title</Form.Label>
                <Form.Control
                  type="text"
                  value={editPost.title}
                  onChange={(e) =>
                    setEditPost({ ...editPost, title: e.target.value })
                  }
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Content</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={editPost.content}
                  onChange={(e) =>
                    setEditPost({ ...editPost, content: e.target.value })
                  }
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Image (optional)</Form.Label>
                <Form.Control
                  type="file"
                  onChange={(e) =>
                    setEditPost({ ...editPost, image: e.target.files[0] })
                  }
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => setShowEditPostModal(false)}
            >
              Cancel
            </Button>
            <Button variant="primary" onClick={handleEditPost}>
              Save Changes
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

export default MyCommunityPosts;
