'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { useState } from 'react'

export default function Providers({children}: {children: React.ReactNode}){
    const [queryClient] = useState(
        () => new QueryClient({
            defaultOptions:
            {
                queries: 
                {
                    staleTime: 100 * 60 * 5,
                    retry: 3,
                    refetchOnWindowFocus: false,
                },
                mutations:
                {
                    retry: 1,
                }
            }
        })
    )

    return(
        <QueryClientProvider client={queryClient}>
            {children}
            {process.env.NODE_ENV === 'development' && (
                <ReactQueryDevtools initialIsOpen={false} />
            )}
        </QueryClientProvider>
    );
}