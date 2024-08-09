import { formatISO9075 } from "date-fns";
import { Link } from "react-router-dom";

const Post = ({ _id, title, summary, cover, content, createdAt, author }) => {
  return (
    <div className="post" style={{ display: "flex", alignItems: "flex-start" }}>
      {cover && (
        <div className="image" style={{ marginRight: "20px" }}>
          <Link to={`/post/${_id}`}>
            <img
              src={`http://localhost:3000/${cover}`}
              alt="Cover"
              style={{ width: "200px", height: "200px", objectFit: "cover" }}
            />
          </Link>
        </div>
      )}

      <div className="texts" style={{ flex: 1 }}>
        <Link to={`/post/${_id}`}>
          <h2>{title}</h2>
        </Link>
        <p className="info">
          <a href="#" className="author">
            {author?.username}
          </a>
          <time>{formatISO9075(new Date(createdAt))}</time>
        </p>
        <p className="summary">{summary}</p>
      </div>
    </div>
  );
};

export default Post;
