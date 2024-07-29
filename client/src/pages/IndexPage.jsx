import Post from "../components/Post";
import { useEffect, useState } from "react";
import axios from "axios";

const IndexPage = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:3000/api/v1/post")
      .then((response) => {
        setPosts(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        console.log("Error fetching the posts", error);
      });
  }, []);

  return (
    <>
      {posts.length > 0 &&
        posts.map((post) => <Post key={post._id} {...post} />)}
    </>
  );
};

export default IndexPage;
