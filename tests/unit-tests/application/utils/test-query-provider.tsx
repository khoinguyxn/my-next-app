import {ReactNode} from 'react';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';

const createTestQueryClient = () => new QueryClient({
    defaultOptions: {
        queries: {
            retry: false,
        },
    },
});

const TestQueryClientProvider = ({children}: { children: ReactNode }) => {
    const queryClient = createTestQueryClient();

    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

export default TestQueryClientProvider;