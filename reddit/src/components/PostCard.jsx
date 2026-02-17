const PostCard = ({ post, onClick }) => {
  return (
    <div className="post-card">
      <div className="vote-section">
        <span>▲</span>
        <span>{post.score}</span>
        <span>▼</span>
      </div>

      <div className="post-content">
        <p>Posted by u/{post.author}</p>

        {/* Title ONLY */}
        <h3 onClick={onClick} style={{ cursor: "pointer" }}>
          {post.title}
        </h3>

        {/* 🔥 ANALYSIS BLOCK (OUTSIDE h3) */}
        {post.analysis && (
          <div className="analysis-box">
            <p><strong>Sentiment:</strong> {post.analysis.sentiment_label}</p>
            <p><strong>Score:</strong> {post.analysis.compound_score}</p>
            <p><strong>Emotion:</strong> {post.analysis.emotion_tag}</p>
            <p><strong>Confidence:</strong> {(post.analysis.accuracy_score * 100).toFixed(1)}%</p>
            <p><strong>Explanation:</strong> {post.analysis.explanation}</p>
          </div>
        )}

        {/* IMAGE POSTS */}
        {post.image_url && (
          <img
            src={post.image_url}
            alt="post"
            style={{
              width: "100%",
              maxHeight: "500px",
              objectFit: "cover",
              borderRadius: "10px",
              marginTop: "10px"
            }}
          />
        )}

        {/* VIDEO POSTS */}
        {post.video_url && (
          <video
            controls
            style={{
              width: "100%",
              maxHeight: "500px",
              marginTop: "10px",
              borderRadius: "10px"
            }}
          >
            <source src={post.video_url} type="video/mp4" />
          </video>
        )}

        <p>{post.num_comments} comments</p>
      </div>
    </div>
  );
};

export default PostCard;