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
import ContestsPage from "./pages/ContestPage";
import HackathonsPage from "./pages/Hackathon";
import LeetCode from "./pages/LeetCode";
import Codeforces from "./pages/codeforces";

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
        /> 
          <Route
          path="/leetcode"
          element={
            <PrivateRoute>
              <LeetCode />
            </PrivateRoute>
          }
        /> 
        <Route
          path="/codeforces"
          element={
            <PrivateRoute>
              <Codeforces />
            </PrivateRoute>
          }
        /> 
        <Route
          path="/contests"
          element={
            <PrivateRoute>
              <ContestsPage />
            </PrivateRoute>
          }
        /><Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />
        <Route
          path="/hackathons"
          element={
            <PrivateRoute>
              <HackathonsPage />
            </PrivateRoute>
          }
        />
        <Route path="*" element={<NotFound/>} />
      </Routes>
    </Router>
  );
}
