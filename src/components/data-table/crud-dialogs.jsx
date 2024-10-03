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
import { memo, useRef } from 'react'
import { toast } from 'sonner'

export const CrudDialog = memo(({ open, setOpen, data, action, variant }) => {
  /* Not an ideal pattern, but shorter than sending them individually */
  let [id, name, type, capacity] = ['', '', '', '']
  if (open && data) [id, name, type, capacity] = data
  const lowerCaseVariant = variant.toLowerCase()
  const formRef = useRef(null)
  let nameField,
    capacityField = []

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
          {lowerCaseVariant !== 'remove' ? (
            <form
              ref={formRef}
              className='grid gap-4'
              onSubmit={async (e) => {
                e.preventDefault()

                nameField = document.getElementById('system_name')
                capacityField = document.getElementById('hdd_capacity')

                const formData = {}
                for (let [k, v] of new FormData(e.target).entries()) {
                  formData[k] = v
                }

                // Manually validate for all-whitespace and decimals
                formData['system_name'] = formData['system_name'].trim()
                if (formData['system_name'].length === 0) {
                  nameField.setCustomValidity(
                    'Please add a non-whitespace value (A-Z, a-z, 0-9, all special characters, etc).',
                  )
                }
                const hdd = Number(formData['hdd_capacity'])
                if (hdd % 1 > 0) {
                  const [before, after] = [Math.floor(hdd), Math.ceil(hdd)]
                  capacityField.setCustomValidity(
                    `Capacity must be in integers / round-numbers. The two nearest valid numbers are ${before} and ${after}.`,
                  )
                }
                if (!formRef.current.reportValidity()) return

                await action[lowerCaseVariant](formData)
                if (lowerCaseVariant === 'create')
                  toast.success(
                    `Device "${formData['system_name']}" was successfully created`,
                  )
                else
                  toast.info(
                    /* All other fields BUT ID can change */
                    `Device with ID "${id}" was successfully updated`,
                  )
                setOpen(false)
              }}
            >
              <input name='id' value={id} type='hidden' />
              <div className='grid'>
                <span className='mb-1'>
                  System Name <span className='text-red-600'>*</span>&nbsp;
                </span>
                <Input
                  autoComplete='on'
                  defaultValue={name}
                  maxLength={96} // the length where the table starts to overflow at 50% on my screen WITHOUT wrappable characters (i.e ' ', '-', etc)
                  id='system_name'
                  onChange={(e) =>
                    document.getElementById('system_name').setCustomValidity('')
                  }
                  name='system_name'
                  required
                />
              </div>
              <div className='grid'>
                <span className='mb-1'>
                  HDD Capacity (in GB) <span className='text-red-600'>*</span>&nbsp;
                </span>
                <Input
                  autoComplete='on'
                  defaultValue={capacity ? Number(capacity) : ''}
                  max={1.208e24} // documented elsewhere: value that becomes higher than 1024 GeB
                  min={1}
                  name='hdd_capacity'
                  step='any'
                  type='number'
                  id='hdd_capacity'
                  onChange={(e) =>
                    document.getElementById('hdd_capacity').setCustomValidity('')
                  }
                  required
                />
              </div>
              <div className='grid'>
                <span className='mb-1'>
                  Device Type <span className='text-red-600'>*</span>&nbsp;
                </span>
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
                <u>
                  <i>cannot</i>
                </u>
                &nbsp;be undone.
              </span>
            </>
          )}
        </div>
        <DialogFooter>
          <DialogClose>Cancel</DialogClose>
          {lowerCaseVariant !== 'remove' ? (
            <DialogClose
              className='bg-[#337AB7] text-white  hover:bg-[#0054AE]'
              onClick={(e) => {
                e.preventDefault()
                if (formRef.current.reportValidity()) formRef.current.requestSubmit()
              }}
            >
              {variants[lowerCaseVariant].actionText}
            </DialogClose>
          ) : (
            <DialogClose
              className='bg-red-600 text-white hover:bg-red-700'
              onClick={async (e) => {
                e.preventDefault()
                await action[lowerCaseVariant](id)
                toast.warning(`Device "${name}" was successfully deleted`)
                setOpen(false)
              }}
            >
              {variants[lowerCaseVariant].actionText}
            </DialogClose>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
})
CrudDialog.displayName = 'CrudDialog'
export default CrudDialog
