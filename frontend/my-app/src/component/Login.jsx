import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = ({ setIsAuth }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async () => {
    setError("");

    const res = await fetch("http://localhost:5001/api/users/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include",
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.message || "Login failed");
      return;
    }

    // ✅ Cookie is now stored by browser
    setIsAuth(true);
    navigate("/"); // redirect to Home
  };

  return (
    <div style={styles.container}>
      <form style={styles.card}>
        <h2>Login</h2>

        {error && <p style={styles.error}>{error}</p>}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={styles.input}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={styles.input}
        />

        <button onClick={(e)=>{e.preventDefault();setIsAuth();handleSubmit()}}style={styles.btn}>Login</button>
      </form>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "80vh"
  },
  card: {
    width: "350px",
    padding: "30px",
    borderRadius: "12px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.1)"
  },
  input: {
    width: "100%",
    padding: "10px",
    marginBottom: "15px"
  },
  btn: {
    width: "100%",
    padding: "10px",
    background: "#a855f7",
    color: "white",
    border: "none",
    borderRadius: "6px"
  },
  error: {
    color: "red"
  }
};

export default Login;
