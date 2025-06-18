import {
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";
import { HiSun, HiMoon } from 'react-icons/hi';
import { useLocation} from "react-router-dom";
import { useEffect, useState } from "react";
import Alert from "./Alert"; // adjust path if needed

import {
  FaTachometerAlt,
  FaCalendarAlt,
  FaChartLine,
  FaBell,
  FaUsers,
  FaGithub,
  FaLinkedin,
  FaTwitter,
  FaInstagram,
} from "react-icons/fa";

const features = [
  {
    title: "Unified Performance Dashboard",
    desc: "Track scores, ratings & rankings from LeetCode, Codeforces, CodeChef, HackerRank, AtCoder & more.",
    icon: FaTachometerAlt,
  },
  {
    title: "Upcoming Challenges & Hackathons",
    desc: "Stay updated with contests and add reminders directly to your Google Calendar.",
    icon: FaCalendarAlt,
  },
  {
    title: "Engagement Graphs & Analytics",
    desc: "Visualize your coding activity, rating progress, and streaks with beautiful charts.",
    icon: FaChartLine,
  },
  {
    title: "Notifications & Reminders",
    desc: "Get alerts before contests start or when registration windows open or close.",
    icon: FaBell,
  },
  {
    title: "Public Profiles & Leaderboards",
    desc: "Showcase achievements and compare progress with friends and community.",
    icon: FaUsers,
  },
];

export default function LandingPage() {
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();

  const location = useLocation();
 const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowAlert(false);
    }, 3000); // 3 seconds

    return () => clearTimeout(timer); // cleanup
  }, []);

useEffect(() => {
  if (location.state?.logoutSuccess) {
    setShowAlert(true);
    // Clear the state from history
    window.history.replaceState({}, document.title);
  }
}, [location.state]);


  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
     {showAlert && (
        <Alert
          message="Logged out successfully!"
          type="success"
          onClose={() => setShowAlert(false)}
          closable
        />
)}

      <header className="flex justify-between items-center p-6 border-b border-border shadow-sm px-4 sm:px-6">
        
        <h1 className="text-3xl font-extrabold leading-tight px-4 animate-fade-in-up
               text-black 
               dark:text-transparent dark:bg-gradient-to-b dark:from-white dark:to-white/70 dark:bg-clip-text">Code<span className="text-3xl font-extrabold text-transparent bg-gradient-to-r from-blue-500 to-indigo-600 bg-clip-text cursor-default select-none">
          Fuse
        </span></h1>
        <div className="flex items-center gap-2">
          {theme === 'dark' ? <HiMoon className="text-yellow-400" /> : <HiSun className="text-yellow-500" />}
        <Switch
          checked={theme === "dark"}
          onCheckedChange={() => setTheme(theme === "dark" ? "light" : "dark")}
          aria-label="Toggle Dark Mode"
        />
        </div>
      </header>

      <main className="flex-grow container mx-auto px-6 py-12">
        <section className="text-center space-y-6 max-w-4xl mx-auto px-4 py-8">
        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight px-4 text-center animate-fade-in-up text-black dark:text-transparent dark:bg-gradient-to-b dark:from-white dark:to-white/70 dark:bg-clip-text">
  Code
  <span className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-transparent bg-gradient-to-r from-blue-500 to-indigo-600 bg-clip-text cursor-default select-none">
    Fuse
  </span>
  : Your Centralized Competitive Coding Companion
</h2>


         <p className="text-sm sm:text-base md:text-lg text-muted-foreground leading-normal sm:leading-relaxed max-w-[90%] sm:max-w-2xl mx-auto animate-fade-in-up delay-200 px-4 text-center break-words">

            CodeFuse integrates multiple coding platforms like LeetCode, Codeforces,
            CodeChef, HackerRank, and more to give you a unified dashboard of your
            performance, upcoming contests, and engagement analytics.
          </p>
          <Button onClick={() => navigate("/login")} className="animate-fade-in-up delay-300 bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
            Get Started
          </Button>
        </section>

        <section
          id="features"
          className="mt-32 grid grid-cols-1 md:grid-cols-2 gap-x-20 gap-y-20 justify-items-center px-4 max-w-6xl mx-auto"
        >
          {features.map(({ title, desc, icon: Icon }, index) => {
  const isLast = index === features.length - 1;
  return (
    <motion.div
      key={index}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      viewport={{ once: true, amount: 0.3 }}
      className={`relative group w-full max-w-md ${isLast ? "md:col-span-2 flex justify-center" : ""}`}
    >
      <div className="flex flex-col items-center justify-center gap-6 mt-10">
        <div
          className="rounded-full bg-gradient-to-r from-blue-500 to-indigo-600  flex items-center justify-center text-white shadow-xl p-5"
          style={{
            boxShadow: "0 0 20px rgba(59,130,246,0.6), 0 0 40px rgba(79,70,229,0.4)",
            width: "140px",
            height: "140px",
            flexShrink: 0,
          }}
        >
          <Icon size={80} />
        </div>
        <div className="text-center px-2 ">
          <h3 className="text-3xl font-extrabold leading-tight px-4 animate-fade-in-up
                     text-black 
                     dark:text-transparent dark:bg-gradient-to-b dark:from-white dark:to-white/70 dark:bg-clip-text">
            {title}
          </h3>
          <p className="text-xl text-muted-foreground leading-relaxed animate-fade-in-up delay-200">
            {desc}
          </p>
        </div>
      </div>
    </motion.div>
  );
})}

        </section>
      </main>

      <footer className="mt-10 p-6 border-t border-border text-center text-sm text-muted-foreground shadow-[0_2px_10px_rgba(0,0,0,0.2)]">
  <div className="flex justify-center gap-6 mb-2">
    <a
      href="https://github.com/yourusername"
      target="_blank"
      rel="noopener noreferrer"
      className="transition-transform transform hover:scale-110"
      style={{
        color: "#ffffff",
      }}
    >
      <FaGithub
        size={24}
        className="hover:drop-shadow-[0_0_10px_rgba(255,255,255,0.6)] transition-all"
      />
    </a>
    <a
      href="https://linkedin.com/in/yourusername"
      target="_blank"
      rel="noopener noreferrer"
      className="transition-transform transform hover:scale-110"
      style={{
        color: "#0A66C2",
      }}
    >
      <FaLinkedin
        size={24}
        className="hover:drop-shadow-[0_0_10px_rgba(10,102,194,0.7)] transition-all"
      />
    </a>
    <a
      href="https://twitter.com/yourusername"
      target="_blank"
      rel="noopener noreferrer"
      className="transition-transform transform hover:scale-110"
      style={{
        color: "#1DA1F2",
      }}
    >
      <FaTwitter
        size={24}
        className="hover:drop-shadow-[0_0_10px_rgba(29,161,242,0.7)] transition-all"
      />
    </a>
    <a
      href="https://instagram.com/yourusername"
      target="_blank"
      rel="noopener noreferrer"
      className="transition-transform transform hover:scale-110"
      style={{
        color: "#E1306C",
      }}
    >
      <FaInstagram
        size={24}
        className="hover:drop-shadow-[0_0_10px_rgba(225,48,108,0.7)] transition-all"
      />
    </a>
  </div>
  © 2025 CodeFuse. 
</footer>
    </div>
  );
}
