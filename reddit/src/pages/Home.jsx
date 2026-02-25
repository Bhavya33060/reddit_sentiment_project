import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { doc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";
import { auth, db } from "../firebase";
import PostCard from "../components/PostCard";

const Home = ({ searchTerm }) => {  // ✅ Receive from App

  const navigate = useNavigate();

  const [posts, setPosts] = useState([]);
  const [summary, setSummary] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [postLimit, setPostLimit] = useState(null);
  const [refreshInterval, setRefreshInterval] = useState(null);
  const [seenPosts, setSeenPosts] = useState([]);

  const handlePostClick = async (id) => {
    const user = auth.currentUser;

    if (user) {
      await updateDoc(doc(db, "users", user.uid), {
        seenPosts: arrayUnion(id),
      });

      setSeenPosts((prev) => [...prev, id]);
    }

    navigate(`/post/${id}`);
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (!user) return;

      try {
        const docSnap = await getDoc(doc(db, "users", user.uid));

        if (docSnap.exists()) {
          const data = docSnap.data();

          setPostLimit(Number(data.postLimit) || 15);
          setRefreshInterval((Number(data.refreshInterval) || 20) * 1000);
          setSeenPosts(data.seenPosts || []);
        } else {
          setPostLimit(15);
          setRefreshInterval(20000);
        }
      } catch (err) {
        console.error("Error loading settings:", err);
        setPostLimit(15);
        setRefreshInterval(20000);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!postLimit || !refreshInterval) return;

    const fetchPosts = () => {
      setLoading(true);

      fetch(`http://127.0.0.1:5000/api/posts?limit=${postLimit}`)
        .then((res) => res.json())
        .then((data) => {

          const adjustedPosts = data.posts.map((post) => {
            if (seenPosts.includes(post.id)) {
              return {
                ...post,
                adjustedHeat: post.heat_score * 0.6,
              };
            } else {
              return {
                ...post,
                adjustedHeat: post.heat_score,
              };
            }
          });

          adjustedPosts.sort((a, b) => b.adjustedHeat - a.adjustedHeat);

          setPosts(adjustedPosts);
          setSummary(data.summary);
          setLoading(false);
        })
        .catch((err) => {
          setError(err.message);
          setLoading(false);
        });
    };

    fetchPosts();

    const interval = setInterval(fetchPosts, refreshInterval);
    return () => clearInterval(interval);
  }, [postLimit, refreshInterval, seenPosts]);

  // ✅ Search filter
  const filteredPosts = posts.filter((post) =>
    post.title?.toLowerCase().includes(searchTerm?.toLowerCase() || "")
  );

  return (
    <div className="feed-container">
      {loading && <p>Loading posts...</p>}
      {error && <p>Error: {error}</p>}

      {!loading &&
        !error &&
        filteredPosts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            isNew={!seenPosts.includes(post.id)}
            onClick={() => handlePostClick(post.id)}
          />
        ))}

      {!loading && filteredPosts.length === 0 && (
        <p style={{ textAlign: "center" }}>No posts found</p>
      )}
    </div>
  );
};

export default Home;