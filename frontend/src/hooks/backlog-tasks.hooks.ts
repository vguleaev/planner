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
  return api['backlog-task-groups'][':id'].$delete({ param: { id } });
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
  });
};

const createGroup = async ({ newGroup }: { newGroup: CreateBacklogTaskGroup }) => {
  const res = await api['backlog-task-groups'].$post({ json: newGroup });
  return res.json();
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
  });
};

const updateGroup = async ({ id, updatedGroup }: { id: string; updatedGroup: UpdateBacklogTaskGroup }) => {
  const res = await api['backlog-task-groups'][':id'].$put({ param: { id }, json: updatedGroup });
  return res.json();
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
  });
};

const createTask = async ({ newTask }: { newTask: CreateBacklogTask }) => {
  const res = await api['backlog-tasks'].$post({ json: newTask });
  return res.json();
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
  });
};

const updateTask = async ({ id, updatedTask }: { id: string; updatedTask: CreateBacklogTask }) => {
  const res = await api['backlog-tasks'][':id'].$put({ param: { id }, json: updatedTask });
  return res.json();
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
  });
};
