import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import axios from "axios";

const EditPage = () => {
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);
  const [redirect, setRedirect] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPostData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/v1/post/${id}`
        );
        const post = response.data;
        if (post) {
          setTitle(post.title);
          setSummary(post.summary);
          setContent(post.content);
        }
      } catch (error) {
        setError("Error fetching post data");
      }
    };
    fetchPostData();
  }, [id]);

  const handleUpdatePost = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("summary", summary);
    formData.append("content", content);
    if (file) {
      formData.append("file", file);
    }

    try {
      await axios.put(`http://localhost:3000/api/v1/post/${id}`, formData);
      setRedirect(true);
    } catch (error) {
      setError("Error updating post");
    }
  };

  useEffect(() => {
    if (redirect) {
      navigate("/");
    }
  }, [redirect, navigate]);

  const modules = {
    toolbar: [
      [{ header: [1, 2, false] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [
        { list: "ordered" },
        { list: "bullet" },
        { indent: "-1" },
        { indent: "+1" },
      ],
      ["link", "image"],
      ["clean"],
    ],
  };

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "indent",
    "link",
    "image",
  ];

  return (
    <div>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleUpdatePost}>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Summary"
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          required
        />
        <input type="file" onChange={(e) => setFile(e.target.files[0])} />
        <ReactQuill
          value={content}
          onChange={(newValue) => setContent(newValue)}
          modules={modules}
          formats={formats}
        />
        <button type="submit">Update Post</button>
      </form>
      {redirect && <p>Post updated successfully!</p>}
    </div>
  );
};

export default EditPage;
