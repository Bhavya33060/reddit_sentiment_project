import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";

function SentimentOverview() {
  const [posts, setPosts] = useState([]);
  const [summary, setSummary] = useState({});
  const [trendData, setTrendData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = () => {
      fetch("http://127.0.0.1:5000/api/posts")
        .then((res) => res.json())
        .then((data) => {
          setPosts(data.posts);
          setSummary(data.summary);

          const now = new Date().toLocaleTimeString();

          setTrendData((prev) => [
            ...prev.slice(-9),
            {
              time: now,
              Positive: data.summary.Positive || 0,
              Negative: data.summary.Negative || 0,
              Neutral: data.summary.Neutral || 0,
            },
          ]);

          setLoading(false);
        })
        .catch((err) => console.error("Fetch error:", err));
    };

    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  const totalPosts = posts.length;

  const sentimentScore = totalPosts
    ? (((summary.Positive || 0) - (summary.Negative || 0)) /
        totalPosts) *
      100
    : 0;

  // 🔥 CONTROVERSY SCORE
  const calculateControversy = (summary) => {
    const { Positive = 0, Negative = 0, Neutral = 0 } = summary;

    const total = Positive + Negative + Neutral;
    if (total === 0) return 0;

    const diff = Math.abs(Positive - Negative);
    const intensity = (Positive + Negative) / total;
    const balance = 1 - diff / (Positive + Negative || 1);

    return intensity * balance * 100;
  };

  const controversyScore = calculateControversy(summary);

  // 🔥 HEAT INDICATOR
  const negativePercent = totalPosts
    ? (summary.Negative / totalPosts) * 100
    : 0;

  let heatLevel = "🟢 Calm";
  let heatColor = "#2ecc71";

  if (controversyScore > 70 || negativePercent > 50) {
    heatLevel = "🔴 Heated";
    heatColor = "#e74c3c";
  } else if (controversyScore > 40 || negativePercent > 30) {
    heatLevel = "🟡 Warm";
    heatColor = "#f39c12";
  }

  // 🧠 SMART SUMMARY
  const generateSummary = () => {
    let tone = "";
    if (sentimentScore > 50) tone = "strongly positive";
    else if (sentimentScore > 20) tone = "moderately positive";
    else if (sentimentScore > 0) tone = "slightly positive";
    else if (sentimentScore < -30) tone = "strongly negative";
    else tone = "mixed";

    let controversyText =
      controversyScore > 60
        ? "with high controversy"
        : controversyScore > 40
        ? "with growing debate"
        : "with stable engagement";

    return `Current discussion is ${tone} ${controversyText}.`;
  };

  const chartData = [
    { name: "Positive", value: summary.Positive || 0 },
    { name: "Negative", value: summary.Negative || 0 },
    { name: "Neutral", value: summary.Neutral || 0 },
  ];

  return (
    <div style={{ padding: "40px" }}>
      <h2 style={{ marginBottom: "30px" }}>
        📊 Advanced Sentiment Dashboard
      </h2>

      {loading && <p>Loading...</p>}

      {!loading && (
        <>
          {/* KPI SECTION */}
          <div className="kpi-grid">
            <div className="kpi-card">
              <h4>Total Posts</h4>
              <h1>{totalPosts}</h1>
            </div>

            <div className="kpi-card">
              <h4>Sentiment Score</h4>
              <h1>{sentimentScore.toFixed(1)}%</h1>
              <p>
                {sentimentScore > 60
                  ? "🚀 Strong Positive"
                  : sentimentScore > 30
                  ? "🙂 Moderate"
                  : sentimentScore > 0
                  ? "⚖ Mixed"
                  : "⚠ Negative"}
              </p>
            </div>

            <div className="kpi-card">
              <h4>Controversy Score</h4>
              <h1>{controversyScore.toFixed(1)}%</h1>
              <p>
                {controversyScore > 70
                  ? "🔥 Highly Controversial"
                  : controversyScore > 40
                  ? "⚖ Debated Topic"
                  : "🙂 Stable Discussion"}
              </p>
            </div>
          </div>

          

          {/* SUMMARY CARDS */}
          <div className="analytics-grid">
            <div className="analytics-card positive">
              <h3>Positive</h3>
              <h1>{summary.Positive || 0}</h1>
            </div>

            <div className="analytics-card negative">
              <h3>Negative</h3>
              <h1>{summary.Negative || 0}</h1>
            </div>

            <div className="analytics-card neutral">
              <h3>Neutral</h3>
              <h1>{summary.Neutral || 0}</h1>
            </div>
          </div>

          {/* LINE CHART */}
          <div className="chart-box">
            <h3>Live Sentiment Trend</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Legend />

                <Line type="monotone" dataKey="Neutral" stroke="#95a5a6" strokeWidth={3} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="Negative" stroke="#e74c3c" strokeWidth={3} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="Positive" stroke="#2ecc71" strokeWidth={3} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* AREA CHART */}
          <div className="chart-box">
            <h3>Sentiment Area Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={trendData}>
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />

                <Area type="monotone" dataKey="Neutral" fill="#95a5a6" stroke="#95a5a6" fillOpacity={0.3} />
                <Area type="monotone" dataKey="Negative" fill="#e74c3c" stroke="#e74c3c" fillOpacity={0.3} />
                <Area type="monotone" dataKey="Positive" fill="#2ecc71" stroke="#2ecc71" fillOpacity={0.3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* BAR CHART */}
          <div className="chart-box">
            <h3>Current Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#6c5ce7" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          {/* Heat + Summary */}
          <div className="kpi-card" style={{ marginTop: "20px" }}>
            <h4>Discussion Heat</h4>
            <h1 style={{ color: heatColor }}>{heatLevel}</h1>
          </div>

          <div className="kpi-card" style={{ marginTop: "20px" }}>
            <h4>AI Discussion Summary</h4>
            <p style={{ marginTop: "10px" }}>
              {generateSummary()}
            </p>
          </div>
        </>
        
      )}
    </div>
  );
}

export default SentimentOverview;
