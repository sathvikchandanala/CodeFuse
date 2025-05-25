import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarDays, BarChart2, PlusCircle } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const dummyEngagementData = [
  { date: "Mon", submissions: 5 },
  { date: "Tue", submissions: 10 },
  { date: "Wed", submissions: 7 },
  { date: "Thu", submissions: 3 },
  { date: "Fri", submissions: 8 },
  { date: "Sat", submissions: 4 },
  { date: "Sun", submissions: 9 },
];

export default function Homepage() {
  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-white to-slate-100 text-gray-900">
      {/* Navbar */}
      <header className="flex items-center justify-between px-6 py-4 shadow-md bg-white sticky top-0 z-50">
        <h1 className="text-xl font-bold">CodeTrack</h1>
        <nav className="hidden md:flex gap-6 text-sm">
          <a href="#" className="hover:underline">Home</a>
          <a href="#" className="hover:underline">Contests</a>
          <a href="#" className="hover:underline">Analytics</a>
          <a href="#" className="hover:underline">Calendar</a>
        </nav>
        <div className="md:hidden">
          {/* Mobile menu can be added here */}
        </div>
      </header>

      {/* Hero Section */}
      <section className="px-6 py-12 text-center">
        <h2 className="text-3xl md:text-5xl font-bold leading-tight">
          Track. Compete. Improve.
        </h2>
        <p className="mt-4 text-gray-600 text-lg">
          One platform for your coding scores, contests, and performance graphs.
        </p>
        <div className="mt-6 flex flex-col sm:flex-row justify-center gap-4">
          <Button>Connect Platforms</Button>
          <Button variant="outline">View Contests</Button>
        </div>
      </section>

      {/* Scores Grid */}
      <section className="px-4 md:px-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {[
          { name: "LeetCode", value: "1500", label: "Score" },
          { name: "CodeChef", value: "3★", label: "Rating" },
          { name: "Codeforces", value: "1200", label: "Rating" },
          { name: "HackerRank", value: "Gold", label: "Badge" },
        ].map((platform) => (
          <Card key={platform.name} className="hover:shadow-xl transition-shadow">
            <CardHeader>
              <CardTitle>{platform.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold">{platform.value}</p>
              <p className="text-muted-foreground">{platform.label}</p>
            </CardContent>
          </Card>
        ))}
      </section>

      {/* Upcoming Contests */}
      <section className="px-4 md:px-8 mb-12">
        <h3 className="text-xl font-semibold mb-4">Upcoming Contests & Hackathons</h3>
        <div className="space-y-4">
          {[
            { title: "LeetCode Weekly 389", date: "2025-06-02 18:30" },
            { title: "CodeChef Starters 120", date: "2025-06-05 20:00" },
          ].map((contest, idx) => (
            <Card key={idx} className="flex justify-between items-center p-4">
              <div>
                <h4 className="font-semibold">{contest.title}</h4>
                <p className="text-sm text-muted-foreground">{contest.date}</p>
              </div>
              <Button size="sm" variant="secondary">
                <PlusCircle className="w-4 h-4 mr-2" /> Add to Calendar
              </Button>
            </Card>
          ))}
        </div>
      </section>

      {/* Engagement Graph */}
      <section className="px-4 md:px-8 mb-16">
        <h3 className="text-xl font-semibold mb-4 flex items-center">
          <BarChart2 className="mr-2" /> Weekly Coding Activity
        </h3>
        <Card className="p-4">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={dummyEngagementData}>
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="submissions" stroke="#4f46e5" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </section>

      {/* Google Calendar Integration */}
      <section className="bg-white px-4 md:px-8 py-10 text-center">
        <CalendarDays className="mx-auto mb-2 w-10 h-10 text-primary" />
        <h3 className="text-xl font-semibold">Stay on Schedule</h3>
        <p className="text-muted-foreground mt-1 mb-4">
          Sync contests and hackathons directly with your Google Calendar.
        </p>
        <Button>Connect Google Calendar</Button>
      </section>

      {/* Footer */}
      <footer className="text-center text-sm text-gray-500 py-6">
        © 2025 CodeTrack.
      </footer>
    </div>
  );
}
