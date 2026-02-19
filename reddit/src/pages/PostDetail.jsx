import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

function PostDetail() {
  const { id } = useParams(); // 🔥 MUST match route param

  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;

    const controller = new AbortController();
    setLoading(true);

    fetch(`http://127.0.0.1:5000/api/comments/${id}`, {
      signal: controller.signal,
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch comments");
        return res.json();
      })
      .then((data) => {
        setComments(data);
        setLoading(false);
      })
      .catch((err) => {
        if (err.name !== "AbortError") {
          console.error(err);
          setError("Failed to load comments");
          setLoading(false);
        }
      });

    return () => controller.abort();
  }, [id]);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Comments</h2>

      {loading && <p>Loading comments...</p>}
      {error && <p>{error}</p>}

      {!loading &&
        !error &&
        comments.map((comment) => (
          <div
            key={comment.id}
            style={{
              marginBottom: "15px",
              padding: "15px",
              border: "1px solid #ccc",
              borderRadius: "8px",
              backgroundColor: "#f9f9f9",
            }}
          >
            <strong>u/{comment.author}</strong>
            <p>{comment.body}</p>

            {comment.analysis && (
              <div style={{ marginTop: "8px" }}>
                <span
                  style={{
                    padding: "4px 10px",
                    borderRadius: "20px",
                    fontSize: "12px",
                    fontWeight: "bold",
                    backgroundColor:
                      comment.analysis.sentiment_label === "Positive"
                        ? "#d4edda"
                        : comment.analysis.sentiment_label === "Negative"
                        ? "#f8d7da"
                        : "#e2e3e5",
                    color:
                      comment.analysis.sentiment_label === "Positive"
                        ? "#155724"
                        : comment.analysis.sentiment_label === "Negative"
                        ? "#721c24"
                        : "#383d41",
                  }}
                >
                  {comment.analysis.sentiment_label}
                </span>
              </div>
            )}

            <p style={{ marginTop: "8px" }}>
              <strong>Score:</strong> {comment.score}
            </p>
          </div>
        ))}
    </div>
  );
}

export default PostDetail;