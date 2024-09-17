import DataTableDemo from '@/components/data-table/table'
import '@/global.css'
import Layout from '@/layouts/Layout.jsx'
import { StrictMode, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'

const router = createBrowserRouter([
  {
    path: '*',
    element: (
      <Suspense fallback={<p>Loading...</p>}>
        <DataTableDemo />
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
