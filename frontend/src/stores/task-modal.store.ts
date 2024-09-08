import { BacklogTask } from '@server/db/schema';
import { create } from 'zustand';

type TaskModalStore = {
  isOpen: boolean;
  selectedTask: BacklogTask | null;
  setIsOpen: (isOpen: boolean) => void;
  setSelectedTask: (task: BacklogTask | null) => void;
};

export const useTaskModalStore = create<TaskModalStore>((set) => ({
  isOpen: false,
  selectedTask: null,
  setIsOpen: (isOpen) => {
    set({ isOpen: isOpen });
  },
  setSelectedTask: (task) => {
    set({ selectedTask: task });
  },
}));
