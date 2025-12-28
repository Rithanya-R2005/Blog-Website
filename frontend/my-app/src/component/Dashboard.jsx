import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();

  const [data, setData] = useState({
    user: null,
    stats: {
      postsCount: 0,
      likesCount: 0,
      savedCount: 0,
    },
    savedBlogs: [],
    myBlogs: [],
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await fetch(
          "http://localhost:5001/api/users/dashboard",
          { credentials: "include" }
        );

        const result = await res.json();

        setData({
          user: result.user || null,
          stats: result.stats || {
            postsCount: 0,
            likesCount: 0,
            savedCount: 0,
          },
          savedBlogs: result.savedBlogs || [],
          myBlogs: result.myBlogs || [],
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  /* ---------- DELETE BLOG ---------- */
  const handleDelete = async (blogId) => {
    if (!window.confirm("Are you sure you want to delete this blog?")) return;

    try {
      const res = await fetch(
        `http://localhost:5001/api/blog/delete/${blogId}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      const result = await res.json();

      if (!res.ok) {
        alert(result.message || "Delete failed");
        return;
      }

      alert("Blog deleted successfully");

      setData((prev) => ({
        ...prev,
        myBlogs: prev.myBlogs.filter((b) => b._id !== blogId),
      }));
    } catch (err) {
      console.error(err);
      alert("Error deleting blog");
    }
  };

  if (loading) return <p>Loading dashboard...</p>;
  if (!data.user) return <p>No dashboard data</p>;

  const { user, stats, savedBlogs, myBlogs } = data;

  return (
    <div style={styles.container}>
      <h1>Welcome, {user.name}</h1>

      <div style={styles.stats}>
        <div style={styles.card}>
          <h3>{stats.postsCount}</h3>
          <p>Blogs Posted</p>
        </div>

        <div style={styles.card}>
          <h3>{stats.likesCount}</h3>
          <p>Blogs Liked</p>
        </div>

        <div style={styles.card}>
          <h3>{stats.savedCount}</h3>
          <p>Saved Blogs</p>
        </div>
      </div>

      {/* ---------- SAVED POSTS ---------- */}
      <h2 style={{ marginTop: "40px" }}>Saved Posts</h2>

      {savedBlogs.length === 0 ? (
        <p>No saved blogs yet</p>
      ) : (
        <div style={styles.blogGrid}>
          {savedBlogs.map((blog) => (
            <div
              key={blog._id}
              style={styles.blogCard}
              onClick={() => navigate(`/blog/${blog._id}`)}
            >
              {blog.image && (
                <img
                  src={blog.image}
                  alt={blog.title}
                  style={styles.image}
                />
              )}
              <h4>{blog.title}</h4>
              <small>
                {new Date(blog.createdAt).toLocaleDateString()}
              </small>
            </div>
          ))}
        </div>
      )}

      {/* ---------- MY POSTS ---------- */}
      <h2 style={{ marginTop: "40px" }}>My Posts</h2>

      {myBlogs.length === 0 ? (
        <p>You haven't posted any blogs yet</p>
      ) : (
        <div style={styles.blogGrid}>
          {myBlogs.map((blog) => (
            <div key={blog._id} style={styles.blogCard}>
              <h4>{blog.title}</h4>
              <small>
                {new Date(blog.createdAt).toLocaleDateString()}
              </small>

              <button
                onClick={() => handleDelete(blog._id)}
                style={styles.deleteBtn}
              >
                🗑 Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

/* ---------- STYLES ---------- */
const styles = {
  container: { maxWidth: "1100px", margin: "40px auto", padding: "20px" },
  stats: { display: "flex", gap: "20px", marginTop: "20px" },
  card: {
    flex: 1,
    background: "#f3f4f6",
    padding: "20px",
    borderRadius: "10px",
    textAlign: "center",
  },
  blogGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
    gap: "20px",
    marginTop: "20px",
  },
  blogCard: {
    background: "#fff",
    borderRadius: "10px",
    padding: "15px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
  },
  image: {
    width: "100%",
    height: "150px",
    objectFit: "cover",
    borderRadius: "8px",
    marginBottom: "10px",
  },
  deleteBtn: {
    marginTop: "10px",
    padding: "6px 10px",
    background: "#dc2626",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
};

export default Dashboard;
