import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  FaBookmark,
  FaMapMarkerAlt,
  FaMoneyBill,
  FaFilter,
  FaCalendarAlt,
  FaClock,
  FaHistory,
} from "react-icons/fa";
import Nav from "./Nav";
import Footer from "./Footer";

const modes = ["All", "online", "offline"];
const prizeTiers = ["All", "10000", "50000", "100000"];

function createGoogleCalendarURL(hack) {
  const title = encodeURIComponent(hack.title);
  const details = encodeURIComponent("Don't miss this hackathon!");
  const location = encodeURIComponent(hack.mode === "online" ? "Online" : "Offline");

  const [startPart, endPart] = hack.submission_period_dates.split(" - ");
  
  try {
    const yearMatch = endPart.match(/(\d{4})/);
    if (!yearMatch) throw new Error("Year not found in end date.");

    const year = yearMatch[1];
    
    const startDateStr = `${startPart}, ${year}`;
    const endDateStr = endPart;

    const start = new Date(startDateStr);
    const end = new Date(endDateStr);

    const format = (d) => new Date(d).toISOString().replace(/[-:]|\.\d{3}/g, "");

    const startTime = format(start);
    const endTime = format(end);

    return `https://www.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startTime}/${endTime}&details=${details}&location=${location}&sf=true&output=xml`;
  } catch (err) {
    console.error("Error parsing event dates:", err);
    return "#";
  }
}



export default function HackathonsPage() {
  const [hackathons, setHackathons] = useState([]);
  const [modeFilter, setModeFilter] = useState("All");
  const [prizeFilter, setPrizeFilter] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACK_END_URL}/hackathons`)
      .then(res => res.json())
      .then(data => setHackathons(data))
      .catch(err => console.error("Error fetching hackathons:", err))
      .finally(() => setLoading(false));
  }, []);

  const filteredHackathons = hackathons
    .filter(h => modeFilter === "All" || h.mode === modeFilter)
    .filter(h => prizeFilter === "All" || h.prize >= parseInt(prizeFilter))
    .sort((a, b) => new Date(b.postedDate) - new Date(a.postedDate));

  return (
    <div className="min-h-screen dark:bg-[linear-gradient(145deg,_#0e0e0e,_#1a1a1a,_#202020,_#2a2a2a)] dark:shadow-[0_0_10px_rgba(255,255,255,0.05)]">
      <style>{`
        @keyframes shimmer {
          0% { background-position: -400px 0; }
          100% { background-position: 400px 0; }
        }
        .shimmer {
          background: linear-gradient(90deg, #e0e0e0 25%, #f5f5f5 50%, #e0e0e0 75%);
          background-size: 800px 100%;
          animation: shimmer 1.5s infinite;
        }
        div::-webkit-scrollbar { display: none; }
      `}</style>

      <Nav />
      <div className="max-w-[1300px] mx-auto px-4 py-8 flex gap-6 flex-col lg:flex-row">
        <div className="w-full lg:w-[260px] flex-shrink-0 lg:sticky top-20">
          <div className="p-4 rounded-xl border bg-white shadow-md dark:bg-[#191919]/90 dark:ring-1 dark:ring-zinc-700 dark:shadow-lg">
            <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
              <FaFilter /> Filter Hackathons
            </h2>
            <div className="mb-4">
              <p className="text-sm mb-2 text-muted-foreground">Mode</p>
              <div className="grid grid-cols-2 gap-2">
                {modes.map((mode) => (
                  <Button
                    key={mode}
                    variant={modeFilter === mode ? "default" : "outline"}
                    onClick={() => setModeFilter(mode)}
                    className="rounded-full w-full justify-start text-xs"
                  >
                    {mode === "online" && <FaClock className="mr-2" />}
                    {mode === "offline" && <FaHistory className="mr-2" />}
                    {mode === "All" && <FaCalendarAlt className="mr-2" />}
                    {mode}
                  </Button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-sm mb-2 text-muted-foreground">Min Prize</p>
              <div className="grid grid-cols-2 gap-2">
                {prizeTiers.map((tier) => (
                  <Button
                    key={tier}
                    variant={prizeFilter === tier ? "default" : "outline"}
                    onClick={() => setPrizeFilter(tier)}
                    className="rounded-full w-full justify-start text-xs"
                  >
                    ₹ {tier === "All" ? "Any" : parseInt(tier).toLocaleString()}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto max-h-[calc(100vh-100px)] pr-2" style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
            {loading ? (
              [...Array(4)].map((_, i) => (
                <Card key={i} className="rounded-2xl shadow-md p-4 space-y-3 animate-pulse">
                  <div className="w-full h-40 rounded-xl shimmer" />
                  <div className="h-4 w-3/4 rounded shimmer" />
                  <div className="h-3 w-1/2 rounded shimmer" />
                  <div className="h-3 w-1/3 rounded shimmer" />
                  <div className="flex gap-2">
                    <div className="h-6 w-16 rounded shimmer" />
                    <div className="h-6 w-20 rounded shimmer" />
                  </div>
                  <div className="flex gap-4">
                    <div className="h-8 w-24 rounded shimmer" />
                    <div className="h-8 w-24 rounded shimmer" />
                  </div>
                </Card>
              ))
            ) : filteredHackathons.length === 0 ? (
              <p className="text-center col-span-full text-muted-foreground">No hackathons match the selected filters.</p>
            ) : (
              filteredHackathons.map((hack) => (
                <Card key={hack.id} className="rounded-2xl shadow-md hover:shadow-xl transition duration-300 dark:bg-black/30 dark:backdrop-blur-md dark:border dark:border-zinc-700">
                  <CardHeader className="flex flex-row justify-between items-start">
                    <CardTitle className="text-lg font-semibold">{hack.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <img
                      src={hack.thumbnail_url?.startsWith("http") ? hack.thumbnail_url : `https:${hack.thumbnail_url}`}
                      alt="thumbnail"
                      className="rounded-xl w-full h-40 object-cover"
                    />
                    <div className="flex items-center gap-2">
                      <FaMapMarkerAlt className="text-sm" />
                      <Badge variant="outline" className="capitalize">{hack.mode}</Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaMoneyBill className="text-sm" />
                      <span className="text-sm font-medium">₹{hack.prize.toLocaleString()}</span>
                    </div>
                    <div className="text-xs text-muted-foreground font-bold">
                      {hack.submission_period_dates} ({hack.time_left_to_submission})
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {hack.themes?.map((theme, index) => (
                        <Badge key={index} className="text-xs border border-black bg-white text-black  dark:bg-zinc-800/70 dark:text-zinc-300 
             dark:border-zinc-700 dark:shadow-[0_0_4px_rgba(255,255,255,0.05)] 
             hover:bg-zinc-700 transition">{theme.name}</Badge>
                      ))}
                    </div>
                    <div className="text-xs text-muted-foreground font-bold">
                      {hack.registrations_count?.toLocaleString()} already registered
                    </div>
                    <div className="flex items-center gap-4 mt-2">
                      <a href={hack.url} target="_blank" rel="noopener noreferrer">
                        <Button variant="default" size="sm" className="bg-blue-600 text-white dark:bg-gradient-to-r dark:from-[#1f1f1f] dark:via-[#2b2b2b] dark:to-[#3b3b3b] dark:text-white dark:font-semibold dark:rounded-xl dark:shadow-[0_4px_12px_rgba(0,0,0,0.4)] dark:hover:shadow-[0_6px_20px_rgba(0,0,0,0.6)] dark:hover:scale-[1.03] transition-all duration-300">
                          Join Hackathon
                        </Button>
                      </a>
                      <a
  href={createGoogleCalendarURL(hack)}
  target="_blank"
  rel="noopener noreferrer"
>
  <Button variant="ghost" size="sm" title="Add to Google Calendar">
    <FaClock className="mr-2" /> Remind me
  </Button>
</a>

                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
      <Footer/>
    </div>
  );
}
