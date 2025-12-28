import React, { useState,useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./component/Navbar";
import Home from "./component/Home";
import Login from "./component/Login";
import About from "./component/About";
import Contact from "./component/Contact";
import AddBlog from "./component/AddBlog";
import Signup from "./component/Signup";
import ProtectedRoute from "./component/ProtectedRoute";
import BlogDetails from "./component/BlogDetails";
import Dashboard from "./component/Dashboard";

function App() {
  const [isAuth, setIsAuth] = useState(false);
  // const login = ()=>{
  //   setIsAuth(true);
  // }
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  const checkAuth = async () => {
    try {
      const res = await fetch("http://localhost:5001/api/users/me", {
        credentials: "include",
      });

      setIsAuth(res.ok);
    } catch {
      setIsAuth(false);
    } finally {
      setLoading(false); // ✅ THIS WAS MISSING
    }
  };

  checkAuth();
}, []);


  if (loading) return <p>Loading...</p>;

  return (
    <BrowserRouter>
      <Navbar isAuth={isAuth} setIsAuth={setIsAuth} />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login setIsAuth={setIsAuth} />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected Add Blog page */}
        <Route
          path="/add-blog"
          element={
            <ProtectedRoute value ={isAuth}>
              <AddBlog />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute value={isAuth}>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route path="/blog/:id" element={<BlogDetails isAuth={isAuth} />} />        
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;