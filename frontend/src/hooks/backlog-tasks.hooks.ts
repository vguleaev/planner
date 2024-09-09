import { api } from '@/lib/api';
import queryClient from '@/query-client/query-client';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useToast } from './use-toast';
import { CreateBacklogTaskGroup, UpdateBacklogTaskGroup } from '@server/validation/backlog-task-groups.schema';
import { CreateBacklogTask } from '@server/validation/backlog-tasks.schema';

const fetchBacklog = async () => {
  const response = await api['backlog'].$get({
    query: {
      filter: 'all',
    },
  });
  return response.json();
};

export const useBacklog = () => {
  return useQuery({
    queryKey: ['backlog'],
    queryFn: () => fetchBacklog(),
    staleTime: 1000 * 60 * 5,
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
      queryClient.invalidateQueries({ queryKey: ['backlog'] });
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
      queryClient.invalidateQueries({ queryKey: ['backlog'] });
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
      queryClient.invalidateQueries({ queryKey: ['backlog'] });
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
      queryClient.invalidateQueries({ queryKey: ['backlog'] });
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
      queryClient.invalidateQueries({ queryKey: ['backlog'] });
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
  });
};
