import Button from '@/components/shadcn/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/shadcn/dropdown-menu'
import { MoreHorizontal } from 'lucide-react'

// import * as api from '@/api/devices'
// import { useMutation } from '@tanstack/react-query'
// const updateDevice = (post) => {
//   const mutation = useMutation({
//     mutationFn: api.updateDevice,
//     // update ui
//     // onSucess: () =>
//     //   queryClient.revalidateQueries({ queryKey: ['getDeviceById', post.id] }),
//   })
//   return mutation.mutate(post)
// }

// const deleteDevice = (id) => {
//   const mutation = useMutation({
//     mutationFn: api.deleteDevice,
//     // update ui

//   })
//   return mutation.mutate()
// }

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
        <DropdownMenuItem
          onClick={() => {
            console.log('clicked')
            openDeleteDialog()
          }}
          className='text-red-600'
        >
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
