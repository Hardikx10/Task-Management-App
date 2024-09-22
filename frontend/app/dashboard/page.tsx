"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import CreateTaskModal from "@/components/CreateTaskModal";
import { CalendarIcon, AlertCircle } from "lucide-react";
import EditTaskModal from "@/components/EditTaskModal";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import FilterSortOptions from "@/components/FilterSortOptions";
import { useRouter } from "next/navigation";

// Types
interface Task {
  _id: string;
  title: string;
  description: string;
  status: "To Do" | "In Progress" | "Completed";
  priority: "Low" | "Medium" | "High";
  dueDate?: string | Date;
  userId: string;
}

const Dashboard = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);
  const [filter, setFilter] = useState("all");
  const [sort, setSort] = useState("");

  const router = useRouter();
  
  useEffect(() => {
      const token = localStorage.getItem("token");
      if (!token) {
        // If no token, redirect to login page
        router.push("/auth/login");
      }
  }, [router]);
  
  const fetchTasks = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get("https://task-be-f76c73db93ff.herokuapp.com/api/tasks/", {
        headers: {
          Authorization: `${token}`,
        },
      });
      setTasks(response.data);
      setFilteredTasks(response.data);
    } catch (error) {
      console.log("Error fetching Tasks:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (taskId: string) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`https://task-be-f76c73db93ff.herokuapp.com/api/tasks/${taskId}`, {
        headers: {
          Authorization: `${token}`,
        },
      });
      setTasks((prevTasks) => prevTasks.filter((task) => task._id !== taskId));
      setFilteredTasks((prevTasks) =>
        prevTasks.filter((task) => task._id !== taskId)
      );
    } catch (error) {
      console.error("Error deleting task:", error);
    } finally {
      setDeleteDialogOpen(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  useEffect(() => {
    let result = [...tasks];
    if (filter !== "all") {
      result = result.filter((task) => task.status === filter);
    }
    if (sort) {
      result.sort((a, b) => {
        if (sort === "dueDate") {
          return (
            new Date(b.dueDate || "").getTime() -
            new Date(a.dueDate || "").getTime()
          );
        } else if (sort === "priority") {
          const priorityOrder = { Low: 1, Medium: 2, High: 3 };
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        } else if (sort === "status") {
          const statusOrder = { "To Do": 1, "In Progress": 2, Completed: 3 };
          return statusOrder[a.status] - statusOrder[b.status];
        }
        return 0;
      });
    }
    setFilteredTasks(result);
  }, [tasks, filter, sort]);

  const handleFilterChange = (newFilter: string) => {
    setFilter(newFilter);
  };

  const handleSortChange = (newSort: string) => {
    setSort(newSort);
  };
  const handleLogout = () => {
    localStorage.removeItem("token"); // Clear token
    router.push("/"); // Redirect to home page
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "bg-red-200 text-red-800";
      case "Medium":
        return "bg-yellow-200 text-yellow-800";
      case "Low":
        return "bg-green-200 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "To Do":
        return "bg-blue-200 text-blue-800";
      case "In Progress":
        return "bg-purple-200 text-purple-800";
      case "Completed":
        return "bg-green-200 text-green-800";
      default:
        return "bg-gray-200 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-800 to-indigo-600 py-8">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4 md:mb-0">
            Task Dashboard
          </h1>
          <div className="flex space-x-4">
            <Button
              onClick={() => {
                router.push("/kanbanScreen");
                
              }}
              className="bg-gradient-to-r from-indigo-400 to-purple-500 text-white hover:bg-grey-900 shadow-md rounded-md"
            >
              Kanban View
            </Button>
            <CreateTaskModal fetchTasks={fetchTasks} />
            <Button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white shadow-md rounded-md"
            >
              Logout
            </Button>
          </div>
        </div>

        <FilterSortOptions onFilterChange={handleFilterChange} onSortChange={handleSortChange} />

        {isLoading ? (
          <div className="text-center text-white text-xl">Loading tasks...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTasks.map((task) => (
              <Card
                key={task._id}
                className="bg-white border border-indigo-200 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <CardHeader className="bg-gradient-to-r from-purple-100 to-indigo-100 rounded-t-lg">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-xl font-bold text-indigo-800">
                      {task.title}
                    </CardTitle>
                    <Badge
                      className={`${getPriorityColor(task.priority)} font-semibold`}
                    >
                      {task.priority}
                    </Badge>
                  </div>
                  <CardDescription className="flex items-center mt-2 text-indigo-600">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {task.dueDate
                      ? new Date(task.dueDate).toLocaleDateString()
                      : "No due date"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="mt-4">
                  <p className="text-gray-700 mb-4">
                    {task.description || "No description available."}
                  </p>
                  <Badge
                    className={`${getStatusColor(task.status)} font-semibold`}
                  >
                    {task.status}
                  </Badge>
                </CardContent>
                <CardFooter className="flex justify-between mt-4">
                  <Button
                    variant="outline"
                    className="w-[45%] border-indigo-300 text-indigo-600 hover:bg-indigo-50 rounded-md"
                    onClick={() => setTaskToEdit(task)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    className="w-[45%] bg-red-600 hover:bg-red-700 rounded-md"
                    onClick={() => {
                      setTaskToDelete(task);
                      setDeleteDialogOpen(true);
                    }}
                  >
                    Delete
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}

        {taskToEdit && (
          <EditTaskModal
            //@ts-ignore
            task={taskToEdit}
            fetchTasks={fetchTasks}
            closeModal={() => setTaskToEdit(null)}
          />
        )}

        {taskToDelete && (
          <Dialog open={isDeleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
            <DialogContent className="bg-white rounded-lg shadow-lg p-6">
              <DialogHeader>
                <DialogTitle>Are you sure you want to delete this task?</DialogTitle>
                <AlertCircle className="text-red-600 h-6 w-6" />
              </DialogHeader>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setDeleteDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  className="bg-red-600"
                  onClick={() => handleDelete(taskToDelete?._id as string)}
                >
                  Confirm
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
     

    </div>
  </div>
  );
};

export default Dashboard;