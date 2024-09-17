import '@/global.css'
import Layout from '@/layouts/Layout.jsx'
import TablePage from '@/table-page'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'

const queryClient = new QueryClient({
  defaultOptions: {
    statetime: 5_000 /* 5 * seconds */,
    queries: {
      suspense: true,
    },
  },
})

const router = createBrowserRouter([
  {
    path: '*',
    element: (
      <QueryClientProvider client={queryClient}>
        <TablePage />
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    ),
  },
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Layout>
      <RouterProvider router={router} />
    </Layout>
  </StrictMode>,
)
