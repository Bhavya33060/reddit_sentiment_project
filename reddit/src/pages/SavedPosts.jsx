import { useEffect, useState } from "react";
import PostCard from "../components/PostCard";
import { useNavigate } from "react-router-dom";

function SavedPosts() {
  const [savedPosts, setSavedPosts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("savedPosts")) || [];
    setSavedPosts(stored);
  }, []);

  const handlePostClick = (id) => {
    navigate(`/post/${id}`);
  };

  return (
    <div className="saved-container">
      <div className="saved-header">
        <h2>📌 Saved Intelligence</h2>
        <span className="saved-count">{savedPosts.length} Items</span>
      </div>

      {savedPosts.length === 0 ? (
        <div className="empty-state">
          <h3>No Saved Posts Yet</h3>
          <p>Save posts to analyze them later and track insights.</p>
        </div>
      ) : (
        <div className="feed-container">
          {savedPosts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              onClick={() => handlePostClick(post.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default SavedPosts;
