import { Button } from '@/components/shadcn/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/shadcn/dropdown-menu'
import { MoreHorizontal } from 'lucide-react'

export default function ({ hoveredRow, row }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant='ghost'
          className={`${hoveredRow == row.id ? 'visible' : 'invisible'}
            text=[#211F33] h-8 w-8 p-0 hover:bg-[#E8E8EA] focus-visible:bg-[#E8E8EA]`}
        >
          <span className='sr-only'>Open menu</span>
          <MoreHorizontal className='h-4 w-4' />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end'>
        <DropdownMenuItem className='focus:cursor-pointer focus:bg-[#F4F4F5]'>
          <a
            className='cursor-pointer'
            onClick={() => {
              setHoveredRow(null)
            }}
          >
            Edit
          </a>
        </DropdownMenuItem>
        <DropdownMenuItem className='text-[#D53948] focus:cursor-pointer focus:bg-[#F4F4F5] focus:text-[#D53948]'>
          <a
            onClick={() => {
              setHoveredRow(null)
            }}
          >
            Delete
          </a>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}