import React, { useState } from "react";
import { Link } from "react-router-dom";
import './signUp.css';

function SignUp() {
    //stores the input of username,password, and the feedback message for user
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
        //tries to send POST request
      const response = await fetch('http://localhost:8080/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        //turns users input into a json string
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      //add success message and clears the input fields
      if (response.ok) {
        setMessage("Sign up successful! You can now log in.");
        setUsername('');
        setPassword('');
      } else {
        setMessage(data.message || "Registration failed.");
      }

    } catch (err) {
      console.error(err);
      setMessage("Something went wrong. Try again later.");
    }
  };

  return (
    <div className="signup-container">
      <h2>Create Your Account</h2>
      <form className="signup-form" onSubmit={handleSubmit}>
        <div>
          <input 
            type="text" 
            name="username" 
            placeholder="Username" 
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required 
          />
        </div>
        <div>
          <input 
            type="password" 
            name="password" 
            placeholder="Password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required 
          />
        </div>
        <button type="submit">Sign Up</button>
        {message && <p>{message}</p>}
        <p>Already have an account? <Link to="/login">Log in</Link></p>
      </form>
    </div>
  );
}

export default SignUp;