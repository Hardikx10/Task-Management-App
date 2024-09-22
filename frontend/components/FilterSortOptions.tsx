import React from 'react';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';

interface FilterSortOptionsProps {
  onFilterChange: (filter: string) => void;
  onSortChange: (sort: string) => void;
}

const FilterSortOptions: React.FC<FilterSortOptionsProps> = ({ onFilterChange, onSortChange }) => {
  return (
    <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mb-8">
      <Select onValueChange={onFilterChange}>
        <SelectTrigger className="w-full sm:w-[180px] bg-white border-indigo-300 text-indigo-800">
          <SelectValue placeholder="Filter by Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All</SelectItem>
          <SelectItem value="To Do">To Do</SelectItem>
          <SelectItem value="In Progress">In Progress</SelectItem>
          <SelectItem value="Completed">Completed</SelectItem>
        </SelectContent>
      </Select>

      <Select onValueChange={onSortChange}>
        <SelectTrigger className="w-full sm:w-[180px] bg-white border-indigo-300 text-indigo-800">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="dueDate">Due Date</SelectItem>
          <SelectItem value="priority">Priority</SelectItem>
          <SelectItem value="status">Status</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default FilterSortOptions;

