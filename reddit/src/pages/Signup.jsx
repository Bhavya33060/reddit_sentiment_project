import React, { useState } from "react"
import { FaUser, FaLock, FaRocket } from "react-icons/fa"
import { createUserWithEmailAndPassword } from "firebase/auth"
import { auth } from "../firebase"
import { useNavigate, Link } from "react-router-dom"
import "./Auth.css"

const Signup = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const navigate = useNavigate()

  const handleSignup = async (e) => {
  e.preventDefault()

  try {
    await createUserWithEmailAndPassword(auth, email, password)

    alert("Account created successfully. Please login.")

    navigate("/")   // redirect to login page

  } catch (err) {
    alert(err.message)
  }
}

  return (
    <div className="auth-wrapper">
      <div className="auth-card">

        {/* LEFT SIDE */}
        <div className="auth-left">
          <h1>Create Account</h1>
          <p>Join our platform today</p>
          <FaRocket className="rocket-icon" />
        </div>

        {/* RIGHT SIDE */}
        <div className="auth-right">
          <h2>SIGN UP</h2>
          <p className="subtext">Start your journey</p>

          <form onSubmit={handleSignup}>
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

            <button className="btn-primary">CREATE ACCOUNT</button>
          </form>

          <p className="switch-text">
            Already have an account? <Link to="/">Login</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Signup