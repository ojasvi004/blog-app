import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Header = () => {
  const [username, setUsername] = useState(null);
  const navigate = useNavigate(); 
  useEffect(() => {
    axios
      .get("http://localhost:3000/profile", { withCredentials: true })
      .then((res) => {
        setUsername(res.data.username);
      })
      .catch((error) => {
        console.error("Error fetching profile:", error);
        setUsername(null);
      });
  }, []);

  function logout(e) {
    e.preventDefault(); 

    axios.post('http://localhost:3000/logout', {}, { withCredentials: true })
      .then(() => {
        setUsername(null); 
        navigate('/login'); 
      })
      .catch((error) => {
        console.error('Error during logout:', error);
      });
  }


  return (
    <header>
      <Link to="/" className="logo">
        Blog
      </Link>
      <nav>
        {username ? (
          <>
            <a href="/create">Create new post</a>
            <a onClick={logout}>Logout</a>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </nav>
    </header>
  );
};

export default Header;
