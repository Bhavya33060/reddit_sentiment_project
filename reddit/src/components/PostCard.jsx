import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const PostCard = ({ post, onClick, isNew }) => {
  const navigate = useNavigate();
  const [isSaved, setIsSaved] = useState(false);

  // 🔍 Check if already saved
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("savedPosts")) || [];
    const exists = stored.some((p) => p.id === post.id);
    setIsSaved(exists);
  }, [post.id]);

  // 💾 SAVE / UNSAVE POST
  const handleSave = (e) => {
    e.stopPropagation();

    const stored = JSON.parse(localStorage.getItem("savedPosts")) || [];

    if (isSaved) {
      // Remove post
      const updated = stored.filter((p) => p.id !== post.id);
      localStorage.setItem("savedPosts", JSON.stringify(updated));
      setIsSaved(false);
    } else {
      // Save full post object
      const updated = [...stored, post];
      localStorage.setItem("savedPosts", JSON.stringify(updated));
      setIsSaved(true);
      navigate("/saved");
    }
  };

  // 🔗 SHARE POST
  const handleShare = (e) => {
    e.stopPropagation();

    const shareUrl = window.location.origin + `/post/${post.id}`;

    if (navigator.share) {
      navigator.share({
        title: post.title,
        text: post.title,
        url: shareUrl,
      });
    } else {
      navigator.clipboard.writeText(shareUrl);
      alert("Link copied to clipboard!");
    }
  };

  return (
    <div className={`post-card ${!isNew ? "seen" : ""}`}>
      <div className="vote-section">
        <span>▲</span>
        <span>{post.score}</span>
        <span>▼</span>
      </div>

      <div className="post-content">
        <p>Posted by u/{post.author}</p>

        {/* Title */}
        <h3 onClick={onClick} style={{ cursor: "pointer" }}>
  {post.title}
  {isNew && <span className="new-badge"> NEW</span>}
</h3>

        {/* Analysis */}
        {post.analysis && (
          <div className="analysis-box">
            <p><strong>Sentiment:</strong> {post.analysis.sentiment_label}</p>
            <p><strong>Score:</strong> {post.analysis.compound_score}</p>
            <p><strong>Emotion:</strong> {post.analysis.emotion_tag}</p>
            <p>
              <strong>Confidence:</strong>{" "}
              {(post.analysis.accuracy_score * 100).toFixed(1)}%
            </p>
            <p><strong>Explanation:</strong> {post.analysis.explanation}</p>
          </div>
        )}

        {/* Image */}
        {post.image_url && (
          <img
            src={post.image_url}
            alt="post"
            style={{
              width: "100%",
              maxHeight: "500px",
              objectFit: "cover",
              borderRadius: "10px",
              marginTop: "10px",
            }}
          />
        )}

        {/* Video */}
        {post.video_url && (
          <video
            controls
            style={{
              width: "100%",
              maxHeight: "500px",
              marginTop: "10px",
              borderRadius: "10px",
            }}
          >
            <source src={post.video_url} type="video/mp4" />
          </video>
        )}

        <p>{post.num_comments} comments</p>

        {/* Buttons */}
        <div className="post-actions">
          <button onClick={handleSave}>
            {isSaved ? "✅ Saved" : "💾 Save"}
          </button>

          <button onClick={handleShare}>🔗 Share</button>
        </div>
      </div>
    </div>
  );
};

export default PostCard;
