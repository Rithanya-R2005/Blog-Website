import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:5001/api/blog/getblog", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => res.json())
      .then((data) => {
        setBlogs(data.blogs || data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div style={styles.page}>
      {/* HERO */}
      <section style={styles.hero}>
        <h1 style={styles.heroTitle}>MyBlog</h1>
        <p style={styles.heroSub}>
          Share your thoughts • Read ideas • Grow together
        </p>
      </section>

      {/* BLOG LIST */}
      <section style={styles.container}>
        {loading ? (
          <p style={styles.loading}>Loading blogs...</p>
        ) : blogs.length === 0 ? (
          <p style={styles.noBlogs}>No blogs available yet.</p>
        ) : (
          blogs.map((blog) => (
            <div
              key={blog._id}
              style={styles.card}
              onClick={() => navigate(`/blog/${blog._id}`)}
            >
              {blog.image && (
                <img
                  src={blog.image}
                  alt="blog"
                  style={styles.image}
                />
              )}

              <h3 style={styles.title}>{blog.title}</h3>

              <p style={styles.preview}>
                {blog.description.length > 120
                  ? blog.description.slice(0, 120) + "..."
                  : blog.description}
              </p>

              <div style={styles.meta}>
                <span>🗓 {new Date(blog.createdAt).toDateString()}</span>
              </div>
            </div>
          ))
        )}
      </section>
    </div>
  );
};

/* ================= STYLES ================= */

const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(to bottom,#fdf2f8,#f5f3ff)",
    fontFamily: "Segoe UI, sans-serif",
  },

  hero: {
    textAlign: "center",
    padding: "70px 20px",
    background: "linear-gradient(135deg,#ec4899,#a855f7)",
    color: "white",
    borderBottomLeftRadius: "40px",
    borderBottomRightRadius: "40px",
  },

  heroTitle: {
    fontSize: "42px",
    marginBottom: "10px",
  },

  heroSub: {
    fontSize: "18px",
    opacity: 0.95,
  },

  container: {
    padding: "40px",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit,minmax(320px,1fr))",
    gap: "25px",
  },

  loading: {
    textAlign: "center",
    fontSize: "18px",
    color: "#6b7280",
  },

  noBlogs: {
    textAlign: "center",
    fontSize: "18px",
    color: "#6b7280",
  },

  card: {
    background: "white",
    borderRadius: "18px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
    overflow: "hidden",
    cursor: "pointer",
    transition: "transform 0.2s",
  },

  image: {
    width: "100%",
    height: "180px",
    objectFit: "cover",
  },

  title: {
    padding: "15px 20px 5px",
    fontSize: "20px",
    color: "#7c3aed",
  },

  preview: {
    padding: "0 20px",
    fontSize: "15px",
    color: "#374151",
    lineHeight: 1.6,
  },

  meta: {
    padding: "15px 20px 20px",
    fontSize: "13px",
    color: "#6b7280",
  },
};

export default Home;