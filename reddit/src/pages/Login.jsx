import React, { useState } from "react"
import { FaUser, FaLock, FaRocket, FaGoogle } from "react-icons/fa"
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth"
import { auth, googleProvider } from "../firebase"
import { useNavigate, Link } from "react-router-dom"
import "./Auth.css"

const Login = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const navigate = useNavigate()

  const handleLogin = async (e) => {
  e.preventDefault()

  try {
    await signInWithEmailAndPassword(auth, email, password)

    navigate("/home")   // go to home after login

  } catch (err) {
    alert(err.message)
  }
}

  const handleGoogleLogin = async () => {
  try {
    await signInWithPopup(auth, googleProvider)

    navigate("/home")

  } catch (err) {
    alert(err.message)
  }
}
  return (
    <div className="auth-wrapper">
      <div className="auth-card">

        {/* LEFT SIDE */}
        <div className="auth-left">
          <h1>Welcome Again</h1>
          
          <FaRocket className="rocket-icon" />
        </div>

        {/* RIGHT SIDE */}
        <div className="auth-right">
          <h2>USER LOGIN</h2>
          <p className="subtext">Welcome back!</p>

          <form onSubmit={handleLogin}>
            <div className="input-group">
              <FaUser className="input-icon" />
              <input
                type="email"
                placeholder="Email"
                onChange={(e)=>setEmail(e.target.value)}
                required
              />
            </div>

            <div className="input-group">
              <FaLock className="input-icon" />
              <input
                type="password"
                placeholder="Password"
                onChange={(e)=>setPassword(e.target.value)}
                required
              />
            </div>

            <div className="form-row">
              <label>
                <input type="checkbox" /> Remember
              </label>
              <span className="forgot">Forgot password?</span>
            </div>

            <button className="btn-primary">LOGIN</button>
          </form>

          <button className="btn-google" onClick={handleGoogleLogin}>
            <FaGoogle /> Sign in with Google
          </button>

          <p className="switch-text">
            Don’t have an account? <Link to="/signup">Create Account</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login