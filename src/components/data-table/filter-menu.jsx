import FilterIcon from '@/assets/filter.svg?react'
import { Badge } from '@/components/shadcn/badge'
import Button from '@/components/shadcn/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/shadcn/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/shadcn/popover'
import { Separator } from '@/components/shadcn/separator'
import { capitalize, cn } from '@/lib/utils'
import { CheckIcon } from '@radix-ui/react-icons'

function Skeleton({ title }) {
  return (
    <Button variant='outline' disabled className='w-60 border-dashed font-normal'>
      <FilterIcon className='mr-2' />
      Filter by {title}
    </Button>
  )
}

export default function FacetedFilter({ column, title, options, disabled }) {
  if (disabled) return <Skeleton title={title} />

  const facets = column.getFacetedUniqueValues()
  const facetsKeys = Array.from(new Map([...facets].reverse()).keys())
  const selectedValues = new Set(column.getFilterValue())

  const findClosetKey = (value) =>
    facetsKeys.find((k) => k.toLowerCase().includes(value.toLowerCase()))

  return (
    <Popover>
      <PopoverTrigger asChild onMouseOver={(e) => e.preventDefault()}>
        <Button variant='outline' className='w-60 border-dashed font-normal'>
          <FilterIcon className='mr-2' />
          Filter by {title}
          {selectedValues?.size > 0 && (
            <>
              <Separator orientation='vertical' className='mx-2 h-4' />
              <Badge
                variant='secondary'
                className='rounded-sm px-1 font-normal lg:hidden'
              >
                {selectedValues.size}
              </Badge>
              <div className='hidden space-x-0.5 lg:flex lg:space-x-2'>
                {selectedValues.size > 2 ||
                (selectedValues.size == 2 && findClosetKey('win')) ? (
                  <Badge variant='secondary' className='rounded-sm px-1 font-normal'>
                    {selectedValues.size} selected
                  </Badge>
                ) : (
                  options
                    .filter((option) => selectedValues.has(option.value))
                    .map((option) => (
                      <Badge
                        variant='secondary'
                        key={option.value}
                        className='rounded-sm px-1 font-normal'
                      >
                        {capitalize(option.value)}
                      </Badge>
                    ))
                )}
              </div>
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className='max-w-60' align='start'>
        <Command className=' w-48 min-w-56 text-center'>
          <CommandInput autoFocus placeholder={title} />
          <CommandList className='pr-1'>
            <CommandEmpty>No results found</CommandEmpty>
            {options.map((option) => {
              let isSelected = selectedValues.has(option.value)
              return (
                <CommandItem
                  key={option.value}
                  onSelect={() => {
                    if (isSelected) selectedValues.delete(option.value)
                    else selectedValues.add(option.value)
                    const filters = selectedValues.length
                      ? undefined
                      : Array.from(selectedValues)
                    column.setFilterValue(filters)
                  }}
                  className='ml-1 flex items-center gap-1'
                >
                  <div
                    className={cn(
                      'mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary',
                      isSelected
                        ? 'bg-primary text-primary-foreground'
                        : 'opacity-50 [&_svg]:invisible',
                    )}
                  >
                    <CheckIcon className={cn('h-4 w-4')} />
                  </div>
                  <>
                    <span className='mr-1'> {option.icon}</span>
                    {capitalize(option.value)}
                    {findClosetKey(option.value) && (
                      <span className='ml-auto flex h-4 w-4 items-center justify-center font-mono text-sm'>
                        {facets.get(findClosetKey(option.value))}
                      </span>
                    )}
                  </>
                </CommandItem>
              )
            })}
            {selectedValues.size > 0 && (
              <>
                <CommandSeparator />
                <CommandGroup>
                  <CommandItem
                    onSelect={() => column.setFilterValue(undefined)}
                    className='justify-center text-center'
                  >
                    Clear filters
                  </CommandItem>
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
