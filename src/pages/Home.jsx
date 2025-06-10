import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { db, auth } from "../db";
import { Button } from "@/components/ui/button";
import { FiXCircle } from "react-icons/fi";

import Alert from "./Alert";
import Nav from "./Nav";
import {
  SiLeetcode,
  SiCodeforces,
  SiCodechef,
  SiHackerrank,
  SiGeeksforgeeks,
  SiHackerearth,
} from "react-icons/si";
import { doc, setDoc, getDoc, updateDoc, deleteField } from "firebase/firestore";


const platforms = [
  { name: "LeetCode", icon: SiLeetcode, color: "#FFA116" },
  { name: "Codeforces", icon: SiCodeforces, color: "#1F8ACB" },
  { name: "CodeChef", icon: SiCodechef, color: "#5B4638" },
  { name: "HackerRank", icon: SiHackerrank, color: "#2EC866", comingSoon: true },
  { name: "GeeksforGeeks", icon: SiGeeksforgeeks, color: "#2F8D46", comingSoon: true },
  { name: "HackerEarth", icon: SiHackerearth, color: "#323754", comingSoon: true },
];

export default function Home() {
  const [user, loading] = useAuthState(auth);
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [usernames, setUsernames] = useState({});

  useEffect(() => {
    const fetchUsernames = async () => {
      if (!user?.email) return;
      const userDocRef = doc(db, "users", user.email);
      const docSnap = await getDoc(userDocRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setUsernames(data.platforms || {});
      }
    };
    fetchUsernames();
  }, [user]);

  const handleChange = (platform, value) => {
    setUsernames({ ...usernames, [platform]: value });
  };

 const handleUnlink = async (platform) => {
  if (!user?.email) return;
  setError("");
  setSuccessMessage("");

  const userDocRef = doc(db, "users", user.email);
  try {
    // Remove the platform field from Firestore using updateDoc + deleteField
    await updateDoc(userDocRef, {
      [`platforms.${platform}`]: deleteField(),
    });

    // Update local state
    setUsernames((prev) => ({ ...prev, [platform]: "" }));

    // Show success message
    setSuccessMessage(`${platform} account unlinked successfully!`);
  } catch (err) {
    setError("Failed to unlink account");
    console.error(err);
  }
};



  const handleUpdate = async (platform) => {
    if (!user?.email) return;
    setError("");
    setSuccessMessage("");

    const username = usernames[platform]?.trim();
    if (!username) {
      setError("Username cannot be empty.");
      return;
    }

    const userDocRef = doc(db, "users", user.email);
    try {
      const docSnap = await getDoc(userDocRef);
      const existingData = docSnap.exists() ? docSnap.data() : {};
      await setDoc(
        userDocRef,
        {
          platforms: {
            ...(existingData.platforms || {}),
            [platform]: username,
          },
        },
        { merge: true }
      );
      setSuccessMessage(`${platform} username updated successfully!`);
    } catch (err) {
      setError("Failed to update username");
    }
  };

  if (loading) return <div className="text-center mt-10">Loading...</div>;
  if (!user) {
    navigate("/login");
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground overflow-x-hidden pt-15 ">
      <Nav />
      <main className="flex-grow container mx-auto px-4 sm:px-6 py-12">
        {error && <Alert message={error} type="error" onClose={() => setError("")} />}
        {successMessage && <Alert message={successMessage} type="success" onClose={() => setSuccessMessage("")} />}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 place-items-center">
          {platforms.map(({ name, icon: Icon, color, comingSoon }) => (
            <div
              key={name}
              className="w-full max-w-sm p-6 rounded-2xl border border-border shadow-xl bg-card space-y-6 text-center transform transition duration-300 hover:scale-105 hover:shadow-2xl"
            >
              <div className="flex justify-center relative">
                <Icon
                  size={64}
                  style={{ color }}
                  className="transition duration-300 transform hover:rotate-6"
                />
                {comingSoon && (
                  <div className="absolute top-0 right-0 bg-yellow-400 text-xs text-black font-bold px-2 py-1 rounded-full shadow animate-pulse">
                    Coming Soon
                  </div>
                )}
              </div>
              <h2 className="text-3xl font-extrabold leading-tight px-4 text-black dark:text-transparent dark:bg-gradient-to-b dark:from-white dark:to-white/70 dark:bg-clip-text">
                {name}
              </h2>
              {comingSoon ? (
                <div className="flex items-center justify-center gap-2 text-yellow-600 font-semibold">
                  <span className="text-lg">⚠️ Currently Not Available</span>
                </div>
              ) : (
<div className="flex flex-col gap-2 w-full">
  <input
    type="text"
    placeholder={`Enter ${name} username`}
    value={usernames[name] || ""}
    onChange={(e) => handleChange(name, e.target.value)}
    className="w-full px-4 py-2 border rounded-lg bg-background border-border focus:outline-none focus:ring-2 focus:ring-primary transition duration-300"
  />
<div className="flex items-center justify-between gap-2 w-full">
  <Button
    onClick={() => handleUpdate(name)}
    className="px-4 py-2 text-sm"
  >
    Link
  </Button>
  <button
    onClick={() => handleUnlink(name)}
    className="p-2 text-muted-foreground hover:text-red-600 transition rounded-full focus:outline-none"
    title={`Unlink ${name}`}
  >
    <FiXCircle size={22} />
  </button>
</div>

</div>


              )}
            </div>
          ))}
        </section>
      </main>
    </div>
  );
}
