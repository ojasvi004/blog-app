import { UserDetails } from "../components/UserDetails";
import axios from "axios";
import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { formatISO9075 } from "date-fns";

const PostPage = () => {
  const [postInfo, setPostInfo] = useState(null);
  const [authorInfo, setAuthorInfo] = useState(null);
  const { userInfo } = useContext(UserDetails);
  const { id } = useParams();

  useEffect(() => {
    const fetchPostInfo = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/v1/post/${id}`
        );
        setPostInfo(response.data);
        console.log(response.data);
      } catch (error) {
        console.log("error fetching post");
      }
    };
    fetchPostInfo();
  }, [id]);

  useEffect(() => {
    if (postInfo?.author) {
      const fetchAuthorInfo = async () => {
        try {
          const response = await axios.get(
            `http://localhost:3000/api/v1/author/${postInfo.author}`
          );
          setAuthorInfo(response.data);
          console.log(response.data);
        } catch (error) {
          console.log("error fetching author");
        }
      };
      fetchAuthorInfo();
    }
  }, [postInfo]);

  return (
    <div>
      {postInfo ? (
        <>
          <h1>{postInfo.title}</h1>
          <div>
            <p>By: {authorInfo?.username || "Author not found"}</p>
            <time>{formatISO9075(new Date(postInfo.createdAt))}</time>
          </div>

          {postInfo.cover && (
            <img
              src="https://i.pinimg.com/564x/b9/4c/07/b94c07c86752505af6675a25f07f5a75.jpg"
              style={{ maxWidth: "300px", height: "300px" }}
            />
          )}
          <div dangerouslySetInnerHTML={{ __html: postInfo.content }} />
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default PostPage;
