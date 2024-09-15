import Button from '@/components/shadcn/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/shadcn/dropdown-menu'
import { MoreHorizontal } from 'lucide-react'

export default function Menu({ hoveredRow, keepOpen, close, row: { id } }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild onMouseEnter={keepOpen}>
        <Button
          variant='ghost'
          className={`${hoveredRow == id ? 'visible' : 'invisible'}
            h-8 w-8 p-0 focus-visible:border-transparent`}
        >
          <span className='sr-only'>Open menu</span>
          <MoreHorizontal className='h-4 w-4' />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' onMouseLeave={close}>
        <DropdownMenuItem className='focus:cursor-pointer focus:bg-secondary-hover-background'>
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem className='text-red-600 focus:cursor-pointer focus:bg-secondary-hover-background '>
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
