import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import RegistrationPage from "../pages/Register";
import Login from "../pages/Login";
import Profile from "../pages/Profile";
import ProtectedRoute from "../components/ProtectedRoute";
import UserRecipe from "../pages/UserRecipe";
import RecipeList from "../pages/Recipe";
import RecipeDetail from "../pages/RecipeDetails";
import SavedRecipes from "../pages/SavedRecipe";
import CommunityPage from "../pages/Forum";
import PostDetailPage from "../pages/PostDetailPage";
import MyCommunityPosts from "../pages/MyCommunityPosts";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/signup" element={<RegistrationPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/recipes" element={<RecipeList />} />
      <Route path="/recipe/:id" element={<RecipeDetail />} />
      <Route path="/forum-posts/:id" element={<PostDetailPage />} />
      <Route path="/community" element={<CommunityPage />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/profile" element={<Profile />} />
        <Route path="/my-recipes" element={<UserRecipe />} />
        <Route path="/saved-recipes" element={<SavedRecipes />} />
        <Route path="/my-community-posts" element={<MyCommunityPosts />} />
      </Route>
    </Routes>
  );
}

export default AppRoutes;
