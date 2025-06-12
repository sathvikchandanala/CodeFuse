// src/pages/NotFound.jsx
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { AlertTriangle } from "lucide-react";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-black text-white p-6 text-center">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 150, damping: 20 }}
        className="flex flex-col items-center gap-4"
      >
        <AlertTriangle className="w-16 h-16 text-red-400 animate-pulse" />
        <h1 className="text-5xl font-extrabold tracking-tight bg-gradient-to-r from-purple-400 to-pink-600 text-transparent bg-clip-text">
          404 - Not Found
        </h1>
        <p className="text-lg sm:text-xl text-muted text-white/70 max-w-md">
          Uh-oh! The code you're looking for got lost in the syntax. Let's get you back on track.
        </p>
        <Button
          className="mt-4 px-6 py-2 text-base font-semibold bg-gradient-to-r from-indigo-500 to-blue-600 text-white shadow-lg hover:scale-105 transition-transform"
          onClick={() => navigate("/home")}
        >
          Go Home
        </Button>
      </motion.div>

      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="mt-10 text-sm text-white/50"
      >
        — CodeFuse: Keep tracking. Keep coding.
      </motion.div>
    </div>
  );
}
