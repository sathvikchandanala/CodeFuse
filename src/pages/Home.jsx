import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import { db ,auth } from "../db";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useTheme } from "next-themes";
import { HiSun, HiMoon } from "react-icons/hi";
import {
  SiLeetcode,
  SiCodeforces,
  SiCodechef,
  SiHackerrank,
  SiGeeksforgeeks,
  SiHackerearth,
} from "react-icons/si";
import { doc, setDoc, getDoc } from "firebase/firestore";


const platforms = [
  { name: "LeetCode", icon: SiLeetcode, color: "#FFA116" },
  { name: "Codeforces", icon: SiCodeforces, color: "#1F8ACB" },
  { name: "CodeChef", icon: SiCodechef, color: "#5B4638" },
  { name: "HackerRank", icon: SiHackerrank, color: "#2EC866", comingSoon: true },
  { name: "GeeksforGeeks", icon: SiGeeksforgeeks, color: "#2F8D46", comingSoon: true },
  { name: "HackerEarth", icon: SiHackerearth, color: "#323754" , comingSoon: true},
];

export default function Home() {
  const [user, loading] = useAuthState(auth);
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const [usernames, setUsernames] = useState({});

  const handleChange = (platform, value) => {
    setUsernames({ ...usernames, [platform]: value });
  };

  const handleUpdate = async (platform) => {
  if (!user?.email) return;

  const username = usernames[platform];
  if (!username) return;

  const userDocRef = doc(db, "users", user.email);

  try {
    const existingData = (await getDoc(userDocRef)).data() || {};
    await setDoc(
      userDocRef,
      {
        platforms: {
          ...existingData.platforms,
          [platform]: username,
        },
      },
      { merge: true }
    );
    console.log(`Saved ${platform} username: ${username}`);
    alert(`${platform} username updated successfully!`);
  } catch (error) {
    console.error("Error updating username:", error);
    alert("Failed to update username.");
  }
};


  const logout = async () => {
    try {
      await signOut(auth);
      navigate("/");
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  if (loading) return <div className="text-center mt-10">Loading...</div>;
  if (!user) {
    navigate("/login");
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <header className="flex justify-between items-center p-6 border-b border-border">
        <div className="flex items-center gap-6">
          <h1 className="text-3xl font-extrabold text-transparent bg-gradient-to-r from-blue-500 to-indigo-600 bg-clip-text cursor-default select-none">
            CodeFuse
          </h1>
          {user.displayName || user.email ? (
            <p className="text-lg font-semibold text-muted-foreground">
              @{user.displayName || user.email.split("@")[0]}
            </p>
          ) : null}
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={logout} className="animate-fade-in-up delay-300">
            Log out
          </Button>
          {theme === "dark" ? (
            <HiMoon className="text-yellow-400" />
          ) : (
            <HiSun className="text-yellow-500" />
          )}
          <Switch
            checked={theme === "dark"}
            onCheckedChange={() =>
              setTheme(theme === "dark" ? "light" : "dark")
            }
            aria-label="Toggle Dark Mode"
          />
        </div>
      </header>

      <main className="flex-grow container mx-auto px-6 py-12">
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
      <h2 className="text-3xl font-extrabold leading-tight px-4 animate-fade-in-up text-black dark:text-transparent dark:bg-gradient-to-b dark:from-white dark:to-white/70 dark:bg-clip-text">
        {name}
      </h2>

      {comingSoon ? (
        <div className="flex items-center justify-center gap-2 text-yellow-600 font-semibold">
          <span className="text-lg">⚠️ Currently Not Available</span>
        </div>
      ) : (
        <div className="flex gap-2 items-center">
          <input
            type="text"
            placeholder={`Enter ${name} username`}
            value={usernames[name] || ""}
            onChange={(e) => handleChange(name, e.target.value)}
            className="flex-grow px-4 py-2 border rounded-lg bg-background border-border focus:outline-none focus:ring-2 focus:ring-primary transition duration-300"
          />
          <Button
            className="whitespace-nowrap"
            onClick={() => handleUpdate(name)}
          >
            Change
          </Button>
        </div>
      )}
    </div>
  ))}
</section>


      </main>
    </div>
  );
}
