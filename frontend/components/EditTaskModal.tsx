"use client"
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectContent,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import axios from 'axios';


interface Task {
    _id: string;
    title: string;
    description: string;
    status: 'To Do' | 'In Progress' | 'Completed';
    priority: 'Low' | 'Medium' | 'High';
    dueDate?: Date;
    userId: string;
}

interface EditTaskModalProps {
  task: Task; // Task to be edited
  fetchTasks: () => void; // Function to refresh task list
  closeModal: () => void; // Function to close modal
}

const EditTaskModal = ({ task, fetchTasks, closeModal }: EditTaskModalProps) => {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);
  const [status, setStatus] = useState(task.status);
  const [priority, setPriority] = useState(task.priority);
  const [dueDate, setDueDate] = useState<Date | undefined>(task.dueDate ? new Date(task.dueDate) : undefined);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }

      const response = await axios.put(
        `https://task-be-f76c73db93ff.herokuapp.com/api/tasks/${task._id}`, // Endpoint for updating the task
        {
          title,
          description,
          status,
          priority,
          dueDate,
        },
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );

      console.log('Task updated successfully', response.data);

      // Optionally close the modal and refresh the task list
      closeModal();
      fetchTasks();
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  return (
    <Dialog open={true} onOpenChange={closeModal}>
      <DialogContent className="sm:max-w-[425px] bg-gradient-to-br from-purple-50 to-indigo-50 border-2 border-indigo-100">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-indigo-800">Edit Task</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-sm font-medium text-indigo-700">
                Task Title
              </Label>
              <Input
                id="title"
                placeholder="Enter task title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full border-indigo-200 focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm font-medium text-indigo-700">
                Description
              </Label>
              <Input
                id="description"
                placeholder="Enter task description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full border-indigo-200 focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status" className="text-sm font-medium text-indigo-700">
                Status
              </Label>
              <Select value={status} onValueChange={(value) => setStatus(value as "To Do" | "In Progress" | "Completed")}>
                <SelectTrigger className="w-full border-indigo-200 focus:border-indigo-500 focus:ring-indigo-500">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="To Do">To Do</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority" className="text-sm font-medium text-indigo-700">
                Priority
              </Label>
              <Select value={priority} onValueChange={(value) => setPriority(value as "Low" | "Medium" | "High")}>
                <SelectTrigger className="w-full border-indigo-200 focus:border-indigo-500 focus:ring-indigo-500">
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Low">Low</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="dueDate" className="text-sm font-medium text-indigo-700">
                Due Date
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal border-indigo-200 focus:border-indigo-500 focus:ring-indigo-500",
                      !dueDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dueDate ? format(dueDate, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-white">
                  <Calendar
                    mode="single"
                    selected={dueDate}
                    onSelect={setDueDate}
                    initialFocus
                    className="rounded-md border border-indigo-200"
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <DialogFooter>
            <Button 
              type="submit" 
              className="w-full bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
            >
              Update Task
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditTaskModal;
