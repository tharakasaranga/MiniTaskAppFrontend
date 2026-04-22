"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { useRouter } from "next/navigation";
import { auth } from "@/firebase/config";
import Navbar from "@/components/Navbar";
import api from "@/lib/api";

type TaskItem = {
  id: number;
  title: string;
  description?: string;
  isCompleted: boolean;
  userId: string;
};

type FilterType = "all" | "completed" | "pending";

export default function DashboardPage() {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [loadingTasks, setLoadingTasks] = useState(false);
  const [taskError, setTaskError] = useState("");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [addingTask, setAddingTask] = useState(false);

  const [filter, setFilter] = useState<FilterType>("all");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        router.push("/login");
      } else {
        setUser(currentUser);
      }

      setCheckingAuth(false);
    });

    return () => unsubscribe();
  }, [router]);

  const fetchTasks = async () => {
    setLoadingTasks(true);
    setTaskError("");

    try {
      const response = await api.get("/api/tasks");
      setTasks(response.data);
    } catch (error: any) {
      setTaskError(error?.response?.data?.message || "Failed to load tasks");
    } finally {
      setLoadingTasks(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchTasks();
    }
  }, [user]);

  const handleAddTask = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (title.trim() === "") {
      setTaskError("Task title is required");
      return;
    }

    setAddingTask(true);
    setTaskError("");

    try {
      const response = await api.post("/api/tasks", {
        title,
        description,
      });

      setTasks((prevTasks) => [response.data, ...prevTasks]);
      setTitle("");
      setDescription("");
    } catch (error: any) {
      setTaskError(error?.response?.data?.message || "Failed to add task");
    } finally {
      setAddingTask(false);
    }
  };

  const handleToggleComplete = async (task: TaskItem) => {
    try {
      const response = await api.put(`/api/tasks/${task.id}`, {
        title: task.title,
        description: task.description || "",
        isCompleted: !task.isCompleted,
      });

      setTasks((prevTasks) =>
        prevTasks.map((item) => (item.id === task.id ? response.data : item))
      );
    } catch (error: any) {
      setTaskError(error?.response?.data?.message || "Failed to update task");
    }
  };

  const handleDeleteTask = async (id: number) => {
    try {
      await api.delete(`/api/tasks/${id}`);

      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
    } catch (error: any) {
      setTaskError(error?.response?.data?.message || "Failed to delete task");
    }
  };

  const filteredTasks = useMemo(() => {
    if (filter === "completed") {
      return tasks.filter((task) => task.isCompleted);
    }

    if (filter === "pending") {
      return tasks.filter((task) => !task.isCompleted);
    }

    return tasks;
  }, [tasks, filter]);

  if (checkingAuth) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Checking authentication...</p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-8">
      <div className="mx-auto max-w-3xl">
        <Navbar email={user.email || "No email"} />

        <div className="mb-6 rounded-lg bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-semibold">Add New Task</h2>

          <form onSubmit={handleAddTask} className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium">Title</label>
              <input
                type="text"
                className="w-full rounded-md border px-3 py-2 outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Enter task title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">Description</label>
              <textarea
                className="w-full rounded-md border px-3 py-2 outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Enter task description"
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={addingTask}
              className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-60"
            >
              {addingTask ? "Adding..." : "Add Task"}
            </button>
          </form>
        </div>

        <div className="mb-4 flex gap-2">
          <button
            onClick={() => setFilter("all")}
            className={`rounded-md px-4 py-2 text-sm ${
              filter === "all"
                ? "bg-black text-white"
                : "bg-white text-black shadow-sm"
            }`}
          >
            All
          </button>

          <button
            onClick={() => setFilter("completed")}
            className={`rounded-md px-4 py-2 text-sm ${
              filter === "completed"
                ? "bg-black text-white"
                : "bg-white text-black shadow-sm"
            }`}
          >
            Completed
          </button>

          <button
            onClick={() => setFilter("pending")}
            className={`rounded-md px-4 py-2 text-sm ${
              filter === "pending"
                ? "bg-black text-white"
                : "bg-white text-black shadow-sm"
            }`}
          >
            Pending
          </button>
        </div>

        {taskError && (
          <div className="mb-4 rounded-md bg-red-100 px-4 py-3 text-red-600">
            {taskError}
          </div>
        )}

        <div className="rounded-lg bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-semibold">My Tasks</h2>

          {loadingTasks ? (
            <p className="text-gray-500">Loading tasks...</p>
          ) : filteredTasks.length === 0 ? (
            <p className="text-gray-500">No tasks found.</p>
          ) : (
            <div className="space-y-4">
              {filteredTasks.map((task) => (
                <div
                  key={task.id}
                  className="flex flex-col gap-3 rounded-lg border p-4 md:flex-row md:items-center md:justify-between"
                >
                  <div className="flex-1">
                    <h3
                      className={`text-lg font-medium ${
                        task.isCompleted ? "line-through text-gray-400" : ""
                      }`}
                    >
                      {task.title}
                    </h3>

                    {task.description && (
                      <p
                        className={`mt-1 text-sm ${
                          task.isCompleted ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        {task.description}
                      </p>
                    )}

                    <p className="mt-2 text-xs text-gray-500">
                      Status: {task.isCompleted ? "Completed" : "Pending"}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleToggleComplete(task)}
                      className={`rounded-md px-3 py-2 text-sm text-white ${
                        task.isCompleted
                          ? "bg-yellow-500 hover:bg-yellow-600"
                          : "bg-green-600 hover:bg-green-700"
                      }`}
                    >
                      {task.isCompleted ? "Mark Pending" : "Mark Complete"}
                    </button>

                    <button
                      onClick={() => handleDeleteTask(task.id)}
                      className="rounded-md bg-red-500 px-3 py-2 text-sm text-white hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}