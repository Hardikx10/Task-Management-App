"use client";

import React, { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";

const DragDropContext = dynamic(
  () => import("react-beautiful-dnd").then((mod) => mod.DragDropContext),
  { ssr: false }
);
const Droppable = dynamic(
  () => import("react-beautiful-dnd").then((mod) => mod.Droppable),
  { ssr: false }
);
const Draggable = dynamic(
  () => import("react-beautiful-dnd").then((mod) => mod.Draggable),
  { ssr: false }
);

interface Task {
  _id: string;
  title: string;
  description: string;
  status: "To Do" | "In Progress" | "Completed";
  priority: "Low" | "Medium" | "High";
  dueDate?: Date;
  userId: string;
}

interface Column {
  title: string;
  items: Task[];
}

type Columns = {
  [key in "To Do" | "In Progress" | "Completed"]: Column;
};

const KanbanScreen = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [columns, setColumns] = useState<Columns>({
    "To Do": { title: "To Do", items: [] },
    "In Progress": { title: "In Progress", items: [] },
    "Completed": { title: "Completed", items: [] },
  });
  const router = useRouter();
  const dragItemsRef = useRef<{ [key: string]: Task }>({});
  
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      // If no token, redirect to login page
      router.push("/auth/login");
    }
}, [router]);

  useEffect(() => {
    fetchTasks();
  }, []);

  useEffect(() => {
    const newColumns: Columns = {
      "To Do": { title: "To Do", items: [] },
      "In Progress": { title: "In Progress", items: [] },
      "Completed": { title: "Completed", items: [] },
    };

    tasks.forEach((task) => {
      newColumns[task.status].items.push(task);
      dragItemsRef.current[task._id] = task;
    });

    setColumns(newColumns);
  }, [tasks]);

  useEffect(() => {
    setColumns(columns); // Force a re-render with current columns
  }, [columns]);

  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("https://task-management-be-o3vs.onrender.com/api/tasks/", {
        headers: {
          Authorization: `${token}`,
        },
      });
      setTasks(response.data);
    } catch (error) {
      console.log("Error fetching Tasks:", error);
    }
  };

  const updateTaskStatus = async (taskId: string, newStatus: string) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `https://task-management-be-o3vs.onrender.com/api/tasks/${taskId}`,
        { status: newStatus },
        {
          headers: { Authorization: `${token}` },
        }
      );
      console.log("Task status updated successfully");
    } catch (error) {
      console.error("Error updating task status:", error);
    }
  };

  const onDragEnd = async (result: any) => {
    if (!result.destination) return;

    const { source, destination, draggableId } = result;

    const task = dragItemsRef.current[draggableId];
    if (!task) {
      console.error(`Task with id ${draggableId} not found`);
      return;
    }

    if (source.droppableId !== destination.droppableId) {
      const sourceColumn = columns[source.droppableId as keyof Columns];
      const destColumn = columns[destination.droppableId as keyof Columns];
      const sourceItems = [...sourceColumn.items];
      const destItems = [...destColumn.items];
      const [removed] = sourceItems.splice(source.index, 1);
      destItems.splice(destination.index, 0, removed);

      const newColumns = {
        ...columns,
        [source.droppableId]: {
          ...sourceColumn,
          items: sourceItems,
        },
        [destination.droppableId]: {
          ...destColumn,
          items: destItems,
        },
      };

      setColumns(newColumns);

      // Update task status in the backend
      await updateTaskStatus(task._id, destination.droppableId);
    } else {
      const column = columns[source.droppableId as keyof Columns];
      const copiedItems = [...column.items];
      const [removed] = copiedItems.splice(source.index, 1);
      copiedItems.splice(destination.index, 0, removed);
      setColumns({
        ...columns,
        [source.droppableId]: {
          ...column,
          items: copiedItems,
        },
      });
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "bg-red-100 text-red-800";
      case "Medium":
        return "bg-yellow-100 text-yellow-800";
      case "Low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-purple-800 to-indigo-600">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-bold text-white">Kanban Board</h1>
        <Button
          onClick={() => router.push("/dashboard")}
          className="bg-gradient-to-br from-purple-500 to-indigo-60 text-white hover:bg-blue-800 transition-colors py-2 px-4 rounded-md text-sm md:text-base"
        >
          Back to Dashboard
        </Button>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex space-x-4">
          {Object.entries(columns).map(([columnId, column]) => (
            <div key={columnId} className="flex-1">
              <h2 className="text-2xl font-semibold mb-4 text-center text-white">{column.title}</h2>
              <Droppable droppableId={columnId}>
                {(provided, snapshot) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className={`p-4 min-h-[500px] rounded-lg ${
                      snapshot.isDraggingOver ? "bg-indigo-300" : "bg-indigo-200"
                    }`}
                  >
                    {column.items.map((task, index) => (
                      <Draggable key={task._id} draggableId={task._id} index={index}>
                        {(provided, snapshot) => (
                          <Card
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`mb-4 bg-white text-gray-800 rounded-lg shadow-md transition-transform duration-200 ${
                              snapshot.isDragging ? "transform scale-105 shadow-lg" : ""
                            }`}
                          >
                            <CardHeader>
                              <CardTitle className="text-lg font-bold">{task.title}</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <p className="text-sm text-gray-600 mb-2">{task.description}</p>
                              <Badge className={getPriorityColor(task.priority)}>
                                {task.priority}
                              </Badge>
                            </CardContent>
                          </Card>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
};

export default KanbanScreen;



