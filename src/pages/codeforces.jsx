import React, { useEffect, useState } from "react";
import axios from "axios";
import { getAuth } from "firebase/auth";
import { doc, getDoc, getFirestore } from "firebase/firestore";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import CalendarHeatmap from "react-calendar-heatmap";
import { FaCheckCircle, FaFire, FaBolt, FaTrophy } from "react-icons/fa";
import { SiCodeforces } from "react-icons/si";
import Nav from "./Nav";
import { Skeleton } from "@/components/ui/skeleton";
import Footer from "./Footer";

export default function Codeforces() {
  const [profile, setProfile] = useState(null);
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(true);
  const db = getFirestore();

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const auth = getAuth();
        const user = auth.currentUser;
        if (!user) return;
        const snap = await getDoc(doc(db, "users", user.email));
        const uname = snap.data()?.platforms?.Codeforces;
        if (uname) setUsername(uname);
        const { data } = await axios.get(
          `${import.meta.env.VITE_BACK_END_URL}/codeforces/${uname}`
        );
        setProfile(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const renderContent = () => {
    if (loading)
      return (
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-xl" />
          ))}
          <Skeleton className="col-span-4 h-64 rounded-xl" />
        </div>
      );

    if (!profile)
      return (
        <p className="text-center text-muted-foreground">
          Unable to load Codeforces profile.
        </p>
      );

    return (
      <>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 font-bold">
          <StatCard label="Solved" value={profile.solvedCount} color="text-indigo-600">
            
          </StatCard>
          <StatCard label="Easy" value={profile.easyCount} color="text-green-600">
            
          </StatCard>
          <StatCard label="Medium" value={profile.mediumCount} color="text-yellow-600">
            
          </StatCard>
          <StatCard label="Hard" value={profile.hardCount} color="text-red-600">
            
          </StatCard>
        </div>
         <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
          <StatLine label="Max Rating" value={profile.maxRating} icon={<FaTrophy />} color="text-purple-600" />
          <StatLine label="Current Rating" value={profile.rating} icon={<FaBolt />} color="text-blue-600" />
        </div>

        <div className="mt-6 rounded-xl border p-4">
          <h3 className="font-semibold mb-2">Activity Heatmap</h3>
          <style>{`
  .react-calendar-heatmap .color-empty {
    fill: #f3f3f3;
  }
  .react-calendar-heatmap .color-scale-1 {
    fill: #ffe0b2;
  }
  .react-calendar-heatmap .color-scale-2 {
    fill: #ffb74d;
  }
  .react-calendar-heatmap .color-scale-3 {
    fill: #ff9800;
  }
  .react-calendar-heatmap .color-scale-4 {
    fill: #ef6c00;
  }
`}</style>

          <CalendarHeatmap
            startDate={new Date(Date.now() - 1000 * 60 * 60 * 24 * 365)}
            endDate={new Date()}
            values={profile.calendar}
            classForValue={(val) => {
              if (!val || !val.count) return "color-empty";
              if (val.count < 2) return "color-scale-1";
              if (val.count < 5) return "color-scale-2";
              if (val.count < 10) return "color-scale-3";
              return "color-scale-4";
            }}
            tooltipDataAttrs={(val) => ({
              "data-tip": `${val.date}: ${val.count || 0} submissions`,
            })}
            showWeekdayLabels
          />
          <div className="flex gap-2 mt-4 items-center text-sm text-muted-foreground">
            <span>Less</span>
            <div className="w-4 h-4 bg-[#ffe0b2] rounded" />
            <div className="w-4 h-4 bg-[#ffb74d] rounded" />
            <div className="w-4 h-4 bg-[#ff9800] rounded" />
            <div className="w-4 h-4 bg-[#ef6c00] rounded" />
            <span>More</span>
          </div>
        </div>
      </>
    );
  };

  return (
    <div className="dark:bg-[linear-gradient(145deg,_#0e0e0e,_#1a1a1a,_#202020,_#2a2a2a)] dark:shadow-[0_0_10px_rgba(255,255,255,0.05)]">
      <Nav />
      <div className="max-w-4xl mx-auto p-4 sm:p-10">
        <Card className="rounded-2xl shadow-lg dark:bg-black/30 dark:backdrop-blur-md dark:border dark:border-zinc-700">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
              <SiCodeforces className="text-blue-600 w-6 h-6" />
              Codeforces Profile: {username}
            </CardTitle>
          </CardHeader>
          <CardContent>{renderContent()}</CardContent>
        </Card>
      </div>
      <Footer/>
    </div>
  );
}

function StatCard({ label, value, color = "text-primary", children }) {
  return (
    <div className="p-3 sm:p-4 rounded-xl border bg-background shadow-sm flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 h-full min-w-0">
      {children}
      <div>
        <div className="text-xs sm:text-sm text-muted-foreground">{label}</div>
        <div className={`text-xl sm:text-2xl font-bold ${color}`}>{value}</div>
      </div>
    </div>
  );
}

function StatLine({ label, value, icon, color }) {
  return (
    <div className="p-3 sm:p-4 rounded-xl border bg-background shadow-sm flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 h-full min-w-0">
      <div className="flex items-center gap-2">
        <span className={`text-xl ${color}`}>{icon}</span>
        <span className="font-medium">{label}</span>
      </div>
      <span className={`font-bold ${color}`}>{value}</span>
    </div>
  );
}