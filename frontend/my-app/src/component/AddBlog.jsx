import { useState } from "react";
import { useNavigate } from "react-router-dom";

const AddBlog = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("http://localhost:5001/api/blog/addblog", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          description,
          image, // ✅ added
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Failed to add blog");
        return;
      }

      alert("Blog added successfully 🎉");
      navigate("/");
    } catch (err) {
      setError("Something went wrong");
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <h2 style={styles.heading}>Add New Blog</h2>

        {error && <p style={styles.error}>{error}</p>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="text"
            placeholder="Blog Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            style={styles.input}
          />

          <input
            type="text"
            placeholder="Image URL (optional)"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            style={styles.input}
          />

          <textarea
            placeholder="Blog Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            rows="6"
            style={styles.textarea}
          />

          <button type="submit" style={styles.button}>
            Publish Blog
          </button>
        </form>
      </div>
    </div>
  );
};

/* ================= STYLES ================= */

const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(to bottom,#fdf2f8,#f5f3ff)",
    padding: "40px 15px",
  },

  container: {
    maxWidth: "600px",
    margin: "0 auto",
    padding: "30px",
    borderRadius: "16px",
    background: "white",
    boxShadow: "0 15px 30px rgba(0,0,0,0.08)",
  },

  heading: {
    textAlign: "center",
    marginBottom: "25px",
    color: "#7c3aed",
  },

  form: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },

  input: {
    padding: "12px",
    fontSize: "16px",
    borderRadius: "8px",
    border: "1px solid #ddd",
  },

  textarea: {
    padding: "12px",
    fontSize: "16px",
    borderRadius: "8px",
    border: "1px solid #ddd",
  },

  button: {
    background: "linear-gradient(to right,#ec4899,#a855f7)",
    color: "white",
    padding: "12px",
    border: "none",
    cursor: "pointer",
    borderRadius: "10px",
    fontSize: "16px",
    marginTop: "10px",
  },

  error: {
    color: "red",
    textAlign: "center",
    marginBottom: "10px",
  },
};

export default AddBlog;