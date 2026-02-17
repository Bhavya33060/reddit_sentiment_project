import { useState, useEffect } from "react"
import { signOut, onAuthStateChanged } from "firebase/auth"
import { auth } from "../firebase"
import { useNavigate } from "react-router-dom"

const Navbar = ({ setSearchTerm }) => {
  const [user, setUser] = useState(null)
  const [dropdown, setDropdown] = useState(false)
  const [darkMode, setDarkMode] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)
    })
    return () => unsubscribe()
  }, [])

  const handleLogout = async () => {
    await signOut(auth)
    navigate("/")
  }

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
    document.body.classList.toggle("dark-mode")
  }

  return (
    <div className="navbar">
      <h2 className="logo">REDDITIQ</h2>

      <input
        type="text"
        placeholder="Search posts..."
        className="search-input"
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <div className="nav-right">
        <button onClick={toggleDarkMode} className="dark-btn">
          🌙
        </button>

        <div className="profile" onClick={() => setDropdown(!dropdown)}>
          {user?.displayName || user?.email?.split("@")[0]}
        </div>

        {dropdown && (
          <div className="dropdown">
            <p>{user?.email}</p>
            <button onClick={handleLogout}>Logout</button>
          </div>
        )}
      </div>
    </div>
  )
}

export default Navbar