import { useEffect, useState, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import { formatISO9075 } from "date-fns";
import axios from "axios";
import { UserDetails } from "../components/UserDetails";
import CreateComment from "../components/CreateComment";
import { FaRegComment } from "react-icons/fa";

const PostPage = () => {
  const [postInfo, setPostInfo] = useState(null);
  const [authorInfo, setAuthorInfo] = useState(null);
  const [comments, setComments] = useState([]);
  const [replyToCommentId, setReplyToCommentId] = useState(null);
  const [commentContent, setCommentContent] = useState("");
  const { userInfo } = useContext(UserDetails);
  const { id } = useParams();

  useEffect(() => {
    const fetchPostInfo = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/v1/post/${id}`
        );
        setPostInfo(response.data);
        console.log("post Info:", response.data);
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
          console.log("author info:", response.data);
        } catch (error) {
          console.log("error fetching author");
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
        console.log("error fetching comments", error);
      }
    };
    fetchComments();
  }, [id]);

  const handleReplyClick = (commentId) => {
    setReplyToCommentId(commentId);
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `http://localhost:3000/api/v1/post/${id}/comment`,
        {
          userId: userInfo.id,
          postId: id,
          content: commentContent,
          parent_comment: replyToCommentId,
        },
        { withCredentials: true }
      );

      if (response.status === 201) {
        console.log("comment created successfully!");
        setCommentContent("");
        setReplyToCommentId(null);
      } else {
        console.log("failed to create comment");
      }
    } catch (error) {
      console.log("Error creating comment:", error);
      console.log("postId:", id);
      console.log("userId:", userInfo.id);
      console.log("parentCommentId:", replyToCommentId);
    }
  };

  const organizeComments = (comments) => {
    const commentMap = {};
    const topLevelComments = [];

    comments.forEach((comment) => {
      commentMap[comment._id] = { ...comment, replies: [] };
    });

    comments.forEach((comment) => {
      if (comment.parent_comment) {
        const parent = commentMap[comment.parent_comment];
        if (parent) {
          parent.replies.push(commentMap[comment._id]);
        }
      } else {
        topLevelComments.push(commentMap[comment._id]);
      }
    });

    return topLevelComments;
  };

  const renderComments = (comments) =>
    comments.map((comment) => (
      <div
        key={comment._id}
        style={{
          border: "2px solid #C8B6FF",
          padding: "10px",
          marginBottom: "10px",
          borderRadius: "10px",
        }}
      >
        <div>@{comment.user.username}</div>
        <p>{comment.content}</p>
        <button onClick={() => handleReplyClick(comment._id)}>
          <FaRegComment />
        </button>
        {replyToCommentId === comment._id && (
          <div>
            <textarea
              value={commentContent}
              onChange={(e) => setCommentContent(e.target.value)}
              placeholder="Reply here"
            />
            <button onClick={handleCommentSubmit}>Submit Reply</button>
            <button onClick={() => setReplyToCommentId(null)}>Cancel</button>
          </div>
        )}
        {comment.replies.length > 0 && (
          <div style={{ marginLeft: "20px" }}>
            {renderComments(comment.replies)}
          </div>
        )}
      </div>
    ));

  const topLevelComments = organizeComments(comments);

  return (
    <div>
      {postInfo ? (
        <>
          <h1>{postInfo.title}</h1>
          <div>
            <p>By: {authorInfo?.username || "Author not found"}</p>
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
              src="https://i.pinimg.com/564x/b9/4c/07/b94c07c86752505af6675a25f07f5a75.jpg"
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

      {topLevelComments.length > 0 && renderComments(topLevelComments)}
    </div>
  );
};

export default PostPage;
