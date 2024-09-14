import DataTableDemo from '@/components/data-table/table'
import '@/global.css'
import Layout from '@/layouts/Layout.jsx'
import { StrategyProvider } from '@/proviers/strategy'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'

const router = createBrowserRouter([
  {
    path: '*',
    element: <DataTableDemo />,
  },
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <StrategyProvider>
      <Layout>
        <RouterProvider router={router} />
      </Layout>
    </StrategyProvider>
  </StrictMode>,
)
