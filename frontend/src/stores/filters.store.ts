import { BACKLOG_TASK_STATUS_FILTER } from '@server/constants/backlog-task-status-filter.const';
import { BACKLOG_TASK_CREATED_FILTER } from '@server/constants/backlog-task-created-filter';
import { ValueOf } from 'ts-essentials';
import { create } from 'zustand';

type FiltersStore = {
  selectedStatusFilter: ValueOf<typeof BACKLOG_TASK_STATUS_FILTER>;
  selectedCreatedFilter: ValueOf<typeof BACKLOG_TASK_CREATED_FILTER>;
  setSelectedStatusFilter: (filter: ValueOf<typeof BACKLOG_TASK_STATUS_FILTER>) => void;
  setSelectedCreatedFilter: (filter: ValueOf<typeof BACKLOG_TASK_CREATED_FILTER>) => void;
};

export const useFiltersStore = create<FiltersStore>((set) => ({
  selectedStatusFilter: BACKLOG_TASK_STATUS_FILTER.NOT_COMPLETED,
  selectedCreatedFilter: BACKLOG_TASK_CREATED_FILTER.LAST_MONTH,
  setSelectedStatusFilter: (filter) => set({ selectedStatusFilter: filter }),
  setSelectedCreatedFilter: (filter) => set({ selectedCreatedFilter: filter }),
}));
