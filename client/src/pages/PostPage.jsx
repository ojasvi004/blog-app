import { useEffect, useState, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import { formatISO9075 } from "date-fns";
import axios from "axios";
import { UserDetails } from "../components/UserDetails";
import CreateComment from "../components/CreateComment";

const PostPage = () => {
  const [postInfo, setPostInfo] = useState(null);
  const [authorInfo, setAuthorInfo] = useState(null);
  const [comments, setComments] = useState([]);
  const { userInfo } = useContext(UserDetails);
  const { id } = useParams();

  useEffect(() => {
    const fetchPostInfo = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/v1/post/${id}`
        );
        setPostInfo(response.data);
        console.log("Post Info:", response.data);
      } catch (error) {
        console.log("Error fetching post");
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
          console.log("Author info:", response.data);
        } catch (error) {
          console.log("Error fetching author");
        }
      };
      fetchAuthorInfo();
    }
  }, [postInfo?.author]);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/v1/post/${id}/comment`
        );
        setComments(response.data);
        console.log("comments:", response.data);
      } catch (error) {
        console.log("Error fetching comments", error);
      }
    };
    fetchComments();
  }, [id]);

  return (
    <div>
      {postInfo ? (
        <>
          <h1>{postInfo.title}</h1>
          <div>
            <p>By: {authorInfo?.username || "author not found"}</p>
            <time>{formatISO9075(new Date(postInfo.createdAt))}</time>
          </div>
          {userInfo?.id === postInfo.author && (
            <div>
              <Link to={`/edit/${postInfo._id}`} className="edit">
                Edit Post
              </Link>
            </div>
          )}
          {postInfo.cover && (
            <img
              src={postInfo.cover}
              alt="Cover"
              style={{ maxWidth: "300px", height: "300px" }}
            />
          )}
          <div dangerouslySetInnerHTML={{ __html: postInfo.content }} />
        </>
      ) : (
        <p>Loading...</p>
      )}

      {userInfo && postInfo && (
        <CreateComment userId={userInfo.id} postId={postInfo._id} />
      )}
      {comments.length > 0 &&
        comments.map((comment) => (
          <div key={comment._id}>
            <div>By: {comment.user.username}</div>
            <p>{comment.content}</p>
          </div>
        ))}
    </div>
  );
};

export default PostPage;
