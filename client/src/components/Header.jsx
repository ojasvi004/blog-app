import { useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { UserDetails } from './UserDetails';
import { IoLogOutOutline } from "react-icons/io5";

const Header = () => {
  const { setUserInfo, userInfo } = useContext(UserDetails);

  const navigate = useNavigate(); 

  useEffect(() => {
    axios
      .get("http://localhost:3000/api/v1/profile", { withCredentials: true })
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

    axios.post('http://localhost:3000/api/v1/logout', {}, { withCredentials: true })
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
            <Link to="/create" className='post-btn'>Post</Link>
            <a href="/" onClick={logout} className='logout-btn'><IoLogOutOutline /></a>
          </>
        ) : (
          <>
            <Link to="/login" className='post-btn'>Login</Link>
            <Link to="/register" className='post-btn'>Register</Link>
          </>
        )}
      </nav>
    </header>
  );
};

export default Header;
