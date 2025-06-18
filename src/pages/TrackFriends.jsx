import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { SiLeetcode, SiCodeforces, SiCodechef } from "react-icons/si";
import { db } from "../db";
import { getAuth } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import Nav from "./Nav";
import Alert from "./Alert";
import Footer from "./Footer";
const TrackFriends = () => {
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState({ leetcode: '', codeforces: '', codechef: '' });
  const [friendsData, setFriendsData] = useState({ leetcode: [], codeforces: [], codechef: [] });
  const [usernameInput, setUsernameInput] = useState("");
  const [platform, setPlatform] = useState("leetcode");
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [platformData, setPlatformData] = useState({});
  const [alert, setAlert] = useState({ message: "", type: "success" });
  const [loading, setLoading] = useState(false);
  const [friendsLoading, setFriendsLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth();
    const currentUser = auth.currentUser;
    if (currentUser) {
      setUser(currentUser.email);
    }
  }, []);

  useEffect(() => {
    const fetchFriends = async () => {
      if (!user) return;
      const userDoc = await getDoc(doc(db, "users", user));
      if (userDoc.exists()) {
        const data = userDoc.data();
        setUsername({
          leetcode: data.platforms?.LeetCode || "You",
          codeforces: data.platforms?.Codeforces || "You",
          codechef: data.platforms?.CodeChef || "You",
        });
        const platforms = ["leetcode", "codeforces", "codechef"];
        const friends = {};
        for (const plat of platforms) {
          const friendDoc = await getDoc(doc(db, "users", user, "friends", plat));
          friends[plat] = friendDoc.exists() ? friendDoc.data().usernames || [] : [];
        }
        setFriendsData(friends);
        setFriendsLoading(false);
      }
    };
    fetchFriends();
  }, [user]);

  useEffect(() => {
    const fetchRankings = async () => {
      if (!platform || !username[platform] || platformData[platform]) return;
      setLoading(true);
      const usernames = [username[platform], ...friendsData[platform]];
      const endpoint = {
        leetcode: `${import.meta.env.VITE_BACK_END_URL}/leetcode-ranking`,
        codeforces: `${import.meta.env.VITE_BACK_END_URL}/codeforces-rating`,
        codechef: `${import.meta.env.VITE_BACK_END_URL}/codechef-rating`,
      }[platform];

      try {
        const res = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ usernames }),
        });
        const data = await res.json();
        setPlatformData((prev) => ({ ...prev, [platform]: data }));
      } catch (err) {
        setAlert({ message: "Failed to fetch leaderboard", type: "error" });
        setTimeout(() => setAlert({ message: "", type: "success" }), 2000);
      } finally {
        setLoading(false);
      }
    };
    fetchRankings();
  }, [platform, username, friendsData, platformData]);

  const leaderboardItems = [
    { name: "LeetCode", icon: <SiLeetcode className="text-yellow-600" />, key: "leetcode" },
    { name: "Codeforces", icon: <SiCodeforces className="text-blue-600" />, key: "codeforces" },
    { name: "CodeChef", icon: <SiCodechef className="text-purple-600" />, key: "codechef" },
  ];

  const getPlatformScore = (platform, user) => {
    return platformData[platform]?.[user]?.ranking || 0;
  };

  const addFriend = async () => {
    if (!usernameInput || !user) return;
    const platformRef = doc(db, "users", user, "friends", platform);
    const platformDoc = await getDoc(platformRef);
    let currentFriends = [];
    if (platformDoc.exists()) {
      currentFriends = platformDoc.data().usernames || [];
      if (currentFriends.includes(usernameInput)) return;
    }
    const updatedUsernames = [...currentFriends, usernameInput];
    await setDoc(platformRef, { usernames: updatedUsernames });
    setFriendsData(prev => ({
      ...prev,
      [platform]: updatedUsernames
    }));
    setUsernameInput("");
    setAlert({ message: `${usernameInput} added successfully to ${platform}`, type: "success" });
    setTimeout(() => setAlert({ message: "", type: "success" }), 2000);
  };

  return (
    <>
      <Nav />
      {alert.message && (
        <Alert
          message={alert.message}
          type={alert.type}
          onClose={() => setAlert({ message: "", type: "success" })}
        />
      )}
      <div className="p-4 md:p-8 max-w-6xl mx-auto">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-xl md:text-2xl">Track Your Friends</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="leetcode" value={platform} onValueChange={setPlatform}>
              <TabsList>
                {leaderboardItems.map(({ name, key }) => (
                  <TabsTrigger key={key} value={key}>{name}</TabsTrigger>
                ))}
              </TabsList>
              {leaderboardItems.map(({ name, icon, key }) => {
                const heading = key === "leetcode" ? "Global_Ranking" : "Rating";
                const sortedUsernames = [...(username[key] ? [username[key]] : []), ...friendsData[key]].sort((a, b) => {
                  const scoreA = getPlatformScore(key, a);
                  const scoreB = getPlatformScore(key, b);
                  return key === "leetcode" ? scoreA - scoreB : scoreB - scoreA;
                });

                return (
                  <TabsContent key={key} value={key}>
                    <div className="flex flex-col md:flex-row gap-4 my-4">
                      <Input
                        placeholder={`Enter friend's username for ${name}`}
                        value={usernameInput}
                        onChange={(e) => setUsernameInput(e.target.value)}
                        className="flex-1"
                      />
                      <Button onClick={addFriend}>Add</Button>
                    </div>
                    <Separator className="my-4" />
                    <div className="grid grid-cols-3 font-semibold mb-2 px-2 hidden md:grid">
                      <span className="text-left">Username</span>
                      <span className="text-center">{heading}</span>
                      <span></span>
                    </div>
                    {friendsLoading ? (
                      <div className="space-y-2">
                        {Array.from({ length: 5 }).map((_, idx) => (
                          <div key={idx} className="animate-pulse bg-muted rounded-md h-10" />
                        ))}
                      </div>
                    ) : friendsData[key].length === 0 ? (
                      <div className="text-center py-10">
                        <p className="text-lg font-medium mb-2">No friends added for {name} yet.</p>
                        <p className="text-muted-foreground">Enter your friends' usernames to track their progress.</p>
                      </div>
                    ) : (
                      <Card className="border border-muted shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between">
                          <CardTitle className="flex items-center gap-2 text-lg">
                            {icon} {name} Leaderboard
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ul className="space-y-2">
                            {sortedUsernames.map((name, index) => (
                              <li
                                key={name}
                                className="flex flex-col md:grid md:grid-cols-3 gap-y-1 items-start md:items-center p-2 rounded-md hover:bg-muted/50"
                              >
                                <span className="font-medium w-full text-left md:text-left">
                                  #{index + 1} {name}
                                </span>
                                <span className="font-semibold text-sm w-full text-left md:text-center">
                                  {getPlatformScore(key, name)}
                                </span>
                                {name !== username[key] ? (
                                  <div className="flex justify-start md:justify-end w-full">
                                    <Button
                                      variant="destructive"
                                      size="sm"
                                      className="px-2 text-xs"
                                      onClick={async () => {
                                        const currentList = friendsData[key];
                                        const updated = currentList.filter(friend => friend !== name);
                                        await setDoc(doc(db, "users", user, "friends", key), {
                                          usernames: updated
                                        });
                                        setFriendsData(prev => ({ ...prev, [key]: updated }));
                                      }}
                                    >
                                      Delete
                                    </Button>
                                  </div>
                                ) : (
                                  <span className="text-sm text-muted-foreground text-left md:text-right w-full">You</span>
                                )}
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
                    )}
                  </TabsContent>
                );
              })}
            </Tabs>
          </CardContent>
        </Card>

        {selectedFriend && (
          <Dialog open={!!selectedFriend} onOpenChange={() => setSelectedFriend(null)}>
            <DialogContent className="max-w-2xl w-full">
              <Card>
                <CardHeader>
                  <CardTitle>Comparison with {selectedFriend}</CardTitle>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="leetcode">
                    <TabsList>
                      {leaderboardItems.map(({ name, key }) => (
                        <TabsTrigger key={key} value={key}>{name}</TabsTrigger>
                      ))}
                    </TabsList>
                    {leaderboardItems.map(({ key }) => (
                      <TabsContent key={key} value={key}>
                        <div className="grid grid-cols-2 gap-4 text-center">
                          <div>
                            <h4 className="font-bold text-green-600">{username[key]}</h4>
                            <p className="text-xl">{getPlatformScore(key, username[key])}</p>
                          </div>
                          <div>
                            <h4 className="font-bold text-blue-600">{selectedFriend}</h4>
                            <p className="text-xl">{getPlatformScore(key, selectedFriend)}</p>
                          </div>
                        </div>
                      </TabsContent>
                    ))}
                  </Tabs>
                </CardContent>
              </Card>
            </DialogContent>
          </Dialog>
        )}
      </div>
      <Footer/>
    </>
  );
};

export default TrackFriends;
