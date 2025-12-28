import { Link, useNavigate } from "react-router-dom";

const Navbar = ({ isAuth, setIsAuth }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await fetch("http://localhost:5001/api/users/logout", {
      method: "POST",
      credentials: "include",
    });

    setIsAuth(false);
    navigate("/login");
  };

  return (
    <nav style={styles.nav}>
      <h2 style={styles.logo} onClick={() => navigate("/")}>
        MyBlog
      </h2>

      <div style={styles.links}>
        <Link to="/" style={styles.link}>Home</Link>

        {/* Always visible – protected by route */}
        <Link to="/add-blog" style={styles.link}>Add Blog</Link>

        {isAuth && (
          <Link to="/dashboard" style={styles.link}>
            Dashboard
          </Link>
        )}

        <Link to="/about" style={styles.link}>About</Link>
        <Link to="/contact" style={styles.link}>Contact</Link>

        {!isAuth ? (
          <>
            <Link to="/login" style={styles.link}>Login</Link>
            <Link to="/signup" style={styles.link}>Signup</Link>
          </>
        ) : (
          <button onClick={handleLogout} style={styles.logout}>
            Logout
          </button>
        )}
      </div>
    </nav>
  );
};

const styles = {
  nav: {
    display: "flex",
    justifyContent: "space-between",
    padding: "15px 30px",
    background: "linear-gradient(to right,#ec4899,#a855f7)",
    color: "white",
  },
  logo: { margin: 0, cursor: "pointer" },
  links: { display: "flex", gap: "18px", alignItems: "center" },
  link: { color: "white", textDecoration: "none" },
  logout: {
    background: "#dc2626",
    border: "none",
    padding: "6px 14px",
    borderRadius: "6px",
    color: "white",
    cursor: "pointer",
  },
};

export default Navbar;
