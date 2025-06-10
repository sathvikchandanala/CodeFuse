import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import Landing from "./pages/Landing"
import PrivateRoute from "./PrivateRoute";
import { Navigate } from "react-router-dom";
import Homepage from "./pages/Sample";
import NotFound from "./pages/Notfound";
import Profile from "./pages/Profile";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing/>}/>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/home" element={<PrivateRoute>
        <Homepage/></PrivateRoute>}/>
        <Route
          path="/link"
          element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          }
        /> <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />
        <Route path="*" element={<NotFound/>} />
      </Routes>
    </Router>
  );
}
