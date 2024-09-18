import Button from '@/components/shadcn/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/shadcn/dropdown-menu'
import { MoreHorizontal } from 'lucide-react'

export default function Menu({
  id,
  close,
  keepOpen,
  hoveredRow,
  openUpdateDialog,
  openDeleteDialog,
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild onMouseEnter={keepOpen}>
        <Button
          variant='ghost'
          className={`${hoveredRow == id ? 'visible' : 'invisible'}
            h-8 w-8 p-0`}
        >
          <span className='sr-only'>Open CRUD actions menu</span>
          <MoreHorizontal className='h-4 w-4' />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' onMouseLeave={close}>
        <DropdownMenuItem onClick={openUpdateDialog}>Edit </DropdownMenuItem>
        <DropdownMenuItem onClick={openDeleteDialog} className='text-red-600'>
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
