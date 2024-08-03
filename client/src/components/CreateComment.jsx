import { useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const CreateComment = ({ userId, postId, parentCommentId = null }) => {
  const [content, setContent] = useState("");
  const { id } = useParams();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `http://localhost:3000/api/v1/post/${id}/createComment`,
        {
          userId,
          postId,
          content,
          parent_comment: parentCommentId,
        },
        { withCredentials: true }
      );

      if (response.status === 201) {
        console.log("comment created successfully!");
        setContent("");
      } else {
        console.log("failed to create comment");
      }
    } catch (error) {
      console.log("Error creating comment:", error);
      console.log("postId:", postId);
      console.log("userId:", userId);
      console.log("parentCommentId:", parentCommentId);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="content">Comment</label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          ></textarea>
        </div>
        <button type="submit">Post Comment</button>
      </form>
    </div>
  );
};

export default CreateComment;
