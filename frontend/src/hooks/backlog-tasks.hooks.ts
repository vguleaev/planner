import { api } from '@/lib/api';
import queryClient from '@/query-client/query-client';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useToast } from './use-toast';
import { CreateBacklogTaskGroup, UpdateBacklogTaskGroup } from '@server/validation/backlog-task-groups.schema';
import { CreateBacklogTask } from '@server/validation/backlog-tasks.schema';
import { BACKLOG_TASK_CREATED_FILTER } from '@server/constants/backlog-task-created-filter';
import { ValueOf } from 'ts-essentials';
import { useFiltersStore } from '@/stores/filters.store';

const fetchBacklog = async (createdFilter: ValueOf<typeof BACKLOG_TASK_CREATED_FILTER>) => {
  const response = await api['backlog'].$get({
    query: {
      created: createdFilter,
    },
  });
  return response.json();
};

export const useBacklog = () => {
  const { selectedCreatedFilter } = useFiltersStore((state) => ({
    selectedCreatedFilter: state.selectedCreatedFilter,
  }));

  return useQuery({
    queryKey: ['backlog'],
    queryFn: () => fetchBacklog(selectedCreatedFilter),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

const deleteGroup = async ({ id }: { id: string }) => {
  const response = await api['backlog-task-groups'][':id'].$delete({ param: { id } });
  return response.json();
};

export const useDeleteGroup = () => {
  const { toast } = useToast();

  return useMutation({
    mutationFn: deleteGroup,
    onSuccess: () => {
      toast({
        title: 'Success!',
        description: 'You have successfully deleted a group.',
      });
    },
    onError: () => {
      toast({
        title: 'Error!',
        description: `Failed to delete the group`,
        variant: 'destructive',
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['backlog'] });
    },
  });
};

const createGroup = async ({ newGroup }: { newGroup: CreateBacklogTaskGroup }) => {
  const response = await api['backlog-task-groups'].$post({ json: newGroup });
  return response.json();
};

export const useCreateGroup = () => {
  const { toast } = useToast();

  return useMutation({
    mutationFn: createGroup,
    onSuccess: () => {
      toast({
        title: 'Success!',
        description: 'You have successfully created a new group.',
      });
    },
    onError: () => {
      toast({
        title: 'Error!',
        description: `Failed to create the group`,
        variant: 'destructive',
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['backlog'] });
    },
  });
};

const updateGroup = async ({ id, updatedGroup }: { id: string; updatedGroup: UpdateBacklogTaskGroup }) => {
  const response = await api['backlog-task-groups'][':id'].$put({ param: { id }, json: updatedGroup });
  return response.json();
};

export const useUpdateGroup = () => {
  const { toast } = useToast();

  return useMutation({
    mutationFn: updateGroup,
    onSuccess: () => {
      toast({
        title: 'Success!',
        description: 'You have successfully updated a group.',
      });
    },
    onError: () => {
      toast({
        title: 'Error!',
        description: `Failed to update the group`,
        variant: 'destructive',
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['backlog'] });
    },
  });
};

const createTask = async ({ newTask }: { newTask: CreateBacklogTask }) => {
  const response = await api['backlog-tasks'].$post({ json: newTask });
  return response.json();
};

export const useCreateTask = () => {
  const { toast } = useToast();

  return useMutation({
    mutationFn: createTask,
    onSuccess: () => {
      toast({
        title: 'Success!',
        description: 'You have successfully created a new task.',
      });
    },
    onError: () => {
      toast({
        title: 'Error!',
        description: `Failed to create the task`,
        variant: 'destructive',
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['backlog'] });
    },
  });
};

const updateTask = async ({ id, updatedTask }: { id: string; updatedTask: CreateBacklogTask }) => {
  const response = await api['backlog-tasks'][':id'].$put({ param: { id }, json: updatedTask });
  return response.json();
};

export const useUpdateTask = () => {
  const { toast } = useToast();

  return useMutation({
    mutationFn: updateTask,
    onSuccess: () => {
      toast({
        title: 'Success!',
        description: 'You have successfully updated a task.',
      });
    },
    onError: () => {
      toast({
        title: 'Error!',
        description: `Failed to update the task`,
        variant: 'destructive',
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['backlog'] });
    },
  });
};

const deleteTask = async ({ id }: { id: string }) => {
  const response = await api['backlog-tasks'][':id'].$delete({ param: { id } });
  return response.json();
};

export const useDeleteTask = () => {
  const { toast } = useToast();

  return useMutation({
    mutationFn: deleteTask,
    onSuccess: () => {
      toast({
        title: 'Success!',
        description: 'You have successfully deleted a task.',
      });
    },
    onError: () => {
      toast({
        title: 'Error!',
        description: `Failed to delete the task`,
        variant: 'destructive',
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['backlog'] });
    },
  });
};

const toggleTask = async ({ id }: { id: string }) => {
  const response = await api['backlog-tasks'][':id']['toggle'].$post({ param: { id } });
  return response.json();
};

export const useToggleTask = () => {
  const { toast } = useToast();

  return useMutation({
    mutationFn: toggleTask,
    onSuccess: () => {
      toast({
        title: 'Success!',
        description: 'You have successfully changed task.',
      });
    },
    onError: () => {
      toast({
        title: 'Error!',
        description: `Failed to toggle task status`,
        variant: 'destructive',
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['backlog'] });
    },
  });
};
