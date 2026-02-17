import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

function SentimentOverview() {
  const [posts, setPosts] = useState([]);
  const [summary, setSummary] = useState({});
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState("");

  useEffect(() => {
    const fetchData = () => {
      fetch("http://127.0.0.1:5000/api/posts")
        .then((res) => res.json())
        .then((data) => {
          setPosts(data.posts);
          setSummary(data.summary);
          setLastUpdated(new Date().toLocaleTimeString());
          setLoading(false);
        });
    };

    fetchData();
    const interval = setInterval(fetchData, 20000);
    return () => clearInterval(interval);
  }, []);

  const totalPosts = posts.length;

  const positivePercent = totalPosts
    ? ((summary.Positive || 0) / totalPosts) * 100
    : 0;

  const negativePercent = totalPosts
    ? ((summary.Negative || 0) / totalPosts) * 100
    : 0;

  const neutralPercent = totalPosts
    ? ((summary.Neutral || 0) / totalPosts) * 100
    : 0;

  return (
    <div className="app-layout">
      <Sidebar />

      <div className="main-section">
        <Navbar />

        <div style={{ padding: "30px" }}>
          <h2>🧠 Sentiment Analytics Dashboard</h2>
          <p style={{ opacity: 0.6 }}>
            Live Reddit Sentiment • Last Updated: {lastUpdated}
          </p>

          {loading && <p>Loading analytics...</p>}

          {!loading && (
            <>
              {/* 🔥 SUMMARY CARDS */}
              <div className="analytics-grid">
                <div className="analytics-card positive">
                  <h3>Positive</h3>
                  <h1>{summary.Positive || 0}</h1>
                  <p>{positivePercent.toFixed(1)}%</p>
                </div>

                <div className="analytics-card negative">
                  <h3>Negative</h3>
                  <h1>{summary.Negative || 0}</h1>
                  <p>{negativePercent.toFixed(1)}%</p>
                </div>

                <div className="analytics-card neutral">
                  <h3>Neutral</h3>
                  <h1>{summary.Neutral || 0}</h1>
                  <p>{neutralPercent.toFixed(1)}%</p>
                </div>
              </div>

              {/* 🔥 TREND BAR */}
              <div className="trend-box">
                <h3>Sentiment Distribution</h3>

                <div className="bar">
                  <div
                    className="bar-positive"
                    style={{ width: `${positivePercent}%` }}
                  />
                  <div
                    className="bar-neutral"
                    style={{ width: `${neutralPercent}%` }}
                  />
                  <div
                    className="bar-negative"
                    style={{ width: `${negativePercent}%` }}
                  />
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default SentimentOverview;