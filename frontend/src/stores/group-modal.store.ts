import { BacklogTaskGroupWithTasks } from '@server/services/backlog.service';
import { create } from 'zustand';

type GroupModalStore = {
  isOpen: boolean;
  selectedGroup: BacklogTaskGroupWithTasks | null;
  setIsOpen: (isOpen: boolean) => void;
  setSelectedGroup: (group: BacklogTaskGroupWithTasks | null) => void;
};

export const useGroupModalStore = create<GroupModalStore>((set) => ({
  isOpen: false,
  selectedGroup: null,
  setIsOpen: (isOpen) => {
    set({ isOpen: isOpen });
  },
  setSelectedGroup: (group) => {
    set({ selectedGroup: group });
  },
}));
