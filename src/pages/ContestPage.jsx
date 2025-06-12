import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FaBookmark, FaCode, FaCalendarAlt, FaPlay, FaHistory, FaClock, FaFilter } from "react-icons/fa";
import { SiLeetcode, SiCodechef, SiCodeforces } from "react-icons/si";
import { cn } from "@/lib/utils";
import axios from "axios";
import Nav from "./Nav";
import { FaYoutube } from "react-icons/fa";

const platforms = ["All", "LeetCode", "CodeChef", "Codeforces"];
const statuses = ["All", "Ongoing", "Upcoming", "Past"];

const getPlatformIcon = (platform) => {
  const commonClasses = "mr-1 text-sm";
  switch (platform) {
    case "LeetCode":
      return <SiLeetcode className={`${commonClasses} text-orange-500`} />;
    case "CodeChef":
      return <SiCodechef className={`${commonClasses} text-purple-600`} />;
    case "Codeforces":
      return <SiCodeforces className={`${commonClasses} text-blue-600`} />;
    default:
      return <FaCode className={`${commonClasses}`} />;
  }
};

const getPlatformTagClass = (platform) => {
  switch (platform) {
    case "LeetCode":
      return "bg-orange-100 text-orange-800";
    case "CodeChef":
      return "bg-purple-100 text-purple-800";
    case "Codeforces":
      return "bg-blue-100 text-blue-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const ContestCardSkeleton = () => (
  <div className="animate-pulse">
    <Card className="p-4 space-y-4">
      <div className="h-4 bg-gray-300 rounded w-3/4" />
      <div className="h-3 bg-gray-200 rounded w-1/2" />
      <div className="h-4 bg-gray-200 rounded w-full" />
      <div className="flex gap-2 mt-2">
        <div className="h-6 w-20 bg-gray-200 rounded" />
        <div className="h-6 w-8 bg-gray-200 rounded" />
        <div className="h-6 w-8 bg-gray-200 rounded" />
      </div>
      <div className="h-4 bg-gray-100 rounded w-1/3" />
      <div className="flex gap-3 mt-2">
        <div className="h-8 w-24 bg-gray-200 rounded" />
        <div className="h-8 w-8 bg-gray-200 rounded" />
      </div>
    </Card>
  </div>
);

export default function ContestsPage() {
  const [selectedPlatform, setSelectedPlatform] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [contests, setContests] = useState([]);
  const [time, setTime] = useState(Date.now());
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(10);

  useEffect(() => {
    fetchContests();
    const interval = setInterval(() => setTime(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  const fetchContests = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_BACK_END_URL}/contests`);
      setContests(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredContests = contests.filter((contest) => {
    const matchPlatform = selectedPlatform === "All" || contest.platform === selectedPlatform;
    const now = new Date();
    const start = new Date(contest.startTime);
    const end = new Date(contest.endTime);
    const isOngoing = now >= start && now <= end;
    const isUpcoming = now < start;
    const isPast = now > end;
    const matchStatus =
      selectedStatus === "All" ||
      (selectedStatus === "Ongoing" && isOngoing) ||
      (selectedStatus === "Upcoming" && isUpcoming) ||
      (selectedStatus === "Past" && isPast);
    return matchPlatform && matchStatus;
  });

  const getCountdownParts = (startTime) => {
    const now = Date.now();
    const start = new Date(startTime).getTime();
    const distance = start - now;
    if (distance <= 0) return null;
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);
    return { days, hours, minutes, seconds };
  };

  const handleAddToCalendar = (contest) => {
    try {
      const start = contest.startTime;
      const end = contest.endTime;
      const href = `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
        contest.platform + " " + contest.name
      )}&dates=${start}/${end}&details=${encodeURIComponent(contest.url)}&sf=true&output=xml`;
      window.open(href, "_blank");
    } catch (error) {
      alert("Invalid date provided for calendar event.");
    }
  };

  return (
    <div className="min-h-screen bg-muted">
      <Nav />
      <div className="max-w-[1300px] mx-auto px-4 py-8 flex gap-6 flex-col lg:flex-row">
        <div className="w-full lg:w-[260px] flex-shrink-0 lg:sticky top-20">
          <div className="p-4 rounded-xl border bg-white shadow-md dark:bg-black">
            <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
              <FaFilter /> Filter Contests
            </h2>
            <div className="mb-4">
              <p className="text-sm mb-2 text-muted-foreground">Platforms</p>
              <div className="grid grid-cols-2 gap-2">
                {platforms.map((platform) => (
                  <Button
                    key={platform}
                    variant={selectedPlatform === platform ? "default" : "outline"}
                    onClick={() => {
                      setSelectedPlatform(platform);
                      setVisibleCount(10);
                    }}
                    className="rounded-full w-full justify-start whitespace-nowrap overflow-hidden text-ellipsis text-xs"
                  >
                    {getPlatformIcon(platform)} {platform}
                  </Button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-sm mb-2 text-muted-foreground">Status</p>
              <div className="grid grid-cols-2 gap-2">
                {statuses.map((status) => (
                  <Button
                    key={status}
                    variant={selectedStatus === status ? "default" : "outline"}
                    onClick={() => {
                      setSelectedStatus(status);
                      setVisibleCount(10);
                    }}
                    className="rounded-full w-full justify-start text-xs"
                  >
                    {status === "Ongoing" && <FaPlay className="mr-2" />}
                    {status === "Upcoming" && <FaClock className="mr-2" />}
                    {status === "Past" && <FaHistory className="mr-2" />}
                    {status === "All" && <FaCalendarAlt className="mr-2" />}
                    {status}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto max-h-[calc(100vh-100px)] pr-2" style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
          <style>{`div::-webkit-scrollbar { display: none; }`}</style>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
            {loading
              ? Array.from({ length: 4 }).map((_, i) => <ContestCardSkeleton key={i} />)
              : filteredContests.slice(0, visibleCount).map((contest, i) => {
                  const countdown = getCountdownParts(contest.startTime);
                  const now = new Date();
                  const start = new Date(contest.startTime);
                  const end = new Date(contest.endTime);
                  const isPast = now > end;
                  return (
                    <div key={contest.id || i} className="relative">
                      <Card className="transition-all hover:shadow-xl duration-300">
                        {!isPast && (
                          <div className="absolute top-3 right-3 z-10">
                            <button title="Bookmark">
                              <FaBookmark className="dark:text-gray-600 hover:text-gray-600 dark:hover:text-gray-300 cursor-pointer text-lg sm:text-base" />
                            </button>
                          </div>
                        )}
                        <CardHeader>
                          <CardTitle className="flex items-center justify-between gap-2">
                            <div className="flex flex-col">
                              <span className="text-lg font-semibold">{contest.name}</span>
                              <span className="text-sm text-muted-foreground">
                                {new Date(contest.startTime).toLocaleString()}
                              </span>
                            </div>
                            <span className={`text-xs font-semibold px-3 py-1 rounded-full ${getPlatformTagClass(contest.platform)}`}>
                              {contest.platform}
                            </span>
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="text-sm space-y-3">
                          {contest.type && <Badge variant="secondary">{contest.type}</Badge>}
                          <div className="flex items-center gap-1 font-bold">
                            <FaClock className="text-muted-foreground" />
                            Starts in:
                            {countdown ? (
                              <div className="flex gap-1 ml-2">
                                <div className="bg-muted px-2 py-1 rounded text-center min-w-[36px]">{countdown.days}d</div>
                                <div className="bg-muted px-2 py-1 rounded text-center min-w-[36px]">{countdown.hours}h</div>
                                <div className="bg-muted px-2 py-1 rounded text-center min-w-[36px]">{countdown.minutes}m</div>
                                <div className="bg-muted px-2 py-1 rounded text-center min-w-[36px]">{countdown.seconds}s</div>
                              </div>
                            ) : (
                              <span className="ml-2 text-red-500 font-bold">Contest Ended</span>
                            )}
                          </div>
                          <p className="text-muted-foreground">Duration: {contest.duration}</p>
                          <div className="flex items-center gap-4 mt-2">
                            <a href={contest.url} target="_blank" rel="noopener noreferrer">
                              <Button variant="default" size="sm" className="bg-blue-600">
                                {isPast ? "View Contest" : "Join Contest"}
                              </Button>
                            </a>
                            {isPast ? (
                              <a href={contest.videoUrl} target="_blank" rel="noopener noreferrer">
                                <Button variant="ghost" size="sm" title="Watch Video Solution">
                                  <FaYoutube className="text-red-600" />Video Solution
                                </Button>
                              </a>
                            ) : (
                              <Button variant="ghost" size="sm" onClick={() => handleAddToCalendar(contest)} title="Add to Google Calendar">
                                <FaClock />Remind me
                              </Button>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  );
                })}
          </div>
          {!loading && filteredContests.length > visibleCount && (
            <div className="text-center mt-6">
              <Button onClick={() => setVisibleCount((prev) => prev + 10)}>Load More</Button>
            </div>
          )}
          {!loading && filteredContests.length === 0 && (
            <div className="text-center text-muted-foreground mt-12">
              No contests match the selected filters.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
