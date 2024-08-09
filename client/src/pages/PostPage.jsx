import { useEffect, useState, useContext } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import { formatISO9075 } from "date-fns";
import axios from "axios";
import { UserDetails } from "../components/UserDetails";
import CreateComment from "../components/CreateComment";
import { FaRegComment } from "react-icons/fa";
import { FaRegTrashAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const PostPage = () => {
  const [postInfo, setPostInfo] = useState(null);
  const [authorInfo, setAuthorInfo] = useState(null);
  const [comments, setComments] = useState([]);
  const [replyToCommentId, setReplyToCommentId] = useState(null);
  const [commentContent, setCommentContent] = useState("");
  const { userInfo } = useContext(UserDetails);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPostInfo = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/v1/post/${id}`
        );
        setPostInfo(response.data);
        console.log("Post Info:", response.data);
      } catch (error) {
        console.log("Error fetching post:", error);
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
          console.log("Author Info:", response.data);
        } catch (error) {
          console.log("Error fetching author:", error);
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
        console.log("Comments:", response.data);
      } catch (error) {
        console.log("Error fetching comments:", error);
      }
    };
    fetchComments();
  }, [id]);

  const handleReplyClick = (commentId) => {
    setReplyToCommentId(commentId);
    console.log("Reply to Comment ID:", commentId);
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await axios.delete(`http://localhost:3000/api/v1/post/${id}/comment`, {
        params: { commentId },
      });

      setComments(comments.filter((comment) => comment._id !== commentId));
      console.log(`deleted comment id: ${commentId}`);
    } catch (error) {
      console.log("error deleting comment");
    }
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
        console.log("Comment created successfully!");
        setCommentContent("");
        setReplyToCommentId(null);
        setComments([...comments, response.data]);
      } else {
        console.log("Failed to create comment");
      }
    } catch (error) {
      console.log("Error creating comment:", error);
      console.log("Post ID:", id);
      console.log("User ID:", userInfo.id);
      console.log("Parent Comment ID:", replyToCommentId);
    }
  };
  const handleDeletePost = async () => {
    try {
      await axios.delete(`http://localhost:3000/api/v1/post/${id}`);
      console.log("post successfully deleted");
      navigate("/");
    } catch (error) {
      console.log("error deleting post", error);
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
        {userInfo?.id === comment.user._id && (
          <button onClick={() => handleDeleteComment(comment._id)}>
            <FaRegTrashAlt />
          </button>
        )}

        {replyToCommentId === comment._id && (
          <div>
            <textarea
              value={commentContent}
              onChange={(e) => setCommentContent(e.target.value)}
              placeholder="Reply here"
            />
            <button onClick={handleCommentSubmit}>Submit</button>
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
          <div className="author-info">
            <p>By: {authorInfo?.username || "Author not found"}</p>
            <time>{formatISO9075(new Date(postInfo.createdAt))}</time>
          </div>
          {userInfo?.id === postInfo.author && (
            <div>
              <button className="edit-delete">
                <Link to={`/edit/${postInfo._id}`} className="edit">
                  Edit
                </Link>
              </button>

              <button className="edit-delete" onClick={handleDeletePost}>
                Delete
              </button>
            </div>
          )}
          {postInfo.cover && (
            <img
              src={`http://localhost:3000/${postInfo.cover}`}
              alt="Cover"
              style={{ width: "300px", height: "300px", objectFit: "cover" }}
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
