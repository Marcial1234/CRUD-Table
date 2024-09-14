import { DataTableDemo } from '@/components/shadcn/data-table'
import { Toaster } from '@/components/shadcn/toaster'

/* TODO: make custom VSCode Pluggin for this */
import AppleIcon from './assets/apple.svg?react'

export default function App() {
  return (
    <>
      <AppleIcon />
      <DataTableDemo />
      <Toaster />
    </>
  )
}
