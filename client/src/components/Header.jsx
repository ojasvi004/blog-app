import { useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { UserDetails } from './UserDetails';

const Header = () => {
  const { setUserInfo, userInfo } = useContext(UserDetails);

  const navigate = useNavigate(); 

  useEffect(() => {
    axios
      .get("http://localhost:3000/profile", { withCredentials: true })
      .then((res) => {
        setUserInfo(res.data);
      })
      .catch((error) => {
        console.error("Error fetching profile:", error);
        setUserInfo(null);
      });
  }, [setUserInfo]);

  function logout(e) {
    e.preventDefault(); 

    axios.post('http://localhost:3000/logout', {}, { withCredentials: true })
      .then(() => {
        setUserInfo(null);
        navigate('/login'); 
      })
      .catch((error) => {
        console.error('Error during logout:', error);
      });
  }

  const username = userInfo?.username;

  return (
    <header>
      <Link to="/" className="logo">
        Blog
      </Link>
      <nav>
        {username ? (
          <>
            <Link to="/create">Create new post</Link>
            <a href="/" onClick={logout}>Logout</a>
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
