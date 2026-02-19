import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";

import Layout from "./components/Layout";
import Home from "./pages/Home";
import Trending from "./pages/Trending";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import SentimentOverview from "./pages/SentimentOverview";
import SavedPosts from "./pages/SavedPosts";

import PostDetails from "./pages/PostDetail";
import Settings from "./pages/Settings";
import About from "./pages/About";
function App() {

  useEffect(() => {
    document.body.setAttribute("data-density", "comfortable");
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route element={<Layout />}>
          <Route path="/home" element={<Home />} />
          <Route path="/trending" element={<Trending />} />
          <Route path="/overview" element={<SentimentOverview />} />
          <Route path="/saved" element={<SavedPosts />} />
          <Route path="/post/:id" element={<PostDetails />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/about" element={<About />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
