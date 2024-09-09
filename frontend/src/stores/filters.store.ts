import { BACKLOG_TASK_FILTER } from '@server/constants/backlog-task-filter.const';
import { ValueOf } from 'ts-essentials';
import { create } from 'zustand';

type FiltersStore = {
  selectedStatusFilter: ValueOf<typeof BACKLOG_TASK_FILTER>;
  setSelectedStatusFilter: (filter: ValueOf<typeof BACKLOG_TASK_FILTER>) => void;
};

export const useFiltersStore = create<FiltersStore>((set) => ({
  selectedStatusFilter: BACKLOG_TASK_FILTER.NOT_COMPLETED,
  setSelectedStatusFilter: (filter) => set({ selectedStatusFilter: filter }),
}));
