import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AiOutlineArrowLeft, AiOutlineUser, AiOutlineLock } from "react-icons/ai";
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  linkWithCredential,
  sendPasswordResetEmail,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import Alert from "./Alert";
import { auth, db } from "../db";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Label } from "../components/ui/label";
import { FcGoogle } from "react-icons/fc";
import { Switch } from "../components/ui/switch";
import { motion } from "framer-motion";
import { HiSun, HiMoon } from "react-icons/hi";

export default function Login() {
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "light");

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [pendingGoogleCredential, setPendingGoogleCredential] = useState(null);
  const [linkingEmail, setLinkingEmail] = useState("");
  const [linkPassword, setLinkPassword] = useState("");
  const [showLinkingPasswordForm, setShowLinkingPasswordForm] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotMessage, setForgotMessage] = useState("");

  const navigate = useNavigate();

  async function checkAndCreateUserData(user) {
    const userRef = doc(db, "users", user.uid);
    const docSnap = await getDoc(userRef);
    if (!docSnap.exists()) {
      await setDoc(userRef, {
        email: user.email,
        createdAt: new Date().toISOString(),
      });
    }
  }

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
    if (!email || !password) {
      setError("Both email and password are required.");
      return;
    }
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      if (!user.emailVerified) {
        setError("Please verify your email before logging in.");
        await auth.signOut();
        return;
      }
      await checkAndCreateUserData(user);
      const idToken = await user.getIdToken();
      const res = await fetch(`${import.meta.env.VITE_BACK_END_URL}/login`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Login failed");
         setTimeout(() => setError(null), 2000);
    return;
      } else {
        setSuccessMessage("Login successful!");
        sessionStorage.setItem("justLoggedIn", "true");
        setTimeout(() => {
          setSuccessMessage("");
          navigate("/home", { state: { showWelcome: true } });
        }, 1500);
      }
    } catch (err) {
      setError("Login failed");
      setTimeout(() => setError(null), 2000);
    }
  };

  const handleGoogleLogin = async () => {
    setError("");
    setSuccessMessage("");
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      if (!user.emailVerified) {
        setError("Please verify your email before logging in.");
        await auth.signOut();
        return;
      }
      await checkAndCreateUserData(user);
      const idToken = await user.getIdToken();
      const res = await fetch(`${import.meta.env.VITE_BACK_END_URL}/login`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Google login failed");
      } else {
        setSuccessMessage("Login successful!");
        sessionStorage.setItem("justLoggedIn", "true");
        setTimeout(() => {
          setSuccessMessage("");
          navigate("/home", { state: { showWelcome: true } });
        }, 1500);
      }
    } catch (error) {
      if (error.code === "auth/account-exists-with-different-credential") {
        const email = error.customData.email;
        const pendingCred = GoogleAuthProvider.credentialFromError(error);
        setLinkingEmail(email);
        setPendingGoogleCredential(pendingCred);
        setShowLinkingPasswordForm(true);
        setError(`An account already exists with email ${email}. Please enter your password to link Google login.`);
      } else {
        setError("Google login failed");
      }
    }
  };

  const handleLinkAccounts = async (e) => {
    e.preventDefault();
    setError("");
    if (!linkPassword) {
      setError("Password is required to link accounts.");
      return;
    }
    try {
      const userCredential = await signInWithEmailAndPassword(auth, linkingEmail, linkPassword);
      const user = userCredential.user;
      if (!user.emailVerified) {
        setError("Please verify your email before linking accounts.");
        await auth.signOut();
        return;
      }
      await linkWithCredential(user, pendingGoogleCredential);
      await checkAndCreateUserData(user);
      const idToken = await user.getIdToken();
      const res = await fetch(`${import.meta.env.VITE_BACK_END_URL}/login`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Login failed after linking");
      } else {
        setShowLinkingPasswordForm(false);
        setPendingGoogleCredential(null);
        setLinkPassword("");
        setLinkingEmail("");
        sessionStorage.setItem("justLoggedIn", "true");
        navigate("/home", { state: { showWelcome: true } });
      }
    } catch (err) {
      setError(err.message || "Failed to link accounts");
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setError("");
    setForgotMessage("");
    if (!forgotEmail) {
      setError("Please enter your email to reset password.");
      return;
    }
    try {
      await sendPasswordResetEmail(auth, forgotEmail);
      setForgotMessage("Password reset email sent! Check your inbox.");
    } catch (err) {
      setError(err.message || "Failed to send reset email");
    }
  };

  if (showLinkingPasswordForm) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-black px-4">
        <Card className="w-full max-w-sm bg-white dark:bg-[#1a1a1a] text-black dark:text-white border border-gray-300 dark:border-[#2a2a2a] rounded-xl shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl text-center font-semibold">Link Accounts</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <form onSubmit={handleLinkAccounts} className="space-y-4">
              <div className="space-y-1 relative">
                <Label>Email</Label>
                <Input
                  type="email"
                  value={linkingEmail}
                  readOnly
                  className="bg-gray-100 dark:bg-[#121212] text-black dark:text-white border border-gray-300 dark:border-[#333]"
                />
              </div>
              <div className="space-y-1 relative">
                <Label htmlFor="linkPassword">Password</Label>
                <Input
                  id="linkPassword"
                  type="password"
                  placeholder="Enter your password"
                  value={linkPassword}
                  onChange={(e) => setLinkPassword(e.target.value)}
                  className="bg-gray-100 dark:bg-[#121212] text-black dark:text-white border border-gray-300 dark:border-[#333]"
                />
              </div>
              {error && <div className="text-red-600 text-sm text-center">{error}</div>}
              <Button type="submit" className="w-full bg-black dark:bg-white text-white dark:text-black hover:opacity-90 font-medium">
                Link Accounts and Login
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-black text-black dark:text-white dark:bg-[linear-gradient(145deg,_#0e0e0e,_#1a1a1a,_#202020,_#2a2a2a)] dark:shadow-[0_0_10px_rgba(255,255,255,0.05)]">
      <nav className="w-full flex justify-between items-center p-4">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/")}>
          <AiOutlineArrowLeft className="text-xl" />
          <span className="font-medium">Back</span>
        </div>
        <div className="flex items-center gap-2">
          {theme === 'dark' ? <HiMoon className="text-yellow-400" /> : <HiSun className="text-yellow-500" />}
          <Switch
            checked={theme === "dark"}
            onCheckedChange={toggleTheme}
            aria-label="Toggle Dark Mode"
          />
        </div>
      </nav>

      <div className="flex flex-col lg:flex-row flex-1">
        <div className="w-full lg:w-1/2 flex flex-col items-center justify-center py-12 px-6">
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="text-6xl sm:text-7xl md:text-8xl font-extrabold leading-tight text-black dark:text-transparent dark:bg-gradient-to-b dark:from-white dark:to-white/70 dark:bg-clip-text "
          >
            Code
            <motion.span
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeInOut" }}
              className="text-6xl sm:text-7xl md:text-8xl font-extrabold text-transparent bg-gradient-to-r from-blue-500 to-indigo-600 bg-clip-text cursor-default select-none"
            >
              Fuse
            </motion.span>
          </motion.h1>
        </div>

        <div className="w-full lg:w-1/2 flex flex-col justify-center items-center px-4 py-6 sm:px-6 md:px-10">
          <div className="w-full max-w-md">
            {error && <Alert message={error} type="error" onClose={() => setError("")} />}
            {successMessage && <Alert message={successMessage} type="success" onClose={() => setSuccessMessage("")} />}
            {forgotMessage && <Alert message={forgotMessage} type="success" onClose={() => setForgotMessage("")} />}

            {!showForgotPassword && (
              <Card className="w-full max-w-md mx-auto bg-[#1a1a1a] text-white border border-[#2a2a2a] rounded-xl shadow-[0_4px_15px_rgba(0,0,0,0.9)] ark:bg-black/30 dark:backdrop-blur-md dark:border dark:border-zinc-700">
                <CardHeader>
                  <CardTitle className="text-xl text-center font-semibold">Log in to your account</CardTitle>
                </CardHeader>
                <CardContent className="space-y-5">
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-1 relative">
                      <Label htmlFor="email">Email</Label>
                      <div className="relative">
                        <AiOutlineUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                        <Input
                          id="email"
                          type="email"
                          placeholder="you@example.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="bg-[#121212] text-white border border-[#333] pl-10"
                        />
                      </div>
                    </div>

                    <div className="space-y-1 relative">
                      <Label htmlFor="password">Password</Label>
                      <div className="relative">
                        <AiOutlineLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                        <Input
                          id="password"
                          type="password"
                          placeholder="Enter your password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="bg-[#121212] text-white border border-[#333] pl-10"
                        />
                      </div>
                    </div>

                    <div className="text-right">
                      <button
                        type="button"
                        onClick={() => {
                          setShowForgotPassword(true);
                          setError("");
                          setSuccessMessage("");
                          setForgotMessage("");
                          setForgotEmail(email || "");
                        }}
                        className="text-sm text-blue-400 hover:text-blue-600 underline"
                      >
                        Forgot Password?
                      </button>
                    </div>

                    <Button type="submit" className="w-full bg-white text-black hover:bg-gray-100 font-medium py-3 text-base ">
                      Log In
                    </Button>
                  </form>

                  <div className="flex items-center justify-center mt-4">
                    <Button
                      onClick={handleGoogleLogin}
                      className="w-1/2 bg-black-700 hover:bg-black-700 text-white font-medium flex items-center justify-center gap-2"
                    >
                      <FcGoogle className="text-xl" />
                      Continue with Google
                    </Button>
                  </div>

                  <div className="text-center text-sm text-gray-400 mt-4">
                    Don't have an account?{" "}
                    <a href="/signup" className="text-white underline hover:text-gray-300">
                      Signup
                    </a>
                  </div>
                </CardContent>
              </Card>
            )}

            {showForgotPassword && (
              <Card className="w-full max-w-md mx-auto bg-[#1a1a1a] text-white border border-[#2a2a2a] rounded-xl shadow-[0_4px_15px_rgba(0,0,0,0.9)]">
                <CardHeader>
                  <CardTitle className="text-xl text-center font-semibold">Reset Password</CardTitle>
                </CardHeader>
                <CardContent className="space-y-5">
                  <form onSubmit={handleForgotPassword} className="space-y-4">
                    <div className="space-y-1 relative">
                      <Label htmlFor="forgotEmail">Email</Label>
                      <div className="relative">
                        <AiOutlineUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                        <Input
                          id="forgotEmail"
                          type="email"
                          placeholder="Enter your email"
                          value={forgotEmail}
                          onChange={(e) => setForgotEmail(e.target.value)}
                          className="bg-[#121212] text-white border border-[#333] pl-10"
                        />
                      </div>
                    </div>

                    {error && <div className="text-red-600 text-sm text-center">{error}</div>}

                    <Button type="submit" className="w-full bg-white text-black hover:bg-gray-100 font-medium py-3 text-base ">
                      Send Reset Email
                    </Button>

                    <div className="text-center mt-3">
                      <button
                        type="button"
                        onClick={() => {
                          setShowForgotPassword(false);
                          setError("");
                          setForgotMessage("");
                        }}
                        className="text-sm text-blue-400 hover:text-blue-600 underline"
                      >
                        Back to Login
                      </button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
