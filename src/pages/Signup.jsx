import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Label } from "../components/ui/label";
import { AiOutlineUser, AiOutlineMail, AiOutlineLock, AiOutlineArrowLeft } from "react-icons/ai";
import { auth } from "../db";
import { createUserWithEmailAndPassword, sendEmailVerification, onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import Alert from "./Alert";
import { useEffect } from "react";
import { Switch } from "../components/ui/switch";
import { HiSun, HiMoon } from "react-icons/hi";
import { updateProfile } from "firebase/auth";

export default function Signup() {
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

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const clearError = () => setError("");
  const clearSuccess = () => setSuccess("");

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setError("Name, email, and password are required.");
      return;
    }
    setError("");
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      await updateProfile(user, {
  displayName: name,
});
      await sendEmailVerification(user);
      setSuccess("Verification email sent. Please check your email and verify your account before logging in.");
      setTimeout(() => {
        setSuccess("");
        navigate("/login");
      }, 7000);
      // Do NOT store user data in Firestore here - will be stored only after email verified on login
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-black text-black dark:bg-[linear-gradient(145deg,_#0e0e0e,_#1a1a1a,_#202020,_#2a2a2a)] dark:shadow-[0_0_10px_rgba(255,255,255,0.05)]">
      <nav className="w-full flex justify-between items-center p-4">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate(-1)}>
          <AiOutlineArrowLeft className="text-xl dark:text-white" />
          <span className="font-medium dark:text-white">Back</span>
        </div>
        <div className="flex items-center gap-2">
          {theme === "dark" ? <HiMoon className="text-yellow-400" /> : <HiSun className="text-yellow-500" />}
          <Switch
            checked={theme === "dark"}
            onCheckedChange={toggleTheme}
            aria-label="Toggle Dark Mode"
          />
        </div>
      </nav>

      <div className="flex flex-col lg:flex-row flex-1">
        <div className="w-full lg:w-1/2 flex flex-col items-center justify-center py-12 px-6">
          <h1 className="text-6xl sm:text-7xl md:text-8xl font-extrabold leading-tight text-black dark:text-transparent dark:bg-gradient-to-b dark:from-white dark:to-white/70 dark:bg-clip-text">
            Code
            <span className="text-6xl sm:text-7xl md:text-8xl font-extrabold text-transparent bg-gradient-to-r from-blue-500 to-indigo-600 bg-clip-text cursor-default select-none">
              Fuse
            </span>
          </h1>
        </div>

        <div className="w-full lg:w-1/2 flex flex-col justify-center items-center px-4 py-6 sm:px-6 md:px-10">
          <div className="w-full max-w-md">
            {error && <Alert message={error} type="error" onClose={clearError} />}
            {success && <Alert message={success} type="success" onClose={clearSuccess} />}

            <Card className="w-full max-w-md bg-[#1a1a1a] text-white border border-[#2a2a2a] rounded-xl shadow-[0_4px_15px_rgba(0,0,0,0.9)] ark:bg-black/30 dark:backdrop-blur-md dark:border dark:border-zinc-700">
              <CardHeader>
                <CardTitle className="text-xl text-center font-semibold">Create your account</CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                <form onSubmit={handleSignup} className="space-y-4">
                  <div className="space-y-1 relative">
                    <Label htmlFor="name">Name</Label>
                    <div className="relative">
                      <AiOutlineUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                      <Input
                        id="name"
                        type="text"
                        placeholder="Your full name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="bg-[#121212] text-white border border-[#333] pl-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-1 relative">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <AiOutlineMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
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
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="bg-[#121212] text-white border border-[#333] pl-10"
                      />
                    </div>
                  </div>

                  <Button type="submit" className="w-full bg-white text-black hover:bg-gray-200 font-medium">
                    Sign Up
                  </Button>
                </form>

                <div className="text-center text-sm text-gray-400 mt-4">
                  Already have an account?{" "}
                  <a href="/login" className="text-white underline hover:text-gray-300">
                    Log in
                  </a>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
