import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
} from '@/components/shadcn/dialog'
import Input from '@/components/shadcn/input'
import { TYPE_ICONS, capitalize } from '@/lib/utils'
import { memo } from 'react'

export const CrudDialog = memo(({ open, setOpen, data, action, variant }) => {
  /* Not an ideal pattern, but shorter than sending them individually */
  let [id, name, type, capacity] = ['', '', '', '']
  if (open && data) [id, name, type, capacity] = data

  const variants = Object.freeze({
    create: {
      title: 'Add Device',
      actionText: <span className='px-2.5'>Add</span>,
    },
    update: {
      title: 'Edit Device',
      actionText: <span className='px-2.5'>Edit</span>,
    },
    remove: {
      title: 'Delete Device?',
      actionText: <span className='px-1'>Delete</span>,
    },
  })

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogTitle>{variants[variant].title}</DialogTitle>
        <DialogDescription className='hidden'>
          {variant} dialog {/* `description` element avoids an a11y warning */}
        </DialogDescription>
        <div className='flex flex-col space-y-1.5 text-left text-sm text-muted-foreground'>
          {variant.toLowerCase() !== 'remove' ? (
            <form
              id='crud-form'
              className='grid gap-4'
              onSubmit={(e) => {
                e.preventDefault()

                const formData = {}
                for (let [k, v] of new FormData(e.target).entries()) {
                  formData[k] = v
                }
                action(formData).then(setOpen(false))
              }}
            >
              <input name='id' value={id} type='hidden' />
              <div>
                System Name <span className='text-red-600'>*</span>&nbsp;
                <Input
                  autoComplete='on'
                  defaultValue={name}
                  maxLength={58} // the length where the table starts to overflow at 50% on my screen
                  name='system_name'
                  required
                />
              </div>
              <div>
                HDD Capacity (in GB) <span className='text-red-600'>*</span>&nbsp;
                {/* Note: validation for 'max' will show as "Please enter a number */}
                <Input
                  autoComplete='on'
                  defaultValue={capacity ? Number(capacity) : ''}
                  max={1.247e24} // documented elsewhere: value that becomes higher than 1024 GeB
                  min={1}
                  name='hdd_capacity'
                  required
                  step={1}
                  type='number'
                />
              </div>
              <div>
                Device Type <span className='text-red-600'>*</span>&nbsp;
                {/* needs to be suffix '' */}
                <select
                  className='flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2'
                  defaultValue={type ?? ''}
                  name='type'
                  required
                >
                  <option className='hidden' disabled value=''>
                    Select type
                  </option>
                  {Object.keys(TYPE_ICONS).map((k, i) => (
                    <option className={k.toLowerCase()} value={k} key={i}>
                      {`${capitalize(k)} workstation`}
                    </option>
                  ))}
                </select>
              </div>
              <button className='hidden'> silent submit </button>
            </form>
          ) : (
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
          )}
        </div>
        <DialogFooter>
          <DialogClose>Cancel</DialogClose>
          <DialogClose
            className={`text-white ${
              variant.toLowerCase() == 'remove'
                ? 'bg-red-600 hover:bg-red-700'
                : 'bg-[#337AB7]  hover:bg-[#0054AE]'
            }`}
            onClick={(e) => {
              e.preventDefault()
              if (variant.toLowerCase() === 'remove')
                return action(id).then(setOpen(false))

              const form = document.getElementById('crud-form')
              if (form.reportValidity()) form.requestSubmit()
            }}
          >
            {variants[variant].actionText}
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
})
CrudDialog.displayName = 'CrudDialog'
export default CrudDialog
