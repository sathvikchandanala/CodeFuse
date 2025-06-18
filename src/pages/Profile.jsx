import { useState, useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../db";
import { doc, getDoc } from "firebase/firestore";
import {
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from "firebase/auth";

import Nav from "./Nav";
import Footer from "./Footer";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";

import {
  FiLock,
  FiUser,
  FiMail,
  FiRefreshCw,
  FiEye,
  FiEyeOff,
  FiLink,
  FiGithub,
} from "react-icons/fi";

import { SiLeetcode, SiCodechef, SiHackerrank, SiCodeforces } from "react-icons/si";

const platformIcons = {
  github: <FiGithub className="text-blue-600 dark:text-blue-400" size={20} />,
  leetcode: <SiLeetcode className="text-blue-600 dark:text-blue-400" size={20} />,
  codechef: <SiCodechef className="text-blue-600 dark:text-blue-400" size={20} />,
  hackerrank: <SiHackerrank className="text-blue-600 dark:text-blue-400" size={20} />,
  codeforces: <SiCodeforces className="text-blue-600 dark:text-blue-400" size={20} />,
  default: <FiLink className="text-blue-600 dark:text-blue-400" size={20} />,
};

export default function Profile() {
  const [user, loading, error] = useAuthState(auth);
  const [platforms, setPlatforms] = useState(null);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  useEffect(() => {
    if (!user) return;

    const fetchPlatforms = async () => {
      try {
        const docRef = doc(db, "users", user.email);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setPlatforms(docSnap.data().platforms || {});
        } else {
          setPlatforms({});
        }
      } catch (err) {
        console.error("Error fetching platforms:", err);
        setPlatforms({});
      }
    };

    fetchPlatforms();
  }, [user]);

  const handleChangePassword = async () => {
    setPasswordError("");
    setPasswordSuccess("");

    if (!oldPassword || !newPassword) {
      setPasswordError("Please fill in both fields.");
      return;
    }
    if (newPassword.length < 6) {
      setPasswordError("New password must be at least 6 characters.");
      return;
    }

    setIsChangingPassword(true);

    try {
      const credential = EmailAuthProvider.credential(user.email, oldPassword);
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, newPassword);
      setPasswordSuccess("Password changed successfully!");
      setOldPassword("");
      setNewPassword("");
    } catch (err) {
      if (err.code === "auth/wrong-password") {
        setPasswordError("Old password is incorrect.");
      } else {
        setPasswordError(err.message || "Failed to change password.");
      }
    } finally {
      setIsChangingPassword(false);
    }
  };

  if (loading)
    return (
      <p className="text-center mt-10 text-gray-700 dark:text-gray-300">
        Loading profile...
      </p>
    );
  if (error)
    return (
      <p className="text-center mt-10 text-red-600">
        {error.message}
      </p>
    );
  if (!user)
    return (
      <p className="text-center mt-10 text-gray-700 dark:text-gray-300">
        Please log in to view your profile.
      </p>
    );

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Nav />
      <main className="max-w-4xl mx-auto p-4 space-y-10 pt-10">
        <Card className="shadow-lg rounded-lg border border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl font-bold">
              <FiUser className="text-blue-600 dark:text-blue-400" /> Your Profile
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-gray-800 dark:text-gray-200 text-lg">
            <div className="flex flex-wrap items-center gap-2 break-words">
              <FiUser className="text-blue-600 dark:text-blue-400" />
              <span className="font-semibold">Name:</span>
              <span className="truncate">{user.displayName || "N/A"}</span>
            </div>
            <div className="flex flex-wrap items-center gap-2 break-words">
              <FiMail className="text-blue-600 dark:text-blue-400" />
              <span className="font-semibold">Email:</span>
              <span className="break-all">{user.email}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg rounded-lg border border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl font-bold">
              <FiLink className="text-blue-600 dark:text-blue-400" /> Connected Platforms
            </CardTitle>
          </CardHeader>
          <CardContent>
            {platforms && Object.keys(platforms).length > 0 ? (
              <ul className="space-y-3">
                {Object.entries(platforms).map(([platform, username]) => {
                  const icon =
                    platformIcons[platform.toLowerCase()] || platformIcons.default;

                  return (
                    <li
                      key={platform}
                      className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 p-3 rounded-md hover:bg-blue-50 dark:hover:bg-blue-900 transition cursor-default"
                      title={username ? `Linked as ${username}` : "Not linked"}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        {icon}
                        <span className="font-semibold capitalize">{platform}:</span>
                      </div>
                      <span className={`min-w-0 break-all ${username ? "text-gray-800 dark:text-gray-200" : "italic text-gray-400"}`}>
                        {username || "Not linked"}
                      </span>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p className="italic text-gray-500 dark:text-gray-400">
                No platforms linked yet.
              </p>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-lg rounded-lg border border-gray-200 dark:border-gray-700 max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl font-bold">
              <FiLock className="text-blue-600 dark:text-blue-400" /> Change Password
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
              <label htmlFor="old-password" className="w-40 text-gray-700 dark:text-gray-300 font-semibold">
                Current Password
              </label>
              <div className="relative w-full max-w-xs">
                <input
                  id="old-password"
                  type={showOldPassword ? "text" : "password"}
                  placeholder="Enter current password"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 px-3 py-2 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={() => setShowOldPassword((v) => !v)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-blue-600 dark:hover:text-blue-400"
                  aria-label={showOldPassword ? "Hide password" : "Show password"}
                >
                  {showOldPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                </button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
              <label htmlFor="new-password" className="w-40 text-gray-700 dark:text-gray-300 font-semibold">
                New Password
              </label>
              <div className="relative w-full max-w-xs">
                <input
                  id="new-password"
                  type={showNewPassword ? "text" : "password"}
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 px-3 py-2 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword((v) => !v)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-blue-600 dark:hover:text-blue-400"
                  aria-label={showNewPassword ? "Hide password" : "Show password"}
                >
                  {showNewPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                </button>
              </div>
            </div>

            {passwordError && (
              <p className="text-red-600 font-semibold text-center">{passwordError}</p>
            )}
            {passwordSuccess && (
              <p className="text-green-600 font-semibold text-center">{passwordSuccess}</p>
            )}
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button
              disabled={isChangingPassword}
              onClick={handleChangePassword}
              className="w-40 flex items-center justify-center gap-2"
            >
              {isChangingPassword && (
                <FiRefreshCw className="animate-spin" size={20} />
              )}
              {isChangingPassword ? "Updating..." : "Change Password"}
            </Button>
          </CardFooter>
        </Card>
      </main>
      <Footer/>
    </div>
  );
}
