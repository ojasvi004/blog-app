import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const login = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:3000/api/v1/login",
        { username, password },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        alert("Login successful");
        navigate("/");
      }
    } catch (error) {
      alert("Invalid credentials");
    }
    location.reload();
  };

  return (
    <form className="login" onSubmit={login}>
      <h1>Login</h1>
      <input
        className="login"
        type="text"
        placeholder="username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        className="login"
        type="password"
        placeholder="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button className="login-btn" type="submit">
        Login
      </button>
    </form>
  );
};

export default LoginPage;
