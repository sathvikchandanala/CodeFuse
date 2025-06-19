import { useTheme } from "next-themes";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import Footer from "./Footer";
import { useLocation } from "react-router-dom";
import { FaChevronDown } from "react-icons/fa";
import { Link } from "react-router-dom";
import Nav from "./Nav";
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {FiExternalLink } from "react-icons/fi";
import { Calendar } from "@/components/ui/calendar";
import { getAuth } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db,auth } from "../db"; 
import axios from "axios"
import { CalendarClock, CheckCircle, XCircle, Laptop2,Clock10  } from "lucide-react";
import { onSnapshot, collection } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
} from "recharts";
import { useEffect, useState } from "react";
import { getDocs } from "firebase/firestore";
import { format, isSameDay, isToday, parseISO } from "date-fns";
import { CalendarPlus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Alert from "./Alert";
import { SiLeetcode, SiCodeforces, SiCodechef } from "react-icons/si";


function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <Switch
      checked={theme === "dark"}
      onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
    />
  );
}
const shimmerStyle = {
  background: `linear-gradient(
    90deg,
    #f0f0f0 25%,
    #e0e0e0 37%,
    #f0f0f0 63%
  )`,
  backgroundSize: "400% 100%",
  animation: "shimmer 1.5s infinite",
};

const shimmerKeyframes = `
@keyframes shimmer {
  0% {
    background-position: -400% 0;
  }
  100% {
    background-position: 400% 0;
  }
}
`;

const supportedPlatforms = ["LeetCode", "CodeChef", "Codeforces"];
const getPlatformIcon = (platform) => {
  if (platform === "LeetCode") return <SiLeetcode className="text-orange-500 w-5 h-5" />;
  if (platform === "CodeChef") return <SiCodechef className="text-[#5B4638] w-5 h-5" />;
  if (platform === "Codeforces") return <SiCodeforces className="text-blue-600 w-5 h-5" />;
  return null;
};


function PlatformScores() {
  const [scores, setScores] = useState({});
  const [loading, setLoading] = useState(true);
useEffect(() => {
  const auth = getAuth();
  const user = auth.currentUser;
  if (!user) return;

  const docRef = doc(db, "users", user.email);
  const unsubscribe = onSnapshot(docRef, async (docSnap) => {
    if (docSnap.exists()) {
      const platformUsernames = docSnap.data().platforms || {};
      const response = await axios.post(
        `${import.meta.env.VITE_BACK_END_URL}/platform-scores`,
        platformUsernames
      );
      setScores(response.data);
    }
    setLoading(false);
  });

  return () => unsubscribe(); 
}, []);


  const getLabel = (platformName) => {
    const lower = platformName.toLowerCase();
    if (lower === "leetcode") return "Global Ranking";
    if (lower === "codechef") return "Rating";
    if (lower === "codeforces") return "Rating";
    return "";
  };

  return (
    <div className="pt-10">
      {/* Inject shimmer animation keyframes */}
      <style>{shimmerKeyframes}</style>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 px-6">
      <>
        {supportedPlatforms.map((platform) => (
          <Card
  key={platform}
  className="rounded-2xl shadow-md hover:shadow-lg transition flex flex-col justify-between dark:bg-black/30 dark:backdrop-blur-md dark:border dark:border-zinc-700"
>
  <CardHeader>
    <CardTitle className="text-lg font-semibold text-gray-800 dark:text-gray-100 flex items-center gap-2">
  {getPlatformIcon(platform)}
  {platform}
</CardTitle>

  </CardHeader>

  <CardContent className="flex flex-col justify-between flex-grow">
    {loading ? (
      <>
        <div
          style={{ ...shimmerStyle, height: 40, width: "60%", borderRadius: 8 }}
          className="mb-3"
        />
        <div
          style={{ ...shimmerStyle, height: 16, width: "40%", borderRadius: 4 }}
        />
      </>
    ) : scores[platform] ? (
      <>
        <div>
          <p className="text-3xl font-extrabold text-transparent bg-gradient-to-r from-blue-500 to-indigo-600 bg-clip-text">
            {scores[platform]}
          </p>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {getLabel(platform)}
          </p>
        </div>

        {/* View More with Down Arrow */}
        <Link
  to={`/${platform.toLowerCase()}`}
  className="mt-4 inline-flex items-center justify-center text-sm font-bold 
             text-gray-700 hover:text-gray-900 
             dark:bg-gradient-to-r dark:from-[#1c1c1c] dark:via-[#2a2a2a] dark:to-[#3a3a3a] 
             dark:text-gray-200 dark:hover:text-white 
             dark:rounded-xl dark:shadow-[0_4px_12px_rgba(0,0,0,0.4)] 
             dark:hover:shadow-[0_6px_20px_rgba(0,0,0,0.6)] 
             dark:hover:scale-[1.03] transition-all duration-300 no-underline"
>
  View More <FaChevronDown className="ml-2" />
</Link>

      </>
    ) : (
      <Link
        to="/link"
        className="flex items-center justify-left gap-2 text-sm font-bold text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition duration-300"
      >
        <span className="text-xl">🔗</span>
        <span>Link your {platform} account</span>
      </Link>
    )}
  </CardContent>
</Card>
        ))}
        <TimeTrackerCard />
        </>
      </div>
    </div>
  );
}

function ProblemOfTheDay() {
  const [leetcodeProblem, setLeetcodeProblem] = useState(null);
  const [codeforcesProblem, setCodeforcesProblem] = useState(null);
  const [codechefProblem, setCodechefProblem] = useState(null);

  useEffect(() => {
    async function fetchLeetcodeProblem() {
      try {
        const res = await fetch(`${import.meta.env.VITE_BACK_END_URL}/problem-of-day`);
        const data = await res.json();
        setLeetcodeProblem(data);
      } catch {
        setLeetcodeProblem(null);
      }
    }

    async function fetchCodeforcesProblem() {
      try {
        const res = await fetch(`${import.meta.env.VITE_BACK_END_URL}/codeforces-problem-of-the-day`);
        const data = await res.json();
        setCodeforcesProblem(data);
      } catch {
        setCodeforcesProblem(null);
      }
    }

    async function fetchCodechefProblem() {
      try {
        const res = await fetch(`${import.meta.env.VITE_BACK_END_URL}/codechef-problem-of-the-day`);
        const data = await res.json();
        setCodechefProblem(data);
      } catch {
        setCodechefProblem(null);
      }
    }

    fetchLeetcodeProblem();
    fetchCodeforcesProblem();
    fetchCodechefProblem();
  }, []);

  const problems = {
    LeetCode: leetcodeProblem
      ? [
          {
            title: leetcodeProblem.title || "Untitled",
            link: `https://leetcode.com/problems/${leetcodeProblem.titleSlug || ""}/`,
            difficulty: leetcodeProblem.difficulty || "easy",
            tags: leetcodeProblem.tags || [],
          },
        ]
      : null,
    Codeforces: codeforcesProblem
      ? [
          {
            title: codeforcesProblem.title || "Untitled",
            link: codeforcesProblem.link || "#",
            difficulty: codeforcesProblem.difficulty || "easy",
            tags: codeforcesProblem.tags || [],
          },
        ]
      : null,
    CodeChef: codechefProblem
      ? [
          {
            title: codechefProblem.title || "Untitled",
            link: codechefProblem.link || "#",
            difficulty: codechefProblem.difficulty || "easy",
            tags: codechefProblem.tags || [],
          },
        ]
      : null,
  };

  const difficultyColors = {
    easy: "bg-green-400 text-white-800 ",
    medium: "bg-yellow-400 text-white-800 ",
    hard: "bg-red-600 text-white-800 ",
  };

  const loadingCount = 1;

  return (
    <>
      <style>{shimmerKeyframes}</style>

      <Card className="rounded-2xl shadow-md lg:col-span-2 w-full max-w-4xl mx-auto dark:bg-black/30 dark:backdrop-blur-md dark:border dark:border-zinc-700">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-800 dark:text-gray-100">
            Problem of the Day
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="LeetCode">
            <TabsList className="mb-4 dark:bg-gradient-to-r dark:from-[#1a1a1a] dark:via-[#2a2a2a] dark:to-[#1f1f1f] dark:border dark:border-zinc-800 dark:rounded-xl dark:shadow-md">
              {Object.keys(problems).map((platform) => (
                <TabsTrigger key={platform} value={platform} className="capitalize dark:data-[state=active]:bg-[#333333] dark:data-[state=active]:text-white dark:data-[state=active]:shadow-inner dark:text-zinc-400 dark:hover:text-white dark:hover:bg-[#2a2a2a] dark:px-4 dark:py-2 dark:rounded-lg transition-all">
                  {platform}
                </TabsTrigger>
              ))}
            </TabsList>

            {Object.entries(problems).map(([platform, probs]) => (
              <TabsContent key={platform} value={platform}>
                <div className="grid grid-cols-1 gap-6 w-full">
                  {probs === null ? (
                    Array.from({ length: loadingCount }).map((_, i) => (
                      <Card
                        key={i}
                        className="relative rounded-2xl shadow-md w-full max-w-3xl mx-auto cursor-wait"
                      >
                        <CardContent>
                          <div
                            style={{ ...shimmerStyle, height: 28, width: "60%", marginBottom: 16 }}
                          ></div>
                          <div
                            style={{ ...shimmerStyle, height: 20, width: "30%", marginBottom: 12, borderRadius: 12 }}
                          ></div>
                          <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
                            {[1, 2, 3].map((tag) => (
                              <div
                                key={tag}
                                style={{ ...shimmerStyle, height: 20, width: 60, borderRadius: 12 }}
                              />
                            ))}
                          </div>
                          <div
                            style={{ ...shimmerStyle, height: 36, width: 120, borderRadius: 18, marginTop: 8 }}
                          ></div>
                        </CardContent>
                      </Card>
                    ))
                  ) : probs.length === 0 ? (
                    <p className="text-gray-500">{`No ${platform} problem available.`}</p>
                  ) : (
                    probs.map((problem) => {
                      const difficulty = problem.difficulty?.toLowerCase() || "easy";
                      const diffClass = difficultyColors[difficulty] || difficultyColors.easy;

                      return (
                        <Card
                          key={problem.title}
                          className="relative rounded-2xl shadow-md w-full max-w-3xl mx-auto border border-gray-70 bg-mute"
                        >

                          <CardHeader className="px-6">
  <div className="flex flex-wrap items-center justify-between gap-3 ">
    <CardTitle className="flex items-center gap-2 text-lg font-semibold text-gray-800 dark:text-gray-100 break-words">
      {getPlatformIcon(platform)}
      {problem.title}
    </CardTitle>

    <span
      className={`px-3 py-1 rounded-full text-sm font-semibold ${diffClass} text-black`}
    >
      {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
    </span>
  </div>
</CardHeader>


                          {problem.tags && problem.tags.length > 0 && (
                            <div className="px-6 pb-2 flex flex-wrap gap-2">
                              {problem.tags.map((tag) => (
                                <span
  key={tag}
  className="px-3 py-1 rounded-full text-xs font-medium border 
             text-black border-gray-70
             dark:bg-zinc-800/70 dark:text-zinc-300 
             dark:border-zinc-700 dark:shadow-[0_0_4px_rgba(255,255,255,0.05)] 
             hover:bg-zinc-700 transition">
  {tag}
</span>

                              ))}
                            </div>
                          )}

                          <CardFooter className="flex justify-left">
                            <Button asChild className="w-1/3 px-10 flex rounded-full items-center gap-2 bg-black text-white dark:bg-gradient-to-r dark:from-[#1f1f1f] dark:via-[#2b2b2b] dark:to-[#3b3b3b] dark:text-white dark:font-semibold dark:rounded-xl dark:shadow-[0_4px_12px_rgba(0,0,0,0.4)] dark:hover:shadow-[0_6px_20px_rgba(0,0,0,0.6)] dark:hover:scale-[1.03] transition-all duration-300">
                              <a href={problem.link} target="_blank" rel="noopener noreferrer">
                                Solve <FiExternalLink size={18} />
                              </a>
                            </Button>
                          </CardFooter>
                        </Card>
                      );
                    })
                  )}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </>
  );
}

export function TimeTrackerCard() {
  const [seconds, setSeconds] = useState(() => {
    const saved = localStorage.getItem("overallTimeSpent");
    return saved ? parseInt(saved, 10) : 0;
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds((prev) => {
        const updated = prev + 1;
        localStorage.setItem("overallTimeSpent", updated);
        return updated;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (totalSeconds) => {
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    return `${hrs}h ${mins}m ${secs}s`;
  };

  return (
    <Card className="rounded-2xl shadow-md hover:shadow-lg transition flex flex-col justify-between dark:bg-black/30 dark:backdrop-blur-md dark:border dark:border-zinc-700">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-800 dark:text-gray-100 flex items-center gap-2">
          ⏱️ Time Tracker
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col justify-between flex-grow">
        <div>
          <p className="text-3xl font-extrabold text-transparent bg-gradient-to-r from-blue-500 to-indigo-600 bg-clip-text">
            {formatTime(seconds)}
          </p>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Total time spent on platform
          </p>
        </div>
      </CardContent>
    </Card>
  );
}




function formatDateFromTimestamp(timestamp) {
  const date = new Date(Number(timestamp) * 1000);
  return date.toLocaleString(); 
}


const shimmerContainerStyle = {
  height: "250px",
  borderRadius: "0.75rem",
  background: "linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 37%, #f0f0f0 63%)",
  backgroundSize: "400% 100%",
  animation: "shimmer 1.2s infinite",
};

function RecentActivity() {
  const [activities, setActivities] = useState({
    LeetCode: [],
    CodeChef: [],
    Codeforces: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      @keyframes shimmer {
        0% { background-position: -400% 0; }
        100% { background-position: 400% 0; }
      }
    `;
    document.head.appendChild(style);
  }, []);

  useEffect(() => {
    async function fetchActivities() {
      try {
        const auth = getAuth();
        const user = auth.currentUser;

        if (user) {
          const docRef = doc(db, "users", user.email);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            const platformUsernames = {
              leetcode: docSnap.data().platforms.LeetCode,
              codechef: docSnap.data().platforms.CodeChef,
              codeforces: docSnap.data().platforms.Codeforces,
            };

            const res = await axios.post(
              `${import.meta.env.VITE_BACK_END_URL}/recent-activities`,
              platformUsernames,
              { headers: { "Content-Type": "application/json" } }
            );

            const data = res.data;

            setActivities({
              LeetCode: data.LeetCode || [],
              CodeChef: data.CodeChef || [],
              Codeforces: data.Codeforces || [],
            });
          }
        }
      } catch (err) {
        console.error("Error fetching recent activities:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchActivities();
  }, []);

  return (
    <Card className="rounded-2xl shadow-md w-full lg:col-span-2 dark:bg-black/30 dark:backdrop-blur-md dark:border dark:border-zinc-700">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-800 dark:text-gray-100">
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="LeetCode">
          <TabsList className="mb-4 dark:bg-gradient-to-r dark:from-[#1a1a1a] dark:via-[#2a2a2a] dark:to-[#1f1f1f] dark:border dark:border-zinc-800 dark:rounded-xl dark:shadow-md">
            {Object.keys(activities).map((platform) => (
              <TabsTrigger key={platform} value={platform} className="capitalize dark:data-[state=active]:bg-[#333333] dark:data-[state=active]:text-white dark:data-[state=active]:shadow-inner dark:text-zinc-400 dark:hover:text-white dark:hover:bg-[#2a2a2a] dark:px-4 dark:py-2 dark:rounded-lg transition-all">
                {platform}
              </TabsTrigger>
            ))}
          </TabsList>

          {Object.entries(activities).map(([platform, logs]) => (
            <TabsContent key={platform} value={platform}>
              {loading ? (
                <div style={shimmerContainerStyle}></div>
              ) : logs.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400">No recent activity found.</p>
              ) : (
                <div className="space-y-4 max-h-[250px] overflow-y-auto pr-2 scroll-smooth scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-transparent dark:scrollbar-thumb-gray-600">
                  {logs.map((log, index) => (
                    <div
                      key={index}
                      className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-gray-70 rounded-xl shadow-sm"
                    >
                      <div className="space-y-1">
                        <div className="text-md font-semibold text-gray-800 dark:text-gray-100">
                          {log.title}
                        </div>
                        <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                          <span className="flex items-center gap-1">
                            <Laptop2 className="w-4 h-4" />
                            {log.lang}
                          </span>
                          <span className="flex items-center gap-1">
                            <CalendarClock className="w-4 h-4" />
                            {formatDateFromTimestamp(log.timestamp)}
                          </span>
                        </div>
                      </div>
                      <Badge
                        variant="outline"
                        className={`mt-2 sm:mt-0 ${
                          log.statusDisplay === "Accepted" || log.statusDisplay === "OK"
                            ? "text-green-600 border-green-600"
                            : "text-red-500 border-red-500"
                        }`}
                      >
                        {log.statusDisplay === "Accepted" || log.statusDisplay === "OK" ? (
                          <CheckCircle className="w-4 h-4 mr-1" />
                        ) : (
                          <XCircle className="w-4 h-4 mr-1" />
                        )}
                        {log.statusDisplay}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
}


export function ScheduleTab() {
  const [tab, setTab] = useState("In-Progress");
  const [user] = useAuthState(auth);
  const [tasks, setTasks] = useState({ "In-Progress": [], Completed: [] });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

useEffect(() => {
  if (!user) return;

  const unsub = onSnapshot(collection(db, "users", user.email, "tasks"), (snap) => {
    const taskList = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    const inProgress = taskList.filter((t) => !t.completed);
    const completed = taskList.filter((t) => t.completed);
    setTasks({
      "In-Progress": inProgress,
      Completed: completed,
    });
    setLoading(false);
  });

  return () => unsub();
}, [user]);



  return loading ? (
    <div style={shimmerStyle} />
  ) : (
    <Card className="rounded-2xl shadow-md w-full lg:col-span-2 flex flex-col dark:bg-black/30 dark:backdrop-blur-md dark:border dark:border-zinc-700">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-semibold text-gray-800 dark:text-gray-100">
            Task Scheduler
          </CardTitle>
         <Button
  variant="link"
  onClick={() => navigate("/tasks")}
  className="text-blue-600 hover:no-underline dark:bg-gradient-to-r dark:from-[#1f1f1f] dark:via-[#2b2b2b] dark:to-[#3b3b3b] dark:text-white dark:font-semibold dark:rounded-xl dark:shadow-[0_4px_12px_rgba(0,0,0,0.4)] dark:hover:shadow-[0_6px_20px_rgba(0,0,0,0.6)] dark:hover:scale-[1.03] no-underline transition-all duration-300"
>
  View All
</Button>
        </div>
        <Tabs value={tab} onValueChange={setTab} className="mt-4">
          <TabsList className="dark:bg-gradient-to-r dark:from-[#1a1a1a] dark:via-[#2a2a2a] dark:to-[#1f1f1f] dark:border dark:border-zinc-800 dark:rounded-xl dark:shadow-md">
            <TabsTrigger value="In-Progress" className="dark:data-[state=active]:bg-[#333333] dark:data-[state=active]:text-white dark:data-[state=active]:shadow-inner dark:text-zinc-400 dark:hover:text-white dark:hover:bg-[#2a2a2a] dark:px-4 dark:py-2 dark:rounded-lg transition-all">In Progress</TabsTrigger>
            <TabsTrigger value="Completed" className="dark:data-[state=active]:bg-[#333333] dark:data-[state=active]:text-white dark:data-[state=active]:shadow-inner dark:text-zinc-400 dark:hover:text-white dark:hover:bg-[#2a2a2a] dark:px-4 dark:py-2 dark:rounded-lg transition-all">Completed</TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>

      <CardContent className="space-y-3">
        {tasks[tab].length === 0 ? (
          <p className="text-gray-500 text-sm">No tasks found.</p>
        ) : (
          tasks[tab].slice(0, 5).map((task) => (
            <div
              key={task.id}
              className="flex items-center justify-between rounded-xl px-4 py-3 border border-gray-70 shadow-sm"
            >
              <div className="flex items-start gap-4">
                <div className="p-2 rounded-full">
                  {tab === "Completed" ? (
                    <CheckCircle className="text-green-400 w-5 h-5" />
                  ) : (
                    <Clock10 className="text-yellow-500 w-5 h-5" />
                  )}
                </div>
                <div>
                  <h3 className="text-md font-medium text-gray-800 dark:text-white">
                    {task.title}
                  </h3>
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mt-1">
                    <CalendarClock className="w-4 h-4 mr-1" />
                    {task.date} {task.time && `at ${task.time}`}
                  </div>
                </div>
              </div>
              <span
                className={`text-xs font-semibold px-2 py-1 rounded-full ${
                  tab === "Completed"
                    ? "bg-green-400 text-black"
                    : "bg-yellow-400 text-black"
                }`}
              >
                {tab === "Completed" ? "COMPLETED" : "IN_PROGRESS"}
              </span>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}

const graphData = [
  { date: "Mon", LeetCode: 2, CodeChef: 1, Codeforces: 3 },
  { date: "Tue", LeetCode: 3, CodeChef: 2, Codeforces: 1 },
];

function ActivityGraph() {
  return (
    <div className="px-6">
      <Card className="rounded-2xl shadow-md mt-8">
        <CardHeader>
          <CardTitle>Weekly Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              data={graphData}
              margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
            >
              <XAxis dataKey="date" stroke="#8884d8" />
              <YAxis stroke="#8884d8" />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="LeetCode"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={{ r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="CodeChef"
                stroke="#10b981"
                strokeWidth={2}
                dot={{ r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="Codeforces"
                stroke="#f59e0b"
                strokeWidth={2}
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}

function MediumActivityCard() {
  const mediumActivities = {
    LeetCode: ["Solved Add Two Numbers", "Reviewed Two Sum"],
    Codeforces: ["Solved Theatre Square", "Attempted A+B Problem"],
    CodeChef: ["Solved Chef and Strings", "Participated in May Cook-Off"],
  };
  return (
    <Card className="rounded-2xl shadow-md w-full lg:col-span-2 flex flex-col">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-800 dark:text-gray-100">
          Activity Summary
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="LeetCode" orientation="horizontal">
          <TabsList className="mb-4">
            {Object.keys(mediumActivities).map((platform) => (
              <TabsTrigger key={platform} value={platform} className="capitalize">
                {platform}
              </TabsTrigger>
            ))}
          </TabsList>
          {Object.entries(mediumActivities).map(([platform, logs]) => (
            <TabsContent key={platform} value={platform}>
              <ul className="list-disc pl-5 text-gray-700 dark:text-gray-300">
                {logs.map((log, idx) => (
                  <li key={idx}>{log}</li>
                ))}
              </ul>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
}

const handleAddToGoogleCalendar = (events, dateKey) => {
  const firstEvent = events[0];
  const startDateTime = new Date(`${dateKey} ${firstEvent.time}`);
  const endDateTime = new Date(startDateTime.getTime() + 60 * 60 * 1000); 

  const start = format(startDateTime, "yyyyMMdd'T'HHmmss");
  const end = format(endDateTime, "yyyyMMdd'T'HHmmss");

  const url = `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
    firstEvent.title
  )}&dates=${start}/${end}&details=${encodeURIComponent(
    "Added via EventCalendar"
  )}`;

  window.open(url, "_blank");
};


export function EventCalendar() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [eventsData, setEventsData] = useState({});
  const auth = getAuth();
  const user = auth.currentUser;

  const formatKey = (date) => format(date, "yyyy-MM-dd");
useEffect(() => {
  if (!user) return;

  const fetchEvents = async () => {
    const tasksRef = collection(db, "users", user.email, "tasks");
    const snapshot = await getDocs(tasksRef);
    const data = {};

    snapshot.forEach((doc) => {
      const task = doc.data();
      const dateKey = task.date;

      if (!task.completed) {
        if (!data[dateKey]) data[dateKey] = [];

        data[dateKey].push({
          id: doc.id,
          title: task.title,
          time: task.time,
        });
      }
    });

    setEventsData(data);
  };

  fetchEvents();
}, [user]);


  const renderDay = (day) => {
    const key = formatKey(day);
    const events = eventsData[key] || [];
    const isSelected = isSameDay(day, selectedDate);
    const isCurrentDay = isToday(day);
    const hasEvents = events.length > 0;

    const baseClasses =
      "aspect-square w-10 h-10 sm:w-12 sm:h-12 text-sm rounded-md flex flex-col items-center justify-center relative transition-colors";

    const selectedClass = isSelected
      ? "bg-black dark:bg-white dark:text-black text-white hover:bg-primary/90"
      : "hover:bg-accent hover:text-accent-foreground";

    const currentDayClass = isCurrentDay && !isSelected
      ? "border border-primary text-primary"
      : "";

    const buttonContent = (
      <button
        type="button"
        onClick={() => setSelectedDate(day)}
        className={`${baseClasses} ${selectedClass} ${currentDayClass}`}
      >
        <span>{format(day, "d")}</span>
        {hasEvents && (
          <span className="w-1.5 h-1.5 bg-red-500 rounded-full absolute bottom-1" />
        )}
      </button>
    );

    if (hasEvents) {
      return (
 <div className="w-full h-full flex items-center justify-center">
    {hasEvents ? (
      <TooltipProvider delayDuration={100}>
        <Tooltip>
          <TooltipTrigger asChild>{buttonContent}</TooltipTrigger>
          <TooltipContent className="rounded-xl shadow-lg bg-background border w-64">
            <h4 className="text-sm font-semibold mb-1 text-primary">
              Events on {format(day, "PPP")}
            </h4>
            <ul className="mb-2 text-sm text-muted-foreground">
              {events.map((event) => (
                <li key={event.id}>• {event.title} ({event.time})</li>
              ))}
            </ul>
            <Button
              variant="outline"
              size="sm"
              className="w-full flex gap-1 justify-center text-black dark:text-white"
              onClick={() => handleAddToGoogleCalendar(events, key)}
            >
              <CalendarPlus size={16} /> Add Reminder
            </Button>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    ) : (
      buttonContent
    )}
  </div>
);

    }

    return buttonContent;
  };

  return (
    <div className="p-4 sm:p-6 max-w-md mx-auto ">
      <div className="rounded-2xl shadow-md p-4 border border-gray-70 dark:bg-black/30 dark:backdrop-blur-md dark:border dark:border-zinc-700">
        <Calendar
  mode="single"
  selected={selectedDate}
  onSelect={setSelectedDate}
  components={{
    Day: ({ date }) => renderDay(date),
  }}
  className="w-full"
/>

      </div>
    </div>
  );
}


export default function Dashboard() {
  const [showAlert, setShowAlert] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const location = useLocation();

  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (user) {
      setDisplayName(user.displayName || user.email?.split("@")[0] || "User");
    }

    // 🔥 Show alert only if redirected after login
    if (location.state?.showWelcome) {
      const delayToShow = setTimeout(() => {
        setShowAlert(true);

        const delayToHide = setTimeout(() => {
          setShowAlert(false);
        }, 3000); // show for 3s

        return () => clearTimeout(delayToHide);
      }, 500); // delay showing by 0.5s

      return () => clearTimeout(delayToShow);
    }
  }, [location.state]);

  return (
    <div className="dark:bg-[linear-gradient(145deg,_#0e0e0e,_#1a1a1a,_#202020,_#2a2a2a)] dark:shadow-[0_0_10px_rgba(255,255,255,0.05)]">
      <Nav />
      <main className="w-full max-w-7xl mx-auto px-4 sm:px-6">
        {showAlert && (
          <div className="px-6 mt-4">
            <Alert
              message={`Welcome, ${displayName}!`}
              type="success"
              showIcon
              closable
              onClose={() => setShowAlert(false)}
            />
          </div>
        )}

        <PlatformScores />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">
          <ProblemOfTheDay />
          <RecentActivity />
          <ScheduleTab />
          <div className="flex justify-center lg:justify-start lg:col-span-1">
  <EventCalendar />
</div>

        </div>
      </main>
      <Footer/>
    </div>
  );
}


