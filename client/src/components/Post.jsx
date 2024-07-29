import { formatISO9075 } from "date-fns";
import { Link } from "react-router-dom";

const Post = ({ _id, title, summary, cover, content, createdAt, author }) => {
  // const image = "http://localhost:3000/api/v1/" + cover;
  return (
    <div className="post">
      <div className="image">
        <img
          src={
            "https://i.pinimg.com/564x/b9/4c/07/b94c07c86752505af6675a25f07f5a75.jpg"
          }
          alt=""
        />
      </div>

      <div className="texts">
        <h2>{title}</h2>
        <p className="info">
          <a href="" className="author">
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
