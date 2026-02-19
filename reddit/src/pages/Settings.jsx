import { useState, useEffect } from "react";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
import { useTheme } from "../ThemeContext";
import Toggle from "../components/Toggle";

function Settings() {
  const { darkMode, setDarkMode } = useTheme();

  const [activeTab, setActiveTab] = useState("profile");
  const [showToast, setShowToast] = useState(false);

  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
 


  // 🔥 NEW ANALYTICS STATES
  const [negativeThreshold, setNegativeThreshold] = useState(50);
  const [controversyThreshold, setControversyThreshold] = useState(70);
  const [refreshInterval, setRefreshInterval] = useState(5);
  const [showRatePopup, setShowRatePopup] = useState(true);
const [rating, setRating] = useState(0);


  // 🔥 Load existing profile data
  useEffect(() => {
    const loadProfile = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        setFullName(data.fullName || "");
        setUsername(data.username || "");
        setBio(data.bio || "");

        // Load analytics if exists
        setNegativeThreshold(data.negativeThreshold || 50);
        setControversyThreshold(data.controversyThreshold || 70);
        setRefreshInterval(data.refreshInterval || 5);
      }
    };

    loadProfile();
  }, []);
useEffect(() => {
  const hasSeen = sessionStorage.getItem("ratedPopupSeen");

  if (!hasSeen) {
    setTimeout(() => {
      setShowRatePopup(true);
    }, 800); // slight delay feels smoother

    sessionStorage.setItem("ratedPopupSeen", "true");
  }
}, []);

  // 🔥 Save profile + analytics
  const saveProfile = async () => {
    const user = auth.currentUser;
    if (!user) return;

    await setDoc(doc(db, "users", user.uid), {
      fullName,
      username,
      bio,
      email: user.email,
      negativeThreshold,
      controversyThreshold,
      refreshInterval,
    });

    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  return (
    <div className="settings-wrapper">
      {showToast && (
        <div className="toast">Profile Updated Successfully</div>
      )}

      <h2>⚙️ Account Settings</h2>

      <div className="settings-layout">
        <div className="settings-nav">
          {["profile", "appearance", "analytics"].map((tab) => (
            <div
              key={tab}
              className={`nav-item ${activeTab === tab ? "active" : ""}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </div>
          ))}
        </div>

        <div className="settings-panel">

          {/* PROFILE */}
          {activeTab === "profile" && (
            <div className="profile-row">
              <input
                placeholder="Full Name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />

              <input
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />

              <textarea
                placeholder="Bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
              />

              <button onClick={saveProfile} className="accent-btn">
                Save
              </button>
            </div>
          )}

          {/* APPEARANCE (UNCHANGED) */}
          {activeTab === "appearance" && (
            <div className="appearance-section">
              
              <div className="appearance-card">
                <h3>Theme</h3>

                <div className="setting-row">
                  <div>
                    <strong>Dark Mode</strong>
                    <p>Switch between light and dark interface</p>
                  </div>
                  <Toggle value={darkMode} onChange={setDarkMode} />
                </div>
              </div>

              <div className="appearance-card">
                <h3>Layout Density</h3>

                <div className="density-options">
                  {["compact", "comfortable", "spacious"].map((mode) => (
                    <button
                      key={mode}
                      onClick={() => {
                        document.body.setAttribute("data-density", mode);
                      }}
                    >
                      {mode.charAt(0).toUpperCase() + mode.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              <div className="appearance-card">
                <h3>Font Size</h3>

                <select
                  onChange={(e) => {
                    document.documentElement.style.fontSize =
                      e.target.value + "px";
                  }}
                >
                  <option value="14">Small</option>
                  <option value="16">Medium</option>
                  <option value="18">Large</option>
                  <option value="20">Extra Large</option>
                </select>
              </div>

            </div>
          )}

          {/* 🔥 NEW ANALYTICS TAB */}
          {activeTab === "analytics" && (
            <div className="appearance-section">

              <div className="appearance-card">
                <h3>🚨 Alert Thresholds</h3>

                <div className="setting-row">
                  <div>
                    <strong>Negative Alert (%)</strong>
                  </div>
                  <input
                    type="number"
                    value={negativeThreshold}
                    onChange={(e) => setNegativeThreshold(e.target.value)}
                    min="0"
                    max="100"
                  />
                </div>

                <div className="setting-row">
                  <div>
                    <strong>Controversy Alert (%)</strong>
                  </div>
                  <input
                    type="number"
                    value={controversyThreshold}
                    onChange={(e) => setControversyThreshold(e.target.value)}
                    min="0"
                    max="100"
                  />
                </div>
              </div>

              <div className="appearance-card">
                <h3>🔄 Auto Refresh Interval</h3>

                <select
                  value={refreshInterval}
                  onChange={(e) => setRefreshInterval(e.target.value)}
                >
                  <option value="5">5 seconds</option>
                  <option value="10">10 seconds</option>
                  <option value="30">30 seconds</option>
                  <option value="60">1 minute</option>
                </select>
              </div>

              <button onClick={saveProfile} className="accent-btn">
                Save Analytics Settings
              </button>

            </div>
          )}

{showRatePopup && (
  <div className="rate-popup-overlay">
    <div className="rate-popup">
      <h3>❤️ Do You Love REDDITIQ?</h3>
      <p>Rate your experience with our AI Sentiment Dashboard</p>

      <div className="heart-row">
        {[1, 2, 3, 4, 5].map((num) => (
          <span
            key={num}
            className={`heart ${rating >= num ? "active" : ""}`}
            onClick={() => setRating(num)}
          >
            ❤️
          </span>
        ))}
      </div>

      {rating > 0 && (
        <p className="rate-caption">
          {rating >= 4
            ? "You're making our AI blush! 💖"
            : rating === 3
            ? "We’ll work harder to impress you!"
            : "Thanks for the honest feedback!"}
        </p>
      )}

      <button
        className="accent-btn"
        onClick={() => setShowRatePopup(false)}
      >
        Submit
      </button>
    </div>
  </div>
)}

        </div>
      </div>
    </div>
  );
}

export default Settings;
