import { useState, useEffect } from "react";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../ThemeContext";

const Navbar = ({ setSearchTerm }) => {
  const [user, setUser] = useState(null);
  const [profileData, setProfileData] = useState(null);
  const [dropdown, setDropdown] = useState(false);

  const { darkMode, setDarkMode } = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);

        const docRef = doc(db, "users", currentUser.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setProfileData(docSnap.data());
        }
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/");
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className={`navbar ${darkMode ? "dark-navbar" : ""}`}>

      <h2 className="logo">REDDITIQ</h2>

      <input
        type="text"
        placeholder="Search posts..."
        className="search-input"
        onChange={(e) => setSearchTerm && setSearchTerm(e.target.value)}
      />

      <div className="nav-right">
        <button onClick={toggleDarkMode} className="dark-btn">
          {darkMode ? "☀️" : "🌙"}
        </button>

        <div
  className="profile"
  onClick={() => setDropdown(!dropdown)}
>
  <img
    src={
      profileData?.photoURL ||
      "https://ui-avatars.com/api/?name=" +
        (profileData?.fullName || user?.email?.split("@")[0])
    }
    alt="profile"
    className="profile-img"
  />

  <span className="profile-name">
    {profileData?.fullName || user?.email?.split("@")[0]}
  </span>
</div>


        {dropdown && (
          <div className="dropdown">
            <h4>{profileData?.fullName}</h4>
            <p>{user?.email}</p>

            {profileData?.bio && (
              <p
                style={{
                  marginTop: "8px",
                  fontSize: "13px",
                  opacity: 0.8,
                }}
              >
                {profileData.bio}
              </p>
            )}

            <button onClick={handleLogout}>Logout</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;