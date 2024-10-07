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
import { MAX_CAPACITY, calculateCapacity } from '@/lib/utils'
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
    <div className='mt-1 flex text-red-300'>
      <TriangleAlert className='relative top-[-1px] mr-1' width='12' />
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
  const inputRefs = useRef(
    /* current: */ {
      /* name, type, capacity */
    },
  )
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

  const chosenCapacity = inputRefs.current.capacity || { value: capacity }

  const showCapacityConversion = () => {
    const val = chosenCapacity
    if (val && val.value && val.value > 0 && val.value % 1 === 0) return true
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
                  maxLength={96} // the length where the table starts to overflow at 50% on my screen WITHOUT wrap characters (i.e ' ', '-', etc)
                  required
                  ref={(ref) => (inputRefs.current.name = ref)}
                  placeholder='A very creative name...'
                  /* Surface native invalid messages */
                  onInvalid={(e) => {
                    e.preventDefault()
                    return setNameError(e.target.validationMessage)
                  }}
                  // UI edge case: Clicking the 'X' from dialog OR the `actionText` button will trigger `onBlur`.
                  // Only this field has this as it is auto-focused due to being the first.
                  // Note: *very brittle*
                  onBlur={(e) => {
                    const target = e.nativeEvent.relatedTarget
                    if (
                      target &&
                      (target.className.includes(
                        'absolute',
                        /* 'X' DialogClose button */
                      ) ||
                        target.className.includes(
                          'rounded-md p-2',
                          /* `actionText` button */
                        ))
                    )
                      return e.preventDefault()

                    inputRefs.current.name.reportValidity()
                  }}
                  onChange={(e) => {
                    if (!open || !inputRefs.current.name.reportValidity()) return

                    const v = e.target.value
                    if (v === name) return

                    if (v.trim().length === 0)
                      return setNameError(
                        'Please add a non-whitespace value (A-Z, a-z, 0-9, special characters, etc)',
                      )

                    return setNameError(null)
                  }}
                />
                <ValidationError message={errors.name} />
              </div>
              <div className='grid'>
                <span className='mb-1'>
                  Device Type <span className='text-red-600'>*</span>&nbsp;
                </span>
                <select
                  name='type'
                  defaultValue={type ?? ''}
                  required
                  ref={(ref) => (inputRefs.current.type = ref)}
                  onBlur={() => inputRefs.current.type.reportValidity()}
                  onChange={() => {
                    if (errors.type) setTypeError(null)
                  }}
                  /* Surface native invalid messages */
                  onInvalid={(e) => {
                    e.preventDefault()
                    return setTypeError(e.target.validationMessage)
                  }}
                  className={cn(
                    'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                    errors.type ? 'border-rose-300' : '',
                  )}
                >
                  <option className='hidden' disabled value=''>
                    Select type
                  </option>
                  <Options />
                </select>
                <ValidationError message={errors.type} />
              </div>
              <div className='grid'>
                <span className='mb-1'>
                  HDD Capacity (in GB) <span className='text-red-600'>*</span>
                  &nbsp;
                </span>
                <div className='grid items-center justify-items-end'>
                  <Input
                    name='hdd_capacity'
                    className={errors.capacity ? 'border-rose-300' : ''}
                    autoComplete='on'
                    defaultValue={capacity ? Number(capacity) : ''}
                    type='number'
                    step='any' /* manual step validation `onChange */
                    min={1}
                    required
                    ref={(ref) => (inputRefs.current.capacity = ref)}
                    placeholder='Values will be converted to higher units'
                    /* Surface native invalid messages */
                    onInvalid={(e) => {
                      e.preventDefault()

                      const message = e.target.validationMessage
                      if (message !== 'Please enter a number.')
                        return setCapacityError(message)

                      return setCapacityError(
                        `Invalid exponential format (e.g. "1e1'), or too big. Values must be smaller than ~1.8e+308`,
                      )
                    }}
                    onBlur={() => inputRefs.current.capacity.reportValidity()}
                    onChange={(e) => {
                      if (!open || !inputRefs.current.capacity.reportValidity())
                        return

                      const v = Number(e.target.value)
                      if (v === capacity) return

                      if (v > MAX_CAPACITY)
                        return setCapacityError(
                          `Capacity cannot be bigger than ${MAX_CAPACITY} GB / 1024 GeB`,
                        )

                      if (v % 1 !== 0)
                        return setCapacityError(
                          `Capacity must be in integers / round-numbers.
                         The two nearest valid numbers are
                         ${Math.floor(v)} and ${Math.ceil(v)}`,
                        )

                      return setCapacityError(null)
                    }}
                  />
                  <span
                    className={cn(
                      'absolute right-14 text-gray-400',
                      !showCapacityConversion() && 'hidden',
                    )}
                  >
                    {chosenCapacity &&
                    chosenCapacity.value &&
                    chosenCapacity.value > 1023 ? (
                      chosenCapacity.value < MAX_CAPACITY ? (
                        <>
                          (equivalent to&nbsp;
                          {calculateCapacity(chosenCapacity.value)})
                        </>
                      ) : (
                        <> {chosenCapacity.value < 1e35 ? '(not supported)' : ''} </>
                      )
                    ) : (
                      ''
                    )}
                  </span>
                </div>
                <ValidationError message={errors.capacity} />
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
              onClick={(e) => {
                for (const ref of Object.values(inputRefs.current)) {
                  /* UI edge case: Clicking this btn will not force validate the entire form. */
                  ref.reportValidity()
                }
                submitOrFocusOnFirstInvalid(e)
              }}
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
