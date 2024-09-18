import '@/global.css'
import Layout from '@/layouts/Layout.jsx'
import TablePage from '@/table-page'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'

const router = createBrowserRouter([
  {
    path: '*',
    element: <TablePage />,
  },
])

createRoot(document.getElementById('root')).render(
  <Layout>
    <RouterProvider router={router} />
  </Layout>,
  // </StrictMode>,
)
