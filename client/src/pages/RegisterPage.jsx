import { useState } from "react";
import axios from "axios";

const RegisterPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  async function register(e) {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:3000/api/v1/register",
        { username, password },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.status === 200) {
        alert("Registration successful");
      }
    } catch (error) {
      alert(error.response.data.msg || "Registration failed");
    }
  }

  return (
    <form onSubmit={register}>
      <h1>Register</h1>
      <input
        type="text"
        value={username}
        placeholder="username"
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="password"
      />
      <button type="submit">Register</button>
    </form>
  );
};

export default RegisterPage;
