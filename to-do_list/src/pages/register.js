// src/pages/Register.js
import React, { useState, useEffect } from "react";
import { createUserWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, provider } from "../firebase";
import { useNavigate, Link } from "react-router-dom";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect if user is already logged in
    auth.onAuthStateChanged((user) => {
      if (user) navigate("/");
    });
  }, [navigate]);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!email || !password || !confirmPassword) {
      setError("Please fill in all fields");
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("Password should be at least 6 characters");
      setLoading(false);
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      navigate("/todo");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError("");
    setLoading(true);

    try {
      await signInWithPopup(auth, provider);
      navigate("/todo");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <h2>Create Account</h2>
      <form onSubmit={handleRegister}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={loading}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={loading}
          minLength="6"
        />
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          disabled={loading}
          minLength="6"
        />
        <button 
          type="submit" 
          disabled={loading}
          style={{
            padding: '8px 12px',
            borderRadius: '6px',
            border: 'none',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontSize: '14px',
            minWidth: '40px',
            height: '36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#007bff',
            color: 'white',
            fontWeight: '500',
            opacity: loading ? 0.7 : 1,
            transition: 'all 0.2s ease'
          }}
          onMouseOver={(e) => {
            if (!loading) {
              e.target.style.backgroundColor = '#0056b3';
            }
          }}
          onMouseOut={(e) => {
            if (!loading) {
              e.target.style.backgroundColor = '#007bff';
            }
          }}
        >
          {loading ? 'Creating Account...' : 'Register'}
        </button>
        {error && <p className="error">{error}</p>}
      </form>
      
      {/* Google Sign-In */}
      <div style={{ margin: '20px 0', textAlign: 'center' }}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          marginBottom: '15px' 
        }}>
          <div style={{ 
            flex: 1, 
            height: '1px', 
            backgroundColor: '#ddd' 
          }}></div>
          <span style={{ 
            padding: '0 15px', 
            color: '#666', 
            fontSize: '14px' 
          }}>
            OR
          </span>
          <div style={{ 
            flex: 1, 
            height: '1px', 
            backgroundColor: '#ddd' 
          }}></div>
        </div>
        
        <button
          onClick={handleGoogleSignIn}
          disabled={loading}
          style={{
            width: '100%',
            padding: '8px 12px',
            backgroundColor: 'white',
            color: '#444',
            border: '2px solid #ddd',
            borderRadius: '6px',
            fontSize: '14px',
            fontWeight: '500',
            cursor: loading ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            transition: 'all 0.2s ease',
            opacity: loading ? 0.7 : 1,
            minHeight: '36px'
          }}
          onMouseOver={(e) => {
            if (!loading) {
              e.target.style.backgroundColor = '#f8f9fa';
              e.target.style.borderColor = '#ccc';
            }
          }}
          onMouseOut={(e) => {
            e.target.style.backgroundColor = 'white';
            e.target.style.borderColor = '#ddd';
          }}
        >
          <svg width="18" height="18" viewBox="0 0 18 18">
            <path fill="#4285F4" d="M16.51 8.44c0-.62-.05-1.22-.15-1.8H8.97v3.4h4.28c-.19 1.04-.76 1.92-1.62 2.51v2.07h2.62c1.54-1.42 2.66-3.51 2.66-6.18z"/>
            <path fill="#34A853" d="M8.97 17.5c2.15 0 3.95-.71 5.27-1.92l-2.62-2.07c-.71.48-1.62.76-2.65.76-2.04 0-3.77-1.38-4.39-3.24H1.87v2.13c1.24 2.47 3.79 4.34 7.1 4.34z"/>
            <path fill="#FBBC05" d="M4.58 10.82c-.13-.46-.2-.95-.2-1.45s.07-.99.2-1.45V5.24H1.87c-.52 1.04-.82 2.21-.82 3.58s.3 2.54.82 3.58l2.69-2.58z"/>
            <path fill="#EA4335" d="M8.97 3.5c1.26 0 2.39.43 3.28 1.28l2.41-2.41C12.92.9 11.12 0 8.97 0 5.66 0 3.11 1.87 1.87 4.34l2.71 2.58c.62-1.86 2.35-3.24 4.39-3.24z"/>
          </svg>
          Continue with Google
        </button>
      </div>
      
      <div style={{ marginTop: '20px', textAlign: 'center' }}>
        <p style={{ color: '#666', marginBottom: '10px' }}>
          Already have an account? 
        </p>
        <Link 
          to="/login" 
          style={{
            color: '#007bff',
            textDecoration: 'none',
            fontWeight: 'bold'
          }}
        >
          Sign In
        </Link>
      </div>
    </div>
  );
};

export default Register;
