// src/components/Nav.jsx
import React from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { HiSun, HiMoon } from "react-icons/hi";
import { FaHome, FaLink, FaUser, FaTasks } from "react-icons/fa";
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

  const logout = async () => {
    try {
      await signOut(auth);
      navigate("/");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  if (loading) return null;
  if (!user) return null;

  const isActive = (path) => location.pathname === path;

  return (
    <header className="fixed top-0 left-0 w-full h-16 mb-4 z-50 bg-white dark:bg-[#121212] border-b border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row justify-between items-center px-4 sm:px-6 shadow-sm">
      <div className="flex items-center gap-4 w-full sm:w-auto">
        <h1 className="text-xl sm:text-2xl font-extrabold cursor-default select-none whitespace-nowrap">
          Code
          <span className="text-transparent bg-gradient-to-r from-blue-500 to-indigo-600 bg-clip-text">
            Fuse
          </span>
        </h1>

        <nav className="hidden sm:flex gap-2 ml-4">
          <Button
            variant={isActive("/home") ? "default" : "outline"}
            onClick={() => navigate("/home")}
            className="flex items-center gap-1 text-xs sm:text-sm mb-1 px-2 py-1"
          >
            <FaHome className="w-4 h-4" />
            Home
          </Button>
          <Button
            variant={isActive("/link") ? "default" : "outline"}
            onClick={() => navigate("/link")}
            className="flex items-center gap-1 text-xs sm:text-sm mb-1 px-2 py-1"
          >
            <FaLink className="w-4 h-4" />
            Link Accounts
          </Button>
          <Button
            variant={isActive("/tasks") ? "default" : "outline"}
            onClick={() => navigate("/tasks")}
            className="flex items-center gap-1 text-xs sm:text-sm mb-1 px-2 py-1"
          >
            <FaTasks className="w-4 h-4" />
            Task Schedules
          </Button>
          <Button
            variant={isActive("/profile") ? "default" : "outline"}
            onClick={() => navigate("/profile")}
            className="flex items-center gap-1 text-xs sm:text-sm mb-1 px-2 py-1"
          >
            <FaUser className="w-4 h-4" />
            Profile
          </Button>
        </nav>
      </div>

      <div className="flex items-center gap-3 mt-2 sm:mt-0">
        <Button
          onClick={logout}
          className="text-xs sm:text-sm mb-1 px-2 py-1"
          variant="ghost"
        >
          Log out
        </Button>

        {theme === "dark" ? (
          <HiMoon className="text-yellow-400 w-5 h-5" />
        ) : (
          <HiSun className="text-yellow-500 w-5 h-5" />
        )}

        <Switch
          checked={theme === "dark"}
          onCheckedChange={() => setTheme(theme === "dark" ? "light" : "dark")}
          aria-label="Toggle Dark Mode"
        />
      </div>

      <MobileNav isActive={isActive} navigate={navigate} logout={logout} />
    </header>
  );
}

function MobileNav({ isActive, navigate, logout }) {
  const [open, setOpen] = React.useState(false);

  return (
    <div className="sm:hidden relative">
      <button
        onClick={() => setOpen((prev) => !prev)}
        aria-label="Toggle menu"
        className="p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <svg
          className="w-6 h-6 text-gray-700 dark:text-gray-300"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          {open ? (
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {open && (
        <nav className="absolute top-14 right-0 bg-white dark:bg-[#121212] border border-gray-300 dark:border-gray-700 rounded-md shadow-md w-44 flex flex-col gap-2 p-3 z-50">
          <Button
            variant={isActive("/home") ? "default" : "outline"}
            onClick={() => {
              navigate("/home");
              setOpen(false);
            }}
            className="flex items-center gap-2 text-sm"
          >
            <FaHome /> Home
          </Button>
          <Button
            variant={isActive("/link") ? "default" : "outline"}
            onClick={() => {
              navigate("/link");
              setOpen(false);
            }}
            className="flex items-center gap-2 text-sm"
          >
            <FaLink /> Link Accounts
          </Button>
          <Button
            variant={isActive("/tasks") ? "default" : "outline"}
            onClick={() => {
              navigate("/tasks");
              setOpen(false);
            }}
            className="flex items-center gap-2 text-sm"
          >
            <FaTasks /> Task Schedules
          </Button>
          <Button
            variant={isActive("/profile") ? "default" : "outline"}
            onClick={() => {
              navigate("/profile");
              setOpen(false);
            }}
            className="flex items-center gap-2 text-sm"
          >
            <FaUser /> Profile
          </Button>
          <Button
            onClick={() => {
              logout();
              setOpen(false);
            }}
            className="text-sm mt-2"
            variant="ghost"
          >
            Log out
          </Button>
        </nav>
      )}
    </div>
  );
}
