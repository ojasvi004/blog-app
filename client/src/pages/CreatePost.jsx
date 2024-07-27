import { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import axios from "axios";

const CreatePost = () => {
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [files, setFiles] = useState(null);
  const [error, setError] = useState(null);
  const [redirect, setRedirect] = useState(null);

  async function createNewPost(e) {
    e.preventDefault();

    if (!title || !summary || !content) {
      setError("All fields are required");
      return;
    }

    const data = new FormData();
    data.set("title", title);
    data.set("summary", summary);
    data.set("content", content);
    if (files) {
      data.append("file", files[0]);
    }

    setError(null);

    try {
      const response = await axios.post("http://localhost:3000/api/v1/post", data);
      if (response.status === 201) {
        setRedirect(true);
      }
    } catch (error) {
      setError("Failed to create post. Please try again.");
      console.log(error);
    }
  }

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
      <form onSubmit={createNewPost}>
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
        <input type="file" onChange={(e) => setFiles(e.target.files)} />
        <ReactQuill
          value={content}
          onChange={(newValue) => setContent(newValue)}
          modules={modules}
          formats={formats}
        />
        <button type="submit">Post</button>
      </form>
      {redirect && <p>Post created successfully!</p>}
    </div>
  );
};

export default CreatePost;
