import { QueryClient } from '@tanstack/react-query';

const queryClient = new QueryClient();

queryClient.setDefaultOptions({
  queries: {
    refetchOnWindowFocus: false,
    retry: false,
  },
});

export default queryClient;
