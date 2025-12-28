/*import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const BlogDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [blog, setBlog] = useState(null);
  const [commentText, setCommentText] = useState("");

  useEffect(() => {
    fetch(`http://localhost:5001/api/blog/getblog/${id}`)
      .then((res) => res.json())
      .then((data) => setBlog(data));
  }, [id]);

  if (!blog) return <p>Loading...</p>;

  
  const handleLike = async () => {
    try {
      const res = await fetch(
        `http://localhost:5001/api/blog/like/${id}`,
        {
          method: "POST",
          credentials: "include",
        }
      );

      if (res.status === 401) {
        navigate("/login");
        return;
      }

      const data = await res.json();

      if (!res.ok) {
        alert(data.message);
        return;
      }

      setBlog({
        ...blog,
        likes: data.likes,
      });
    } catch {
      alert("Error liking blog");
    }
  };

  
  const handleComment = async () => {
    if (!commentText.trim()) return;

    try {
      const res = await fetch(`http://localhost:5001/api/blog/comment/${id}`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ commentText }),
        });

      if (res.status === 401) {
        navigate("/login");
        return;
      }

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Failed to add comment");
        return;
      }

      setBlog({
        ...blog,
        comments: data.comments,
      });
    alert("Comment added");

      setCommentText("");
    } catch {
      alert("Error adding comment");
    }
  };

  return (
    <div style={styles.container}>
      {blog.image && (
        <img
          src={blog.image}
          alt="blog"
          style={styles.image}
        />
      )}

      <h1>{blog.title}</h1>
      <p style={styles.author}>By {blog.authorId?.name}</p>
      <p style={styles.desc}>{blog.description}</p>

      
      <div style={styles.actions}>
        <button onClick={handleLike}>
          👍 Like ({blog.likes.length})
        </button>
        <button>💾 Save</button>
      </div>

    
      <div style={styles.commentBox}>
        <h3>Comments</h3>

        <textarea
          placeholder="Write a comment..."
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          style={{ width: "100%", marginTop: "20px", padding: "10px" }}
        />

        <button onClick={handleComment} style={{ marginTop: "10px" }}> 💬 Comment </button>

        {blog.comments?.length === 0 && (
          <p>No comments yet</p>
        )}

        {blog.comments?.map((c, index) => (
          <div key={index} style={styles.comment}>
            <p>{c.text}</p>
            <small>
              {new Date(c.createdAt).toLocaleString()}
            </small>
          </div>
        ))}
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "800px",
    margin: "40px auto",
    padding: "20px",
  },
  image: {
    width: "100%",
    borderRadius: "10px",
    marginBottom: "20px",
  },
  author: {
    color: "gray",
  },
  desc: {
    fontSize: "18px",
    lineHeight: "1.7",
    marginTop: "20px",
  },
  actions: {
    display: "flex",
    gap: "15px",
    marginTop: "30px",
  },
  commentBox: {
    marginTop: "40px",
  },
  textarea: {
    width: "100%",
    minHeight: "80px",
    padding: "10px",
    marginBottom: "10px",
  },
  comment: {
    background: "#f3f4f6",
    padding: "10px",
    borderRadius: "6px",
    marginTop: "10px",
  },
};

export default BlogDetails;*/

import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const BlogDetails = ({ isAuth }) => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [blog, setBlog] = useState(null);
  const [commentText, setCommentText] = useState("");
  const [saved, setSaved] = useState(false);

  /* ---------- FETCH BLOG ---------- */
  useEffect(() => {
    fetch(`http://localhost:5001/api/blog/getblog/${id}`)
      .then((res) => res.json())
      .then((data) => setBlog(data))
      .catch((err) => console.error(err));
  }, [id]);

  useEffect(() => {
  const checkSaved = async () => {
    try {
      const res = await fetch("http://localhost:5001/api/users/me", {
        credentials: "include",
      });

      if (!res.ok) return; // not logged in

      const data = await res.json();

      if (data?.user?.savedBlogs?.includes(id)) {
        setSaved(true);
      }
    } catch {
      // silently ignore
    }
  };

  checkSaved();
}, [id]);


  /* ---------- CHECK SAVED ---------- */
  useEffect(() => {
    if (!isAuth || !blog) return;

    fetch("http://localhost:5001/api/users/saved", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((savedBlogs) => {
        const exists = savedBlogs.some((b) => b._id === blog._id);
        setSaved(exists);
      });
  }, [blog, isAuth]);

  if (!blog) return <p>Loading...</p>;

  /* ---------- LIKE ---------- */
  const handleLike = async () => {
    const res = await fetch(
      `http://localhost:5001/api/blog/like/${id}`,
      { method: "POST", credentials: "include" }
    );

    if (res.status === 401) {
      navigate("/login");
      return;
    }

    setBlog({ ...blog, likes: [...blog.likes, "temp"] });
  };

  /* ---------- COMMENT ---------- */
  const handleComment = async () => {
    if (!commentText.trim()) return;

    const res = await fetch(
      `http://localhost:5001/api/blog/comment/${id}`,
      {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ commentText }),
      }
    );

    if (res.status === 401) {
      navigate("/login");
      return;
    }

    const data = await res.json();
    if (!res.ok) {
      alert(data.message);
      return;
    }

    setBlog({
      ...blog,
      comments: [
        ...blog.comments,
        { text: commentText, createdAt: new Date() },
      ],
    });

    setCommentText("");
  };

  /* ---------- SAVE ---------- */
  const handleSave = async () => {
  try {
    const res = await fetch(
      `http://localhost:5001/api/users/save/${blog._id}`,
      {
        method: "POST",
        credentials: "include",
      }
    );

    if (res.status === 401) {
      navigate("/login");
      return;
    }

    const data = await res.json();
    setSaved(data.saved);
  } catch (err) {
    console.error(err);
    alert("Error saving blog");
  }
};


  return (
    <div style={styles.container}>
      {blog.image && <img src={blog.image} alt="blog" style={styles.image} />}

      <h1>{blog.title}</h1>
      <p style={styles.author}>By {blog.authorId?.name}</p>
      <p style={styles.desc}>{blog.description}</p>

      <div style={styles.actions}>
        <button onClick={handleLike}>
          👍 Like ({blog.likes.length})
        </button>

        <button onClick={handleSave}>
          💾 {saved ? "Saved" : "Save"}
        </button>
      </div>

      <div style={styles.commentBox}>
        <h3>Comments</h3>

        <textarea
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          style={styles.textarea}
          placeholder="Write a comment..."
        />

        <button onClick={handleComment} style={styles.commentBtn}>
          💬 Comment
        </button>

        {blog.comments.map((c, i) => (
          <div key={i} style={styles.comment}>
            <p>{c.text}</p>
            <small>
              {new Date(c.createdAt).toLocaleString()}
            </small>
          </div>
        ))}
      </div>
    </div>
  );
};

const styles = {
  container: { maxWidth: "800px", margin: "40px auto", padding: "20px" },
  image: { width: "100%", borderRadius: "10px", marginBottom: "20px" },
  author: { color: "gray" },
  desc: { fontSize: "18px", lineHeight: "1.7" },
  actions: { display: "flex", gap: "15px", marginTop: "30px" },
  commentBox: { marginTop: "40px" },
  textarea: { width: "100%", minHeight: "80px", marginBottom: "10px" },
  commentBtn: { padding: "8px 12px" },
  comment: { background: "#f3f4f6", padding: "10px", marginTop: "10px" },
};

export default BlogDetails;