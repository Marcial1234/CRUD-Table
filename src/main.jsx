import { DataTable, Skeleton } from '@/components/data-table'
import '@/global.css'
import Layout from '@/layouts/Layout.jsx'
import { StrictMode, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'

const router = createBrowserRouter([
  {
    path: '*',
    element: (
      // query provider...
      // normal providers...
      <Suspense fallback={<p>Loading...</p>}>
        <Skeleton />
      </Suspense>
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
