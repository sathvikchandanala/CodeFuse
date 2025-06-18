import React from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { HiSun, HiMoon } from "react-icons/hi";
import {
  FaHome,
  FaLink,
  FaUser,
  FaTasks,
  FaBars,
  FaTimes,
  FaTrophy,
  FaCode,
} from "react-icons/fa";
import { FaUserFriends } from "react-icons/fa";
import { useTheme } from "next-themes";
import { useNavigate, useLocation } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../db";
import { useAuthState } from "react-firebase-hooks/auth";

export default function Nav() {
  const { theme, setTheme } = useTheme();
  const [user, loading] = useAuthState(auth);
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = React.useState(false);

  const logout = async () => {
    try {
      await signOut(auth);
      navigate("/", { state: { logoutSuccess: true } });
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  if (loading || !user) return null;

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <header className="fixed top-0 left-0 w-full z-50 bg-white dark:bg-[#121212] border-b border-gray-200 dark:border-gray-700 shadow-sm px-4 sm:px-6 h-16 flex items-center justify-between">
        <h1 className="text-xl sm:text-2xl font-extrabold cursor-default select-none">
          Code
          <span className="text-transparent bg-gradient-to-r from-blue-500 to-indigo-600 bg-clip-text">
            Fuse
          </span>
        </h1>

        <nav className="hidden sm:flex gap-2">
          <NavButton icon={<FaHome />} label="Home" path="/home" isActive={isActive} navigate={navigate} />
          <NavButton icon={<FaLink />} label="Link Accounts" path="/link" isActive={isActive} navigate={navigate} />
          <NavButton icon={<FaTasks />} label="Task Schedules" path="/tasks" isActive={isActive} navigate={navigate} />
          <NavButton icon={<FaTrophy />} label="Contests" path="/contests" isActive={isActive} navigate={navigate} />
          <NavButton icon={<FaCode />} label="Hackathons" path="/hackathons" isActive={isActive} navigate={navigate} />
          <NavButton icon={<FaUserFriends />} label="Track" path="/track" isActive={isActive} navigate={navigate} />
          <NavButton icon={<FaUser />} label="Profile" path="/profile" isActive={isActive} navigate={navigate} />
        </nav>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2">
            <Button onClick={logout} variant="ghost" className="text-xs sm:text-sm px-2 py-1">
              Logout
            </Button>
            {theme === "dark" ? <HiMoon className="text-yellow-400 w-5 h-5" /> : <HiSun className="text-yellow-500 w-5 h-5" />}
            <Switch
              checked={theme === "dark"}
              onCheckedChange={() => setTheme(theme === "dark" ? "light" : "dark")}
              aria-label="Toggle Dark Mode"
            />
          </div>

          <button onClick={() => setMenuOpen(!menuOpen)} className="sm:hidden p-2">
            {menuOpen ? <FaTimes className="w-6 h-6" /> : <FaBars className="w-6 h-6" />}
          </button>
        </div>
      </header>

      {menuOpen && (
        <div className="sm:hidden fixed top-16 left-0 w-full bg-white dark:bg-[#121212] border-t border-gray-200 dark:border-gray-700 shadow-md z-40 flex flex-col gap-2 p-4">
          <NavButton icon={<FaHome />} label="Home" path="/home" isActive={isActive} navigate={navigate} onClick={() => setMenuOpen(false)} />
          <NavButton icon={<FaLink />} label="Link Accounts" path="/link" isActive={isActive} navigate={navigate} onClick={() => setMenuOpen(false)} />
          <NavButton icon={<FaTasks />} label="Task Schedules" path="/tasks" isActive={isActive} navigate={navigate} onClick={() => setMenuOpen(false)} />
          <NavButton icon={<FaTrophy />} label="Contests" path="/contests" isActive={isActive} navigate={navigate} onClick={() => setMenuOpen(false)} />
          <NavButton icon={<FaCode />} label="Hackathons" path="/hackathons" isActive={isActive} navigate={navigate} onClick={() => setMenuOpen(false)} />
          <NavButton icon={<FaUserFriends />} label="Track" path="/track" isActive={isActive} navigate={navigate} onClick={() => setMenuOpen(false)} />
          <NavButton icon={<FaUser />} label="Profile" path="/profile" isActive={isActive} navigate={navigate} onClick={() => setMenuOpen(false)} />
          <Button onClick={() => { logout(); setMenuOpen(false); }} variant="ghost" className="text-sm mt-2">
            Log out
          </Button>
          <div className="flex items-center justify-between px-2 mt-2">
            <span className="text-sm text-gray-500 dark:text-gray-400">Dark Mode</span>
            <Switch
              checked={theme === "dark"}
              onCheckedChange={() => setTheme(theme === "dark" ? "light" : "dark")}
              aria-label="Toggle Dark Mode"
            />
          </div>
        </div>
      )}

      <div className="h-16 sm:h-20" />
    </>
  );
}

function NavButton({ icon, label, path, isActive, navigate, onClick }) {
  return (
    <Button
      variant={isActive(path) ? "default" : "none"}
      onClick={() => {
        navigate(path);
        if (onClick) onClick();
      }}
      className="flex items-center gap-1 text-xs sm:text-sm px-2 py-1"
    >
      {icon} {label}
    </Button>
  );
}
