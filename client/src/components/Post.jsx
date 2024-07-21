const Post = () => {
  return (
    <div className="post">
      <div className="image">
        <img
          src="https://i.pinimg.com/564x/b9/4c/07/b94c07c86752505af6675a25f07f5a75.jpg"
          alt=""
        />
      </div>

      <div className="texts">
        <h2>Random adorable image</h2>
        <p className="info">
          <a href="" className="author">ojasvi</a>
          <time>2024-07-21 12:41</time>
        </p>
        <p className="summary">
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Velit,
          excepturi optio! Officiis beatae unde odit atque nobis dolore quas
          vitae eveniet omnis error, non excepturi repellendus fugit esse hic
          sint!
        </p>
      </div>
    </div>
  );
};

export default Post;
