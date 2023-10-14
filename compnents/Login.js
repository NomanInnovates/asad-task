"use client";
import React, { useState } from "react";

import "./Login.css";

export default function Login() {
  const [isLoading, setLoading] = useState(false);
  const [username, setUsername] = useState("user1");
  const [password, setPassword] = useState("password1");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:8000/signin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username,
          password: password,
        }),
      });

      if (response.ok) {
        const parsedData = await response.json();
        const token = parsedData?.token;
        if (token) {
          document.cookie = `token=${token}`;
          window.location.href = "/search-country";
        } else {
          alert("Token not found in the response headers");
        }
      } else {
        alert("Login failed");
      }
      setLoading(false);
    } catch (e) {
      console.log("catch", e);
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <h1 className="login-heading">Login Page</h1>
      <form onSubmit={handleLogin} className="login-form">
        <label className="login-label">
          Email:
          <input
            className="login-input"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </label>
        <label className="login-label">
          Password:
          <input
            className="login-input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        <button disabled={isLoading} type="submit" className="login-button">
          {isLoading ? "Loading.." : "Login"}
        </button>
      </form>
      <p className="login-hint">Hint: user1, password1</p>
    </div>
  );
}
