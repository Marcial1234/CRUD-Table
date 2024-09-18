import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/shadcn/dialog'

// export function CreateDialog({ open, close, action }) {
//   return <GenericDialog open={open} close={close} action={action} variant='update' />
// }

// export function UpdateDialog({ open, close, action }) {
//   return <GenericDialog open={open} close={close} action={action} variant='update' />
// }

// export function DeleteDialog({ open, close, action }) {
//   return <GenericDialog open={open} close={close} action={action} variant='remove' />
// }

export function GenericDialog({ open, close, action, variant }) {
  console.log(open, variant)

  /* Not an ideal pattern, but better than sending them individually */
  let [id, name, type, capacity] = []
  if (open) [id, name, type, capacity] = open

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
          onClick={() => {
            action(id)
            close()
          }}
        >
          &nbsp;Delete&nbsp;
        </DialogClose>
      ),
    },
  }

  return (
    <Dialog open={open}>
      <DialogContent /* close={close} */>
        <DialogTitle>oink</DialogTitle>
        <DialogHeader>
          <DialogDescription className='grid gap-2'>oink</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose onClick={close}>Cancel</DialogClose>
          oink
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
