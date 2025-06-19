import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Footer from "./Footer";
import { Button } from "@/components/ui/button";
import Nav from "./Nav";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Plus,
  Trash2,
  Pencil,
  Link,
  CalendarClock,
  Tags,
  StickyNote,
  ChevronDown,
  ChevronUp,
  X,
} from "lucide-react";
import {
  getDocs,
  collection,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
  onSnapshot,
  getDoc,
} from "firebase/firestore";
import { db, auth } from "../db";
import { useAuthState } from "react-firebase-hooks/auth";

const SectionToggle = ({ title, count, isOpen, toggle, children }) => (
  <div className="mb-6">
    <div className="flex items-center justify-between cursor-pointer" onClick={toggle}>
      <div className="flex items-center gap-2 w-full">
        <h2 className="text-xl font-bold flex items-center">
          {title}
          <span className="ml-3 text-gray-500">({count})</span>
        </h2>
        <hr className="flex-grow border-t border-gray-300 ml-4" />
      </div>
      {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
    </div>
    {isOpen && <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">{children}</div>}
  </div>
);

const Tasks = () => {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [newTask, setNewTask] = useState({ title: "", url: "", date: "", time: "", description: "", tags: "" });
  const [tasks, setTasks] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);
  const [showInProgress, setShowInProgress] = useState(true);
  const [showCompleted, setShowCompleted] = useState(true);
  const [showBookmarks, setShowBookmarks] = useState(true);
  const [user] = useAuthState(auth);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    if (!user) return;
    const email = user.email;
    const unsub = onSnapshot(collection(db, "users", email, "tasks"), (snap) => {
      const list = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setTasks(list);
    });
    const unsubBookmarks = onSnapshot(collection(db, "users", email, "bookmarks"), (snap) => {
      const list = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setBookmarks(list);
    });
    return () => {
      unsub();
      unsubBookmarks();
    };
  }, [user]);

  const handleModalSubmit = async () => {
    if (!user) return;
    const tags = newTask.tags.split(",").map((t) => t.trim());
    const email = user.email;
    if (editId) {
      await updateDoc(doc(db, "users", email, "tasks", editId), {
        ...newTask,
        tags,
      });
    } else {
      await addDoc(collection(db, "users", email, "tasks"), {
        ...newTask,
        tags,
        completed: false,
      });
    }
    setShowModal(false);
    setNewTask({ title: "", url: "", date: "", time: "", description: "", tags: "" });
    setEditId(null);
  };

  const deleteTask = async (id) => {
    if (!user) return;
    await deleteDoc(doc(db, "users", user.email, "tasks", id));
  };

  const editTask = async (id) => {
    if (!user) return;
    const docRef = doc(db, "users", user.email, "tasks", id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      setNewTask({
        title: data.title || "",
        url: data.url || "",
        date: data.date || "",
        time: data.time || "",
        description: data.description || "",
        tags: data.tags?.join(", ") || "",
      });
      setEditId(id);
      setShowModal(true);
    }
  };

  const markAsComplete = async (id) => {
    if (!user) return;
    await updateDoc(doc(db, "users", user.email, "tasks", id), { completed: true });
  };

  const filteredTasks = tasks
    .filter((task) => task.title.toLowerCase().includes(search.toLowerCase()))
    .filter((task) => {
      if (filter === "completed") return task.completed;
      if (filter === "upcoming") return new Date(task.date) > new Date();
      return true;
    })
    .sort((a, b) => {
      if (filter === "a-z") return a.title.localeCompare(b.title);
      if (filter === "due") return new Date(a.date) - new Date(b.date);
      return 0;
    });

  const taskCard = (task) => (
    <Card key={task.id} className="relative rounded-2xl shadow-md border border-gray-70 flex flex-col justify-between dark:bg-black/30 dark:backdrop-blur-md dark:border dark:border-zinc-700">
      <CardHeader className="space-y-1 pb-2">
        <CardTitle className="text-md font-semibold text-gray-900 flex items-center justify-between dark:text-white">
          {task.title.length > 30 ? `${task.title.slice(0, 27)}...` : task.title}
          <div className="flex gap-1">
            <Button variant="ghost" size="icon" onClick={() => editTask(task.id)}><Pencil className="h-4 w-4 text-blue-500" /></Button>
            <Button variant="ghost" size="icon" onClick={() => deleteTask(task.id)}><Trash2 className="h-4 w-4 text-red-500" /></Button>
          </div>
        </CardTitle>
        {task.url && <a href={task.url} target="_blank" rel="noopener noreferrer" className="flex items-center text-xs text-blue-600 hover:underline"><Link className="w-3.5 h-3.5 mr-1" /> {task.url.length > 35 ? task.url.slice(0, 35) + "..." : task.url}</a>}
      </CardHeader>
      <CardContent className="space-y-2 text-sm text-gray-700 dark:text-white ">
        <div className="flex items-center text-sm"><CalendarClock className="w-4 h-4 mr-2 text-gray-600" /><span>{task.date} {task.time && `at ${task.time}`}</span></div>
        {task.description && <div className="flex items-start text-sm"><StickyNote className="w-4 h-4 mr-2 mt-0.5 text-gray-600" /> {task.description}</div>}
        <div className="flex items-center flex-wrap gap-1"><Tags className="w-4 h-4 text-gray-600 mr-1" />{task.tags?.map((tag, index) => (<span key={index} className="px-3 py-1 rounded-full text-xs font-medium bg-none border border-gray-70
             dark:bg-zinc-800/70 dark:text-zinc-300 
             dark:border-zinc-700 dark:shadow-[0_0_4px_rgba(255,255,255,0.05)] 
             hover:bg-zinc-700 transition">{tag}</span>))}</div>
        <div className="pt-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <span className={`text-xs font-semibold px-2 py-1 rounded-full ${task.completed ? 'bg-green-400 text-black' : 'bg-yellow-300 text-black'}`}>{task.completed ? "COMPLETED" : "IN_PROGRESS"}</span>
          {!task.completed && <Button size="sm" className="sm:ml-auto bg-black text-white rounded-full hover:bg-gray-900 dark:bg-gradient-to-r dark:from-[#1f1f1f] dark:via-[#2b2b2b] dark:to-[#3b3b3b] dark:text-white dark:font-semibold dark:rounded-xl dark:shadow-[0_4px_12px_rgba(0,0,0,0.4)] dark:hover:shadow-[0_6px_20px_rgba(0,0,0,0.6)] dark:hover:scale-[1.03] transition-all duration-300" onClick={() => markAsComplete(task.id)}>Mark Complete</Button>}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="dark:bg-[linear-gradient(145deg,_#0e0e0e,_#1a1a1a,_#202020,_#2a2a2a)] dark:shadow-[0_0_10px_rgba(255,255,255,0.05)]">
      <Nav />
      <div className="flex flex-col min-h-screen">
        {showModal && (
          <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50 ">
            <div className="p-6 rounded-xl w-full max-w-md relative border border-gray-70 bg-white dark:bg-[#131313] dark:shadow-xl dark:ring-1 dark:ring-zinc-800">
              <Button variant="ghost" size="icon" className="absolute top-2 right-2 hover:bg-mute" onClick={() => { setShowModal(false); setEditId(null); }}><X className="w-5 h-5 text-black dark:text-white" /></Button>
              <h2 className="text-xl font-bold mb-4 text-black dark:text-white rounded-full">{editId ? "Edit Task" : "Add New Task"}</h2>
              <Input placeholder="Title" className="mb-2 dark:bg-[#222] dark:text-white dark:placeholder:text-zinc-50 bg-white" value={newTask.title} onChange={(e) => setNewTask({ ...newTask, title: e.target.value })} />
              <Input placeholder="URL" className="mb-2 dark:bg-[#222] dark:text-white dark:placeholder:text-zinc-50 bg-white" value={newTask.url} onChange={(e) => setNewTask({ ...newTask, url: e.target.value })} />
              <Input type="date" className="mb-2 dark:bg-[#222] dark:text-white dark:placeholder:text-zinc-50 bg-white" value={newTask.date} onChange={(e) => setNewTask({ ...newTask, date: e.target.value })} />
              <Input placeholder="Time" className="mb-2 dark:bg-[#222] dark:text-white dark:placeholder:text-zinc-50 bg-white" value={newTask.time} onChange={(e) => setNewTask({ ...newTask, time: e.target.value })} />
              <Input placeholder="Description" className="mb-2 dark:bg-[#222] dark:text-white dark:placeholder:text-zinc-50 bg-white" value={newTask.description} onChange={(e) => setNewTask({ ...newTask, description: e.target.value })} />
              <Input placeholder="Tags (comma separated)" className="mb-4 dark:bg-[#222] dark:text-white dark:placeholder:text-zinc-50 bg-white" value={newTask.tags} onChange={(e) => setNewTask({ ...newTask, tags: e.target.value })} />
              <Button onClick={handleModalSubmit} className="w-full rounded-full bg-black text-white dark:bg-gradient-to-r dark:from-[#1f1f1f] dark:via-[#2b2b2b] dark:to-[#3b3b3b] dark:text-white dark:font-semibold dark:rounded-xl dark:shadow-[0_4px_12px_rgba(0,0,0,0.4)] dark:hover:shadow-[0_6px_20px_rgba(0,0,0,0.6)] dark:hover:scale-[1.03] transition-all duration-300">{editId ? "Update Task" : "Save Task"}</Button>
            </div>
          </div>
        )}
        <div className={`p-4 sm:p-6 max-w-6xl mx-auto ${showModal ? 'blur-sm' : ''}`}>
          <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
            <Input type="text" placeholder="Search tasks..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full md:w-1/3" />
            <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-2/3">
              <Select onValueChange={(v) => setFilter(v)} defaultValue="all">
                <SelectTrigger className="w-full sm:w-48">Filter</SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="a-z">A-Z</SelectItem>
                  <SelectItem value="due">Due Date</SelectItem>
                  <SelectItem value="upcoming">Upcoming</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={() => { setShowModal(true); setEditId(null); }} className="w-full sm:w-auto dark:bg-gradient-to-r dark:from-[#1f1f1f] dark:via-[#2b2b2b] dark:to-[#3b3b3b] dark:text-white dark:font-semibold dark:rounded-xl dark:shadow-[0_4px_12px_rgba(0,0,0,0.4)] dark:hover:shadow-[0_6px_20px_rgba(0,0,0,0.6)] dark:hover:scale-[1.03] transition-all duration-300"><Plus className="w-4 h-4 mr-2" /> Add Task</Button>
            </div>
          </div>
          <SectionToggle title="In Progress" count={filteredTasks.filter(t => !t.completed).length} isOpen={showInProgress} toggle={() => setShowInProgress(!showInProgress)}>
            {filteredTasks.filter(t => !t.completed).map(taskCard)}
          </SectionToggle>
          <SectionToggle title="Completed" count={filteredTasks.filter(t => t.completed).length} isOpen={showCompleted} toggle={() => setShowCompleted(!showCompleted)}>
            {filteredTasks.filter(t => t.completed).map(taskCard)}
          </SectionToggle>
        </div>
      </div>
       <Footer className="mt-auto" />
    </div>
  );
};

export default Tasks;
