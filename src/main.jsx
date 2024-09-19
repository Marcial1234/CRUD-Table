import '@/global.css'
import Layout from '@/layouts/layout.jsx'
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
  <StrictMode>
    <Layout>
      <RouterProvider router={router} />
    </Layout>
  </StrictMode>,
)
