import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/shadcn/dialog'
import { memo } from 'react'

export const GenericDialog = memo(({ open, setOpen, data, action, variant }) => {
  /* Not an ideal pattern, but better than sending them individually */
  let [id, name, type, capacity] = []
  if (open) [id, name, type, capacity] = data

  const variants = {
    create: {},
    update: {},
    remove: {
      title: 'Delete device?',
      description: (
        <>
          <span>
            You are about to delete the device:&nbsp;
            <span className='font-semibold'>{name}</span>.
          </span>
          <span>
            This action&nbsp;
            <u className='italic'>cannot</u>
            &nbsp;be undone.
          </span>
        </>
      ),
      close: (
        <DialogClose
          className='bg-red-600 text-white'
          onClick={() => action(id).then(setOpen(false))}
        >
          &nbsp;Delete&nbsp;
        </DialogClose>
      ),
    },
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogTitle>{variants['remove'].title}</DialogTitle>
        <DialogHeader>
          <DialogDescription className='grid gap-2'>
            {variants[variant].description}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose>Cancel</DialogClose>
          {variants[variant].close}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
})
