import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import Landing from "./pages/Landing"
import PrivateRoute from "./PrivateRoute";
import Homepage from "./pages/Sample";
import NotFound from "./pages/Notfound";
import Profile from "./pages/Profile";
import ContestsPage from "./pages/ContestPage";
import HackathonsPage from "./pages/Hackathon";
import LeetCode from "./pages/LeetCode";
import Codeforces from "./pages/codeforces";
import Tasks from "./pages/Tasks";
import { AliveScope } from 'react-activation';
import { KeepAlive } from 'react-activation';
import TrackFriends from "./pages/TrackFriends";

export default function App() {
  return (
    <Router>
    <AliveScope>
      <Routes>
        <Route path="/" element={<Landing/>}/>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/home" element={<PrivateRoute><KeepAlive id="home"><Homepage/></KeepAlive></PrivateRoute>}/>
        <Route path="/link"element={<PrivateRoute><Home /></PrivateRoute>}/>
        <Route path="/track" element={<PrivateRoute><TrackFriends/></PrivateRoute>}/>
        <Route
          path="/tasks"
          element={
            <PrivateRoute>
              <Tasks />
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
    <KeepAlive id="contest">
      <PrivateRoute>
        <ContestsPage />
      </PrivateRoute>
    </KeepAlive>
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
            <KeepAlive id="hackathons">
            <PrivateRoute>
              <HackathonsPage />
            </PrivateRoute>
            </KeepAlive>
          }
        />
        <Route path="*" element={<NotFound/>} />
      </Routes>
      </AliveScope>
    </Router>
  );
}
