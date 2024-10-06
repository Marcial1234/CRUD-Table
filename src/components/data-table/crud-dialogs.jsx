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
import { cn } from '@/lib/utils'
import { TriangleAlert } from 'lucide-react'
import { memo, useRef, useState } from 'react'
import { toast } from 'sonner'

const Options = memo(() =>
  /* This is constant JSX that doesn't need to be re-rendered */
  Object.keys(TYPE_ICONS).map((k, i) => (
    <option value={k} key={i}>
      {`${capitalize(k)} workstation`}
    </option>
  )),
)

const ValidationError = ({ message }) =>
  message ? (
    <div
      className='mt-1 text-red-300'
      /* only way I got them to align */
      style={{ display: 'ruby' }}
    >
      <TriangleAlert className='relative mr-1' width='12' />
      {message}
    </div>
  ) : (
    ''
  )

const VARIANTS = Object.freeze({
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

export default function CrudDialog({
  allData: {
    open,
    data: { id, name, type, capacity },
    variant,
  },
  setOpen,
  action,
}) {
  const lowerCaseVariant = variant.toLowerCase()

  const formRef = useRef(null)
  const inputRefs = useRef({
    /* name, type, capacity */
  })
  const [errors, setErrors] = useState({
    name: null,
    type: null,
    capacity: null,
  })
  const setNameError = (err) => setErrors((errs) => ({ ...errs, name: err }))
  const setCapacityError = (err) => setErrors((errs) => ({ ...errs, capacity: err }))
  const setTypeError = (err) => setErrors((errs) => ({ ...errs, type: err }))

  const submitOrFocusOnFirstInvalid = (e) => {
    e.preventDefault()

    if (Object.values(errors).filter(Boolean).length === 0)
      return formRef.current.requestSubmit()

    const firstInvalidField =
      Object.keys(errors)[Object.values(errors).findIndex(Boolean)]

    inputRefs.current[firstInvalidField].focus()
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        setOpen(o)
        setErrors({})
      }}
    >
      <DialogContent>
        <DialogTitle>{VARIANTS[variant].title}</DialogTitle>
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

                const formData = {}
                for (let [k, v] of new FormData(e.target).entries()) {
                  if (k === 'system_name') v = v.trim()
                  formData[k] = v
                }

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
                  name='system_name'
                  className={errors.name ? 'border-rose-300' : ''}
                  autoComplete='on'
                  defaultValue={name}
                  ref={(ref) => (inputRefs.current.name = ref)}
                  maxLength={96} // the length where the table starts to overflow at 50% on my screen WITHOUT wrap characters (i.e ' ', '-', etc)
                  /* Surface native invalid messages */
                  onInvalid={(e) => {
                    e.preventDefault()
                    return setNameError(e.target.validationMessage)
                  }}
                  /* Once validation passes the values *can* be directly attached to state - but that'd cause unnecessary re-renders */
                  onBlur={(e) => {
                    if (!open || !inputRefs.current.name.reportValidity()) return

                    const v = e.target.value
                    if (v === name) return

                    if (v.trim().length === 0)
                      return setNameError(
                        'Please add a non-whitespace value (A-Z, a-z, 0-9, special characters, etc)',
                      )

                    return setNameError(null)
                  }}
                  required
                />
                <ValidationError message={errors.name ?? ''} />
              </div>
              <div className='grid'>
                <span className='mb-1'>
                  Device Type <span className='text-red-600'>*</span>&nbsp;
                </span>
                <select
                  name='type'
                  defaultValue={type ?? ''}
                  ref={(ref) => (inputRefs.current.type = ref)}
                  onChange={() => setTypeError(null)}
                  /* Once validation passes the values *can* be directly attached to state - but that'd cause unnecessary re-renders */
                  onBlur={(_) => {
                    if (!open || !inputRefs.current.type.reportValidity()) return
                  }}
                  onInvalid={(e) => {
                    e.preventDefault()
                    return setTypeError(e.target.validationMessage)
                  }}
                  className={cn(
                    'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                    errors.type ? 'border-rose-300' : '',
                  )}
                  required
                >
                  <option className='hidden' disabled value=''>
                    Select type
                  </option>
                  <Options />
                </select>
                <ValidationError message={errors.type ?? ''} />
              </div>
              <div className='grid'>
                <span className='mb-1'>
                  HDD Capacity (in GB) <span className='text-red-600'>*</span>
                  &nbsp;
                </span>
                <Input
                  name='hdd_capacity'
                  className={errors.capacity ? 'border-rose-300' : ''}
                  autoComplete='on'
                  defaultValue={capacity ? Number(capacity) : ''}
                  type='number'
                  step='any' /* manual step validation `onBlur */
                  min={1}
                  ref={(ref) => (inputRefs.current.capacity = ref)}
                  /* Surface native invalid messages */
                  onInvalid={(e) => {
                    e.preventDefault()

                    const message = e.target.validationMessage
                    if (message !== 'Please enter a number.')
                      return setCapacityError(message)

                    return setCapacityError(
                      'Invalid exponential (correct format is `1e1`), or must be smaller than 1.208e24',
                    )
                  }}
                  /* Once validation passes the values *can* be directly attached to state - but that'd cause unnecessary re-renders */
                  onBlur={(e) => {
                    if (!open || !inputRefs.current.capacity.reportValidity()) return

                    const v = e.target.value
                    if (v === capacity) return

                    if (v > 1.208e24)
                      return setCapacityError(
                        // Documented on README
                        'Capacity cannot be bigger than 1.208e24 GB / 1024 GeB',
                      )

                    if (v % 1 !== 0)
                      return setCapacityError(
                        `Capacity must be in integers / round-numbers.
                         The two nearest valid numbers are
                         ${Math.floor(v)} and ${Math.ceil(v)}`,
                      )

                    return setCapacityError(null)
                  }}
                  required
                />
                <ValidationError message={errors.capacity ?? ''} />
              </div>
              <button className='hidden' onClick={submitOrFocusOnFirstInvalid}>
                silent submit
              </button>
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
              onClick={submitOrFocusOnFirstInvalid}
            >
              {VARIANTS[lowerCaseVariant].actionText}
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
              {VARIANTS[lowerCaseVariant].actionText}
            </DialogClose>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
