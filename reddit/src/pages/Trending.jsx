import { useEffect, useState } from "react";

function Trending() {
  const [posts, setPosts] = useState([]);
  const [lastUpdated, setLastUpdated] = useState("");

  useEffect(() => {
    const fetchTrending = () => {
      fetch("http://127.0.0.1:5000/api/posts")
        .then((res) => res.json())
        .then((data) => {
          const sorted = data.posts.sort(
            (a, b) => (b.analysis.heat_score || 0) - (a.analysis.heat_score || 0)
          );
          setPosts(sorted);
          setLastUpdated(new Date().toLocaleTimeString());
        });
    };

    fetchTrending();
    const interval = setInterval(fetchTrending, 20000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>🔥 Trending Sentiment (Live)</h2>
      <p>Last Updated: {lastUpdated}</p>

      {posts.map((post) => (
        <div
          key={post.id}
          style={{
            background: "#f1f1f1",
            padding: "20px",
            borderRadius: "12px",
            marginBottom: "20px"
          }}
        >
          <h3>{post.title}</h3>

          <span
            style={{
              padding: "6px 12px",
              borderRadius: "20px",
              background:
                post.analysis.sentiment_label === "Positive"
                  ? "#c8f7c5"
                  : post.analysis.sentiment_label === "Negative"
                  ? "#f8c8c8"
                  : "#ddd",
              color:
                post.analysis.sentiment_label === "Positive"
                  ? "green"
                  : post.analysis.sentiment_label === "Negative"
                  ? "red"
                  : "#333",
              fontWeight: "bold"
            }}
          >
            {post.analysis.sentiment_label}
          </span>

          <p>🔥 Heat Score: {post.analysis.heat_score || 0}</p>
          <p>💬 Comments: {post.num_comments}</p>

          {post.image_url && (
            <img
              src={post.image_url}
              alt="post"
              style={{
                width: "100%",
                maxHeight: "500px",
                objectFit: "cover",
                marginTop: "10px",
                borderRadius: "10px"
              }}
            />
          )}

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
        </div>
      ))}
    </div>
  );
}

export default Trending;