import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PostCard from "../components/PostCard";

const Home = () => {
  const navigate = useNavigate();

  const [posts, setPosts] = useState([]);
  const [summary, setSummary] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handlePostClick = (id) => {
    navigate(`/post/${id}`);
  };

  useEffect(() => {
    const fetchPosts = () => {
      fetch("http://127.0.0.1:5000/api/posts")
        .then((res) => res.json())
        .then((data) => {
          setPosts(data.posts);
          setSummary(data.summary);
          setLoading(false);
        })
        .catch((err) => {
          setError(err.message);
          setLoading(false);
        });
    };

    fetchPosts();
    const interval = setInterval(fetchPosts, 20000);
    return () => clearInterval(interval);
  }, []);

  const filteredPosts = posts.filter((post) =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
   
     

      <div className="feed-container">
        {loading && <p>Loading posts...</p>}
        {error && <p>Error: {error}</p>}

        {!loading &&
          !error &&
          filteredPosts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              onClick={() => handlePostClick(post.id)}
            />
          ))}
      </div>
    </div>
  );
};

export default Home;