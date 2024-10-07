import FilterIcon from '@/assets/filter.svg?react'
import Badge from '@/components/shadcn/badge'
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
import Separator from '@/components/shadcn/separator'
import Tooltip from '@/components/shadcn/tooltip'
import { capitalize, cn } from '@/lib/utils'
import { CheckIcon } from '@radix-ui/react-icons'

function Skeleton({ title }) {
  return (
    <Button variant='outline' disabled className='border-dashed font-normal'>
      <FilterIcon className='mr-2' />
      Filter by {title}
    </Button>
  )
}

/* There is `state` here changing (`selectedValues`) outside of `useState` - using logic from ShadCn Form directly... */
export default function Menu({ column, title, options, disabled = false }) {
  if (disabled) return <Skeleton title={title} />

  const facets = column.getFacetedUniqueValues()
  const facetsKeys = Array.from(new Map([...facets]).keys())
  const selectedValues = new Set(column.getFilterValue())
  const btnWidth = 'w-60'
  const innerWidth = 'w-56'

  function SelectedTooltip({ children }) {
    const expansion = Array.from(selectedValues.values().map((v) => `'${v}'`))
    return (
      <Tooltip
        content={`${title}s: ${expansion.join(' and ')}
          ${options.length === selectedValues.size ? ' (noop)' : ''}`}
      >
        {children}
      </Tooltip>
    )
  }

  // Since we're mapping 'mac' => 'macapple', we need a partial search-match
  const findPartialKey = (value) =>
    facetsKeys.find((k) => k.toLowerCase().includes(value.toLowerCase()))

  return (
    <Popover>
      <PopoverTrigger asChild onMouseOver={(e) => e.preventDefault()}>
        <Button
          variant='outline'
          className={cn(
            `${btnWidth} border-dashed font-normal focus:border-none focus:bg-secondary-hover-background`,
            selectedValues.size > 0
              ? 'border-none bg-accent hover:bg-accent focus:bg-accent'
              : '',
          )}
        >
          <FilterIcon className='mr-2' />
          Filter
          {selectedValues.size > 0 ? (
            <>
              ed {title.split(' ')[title.split(' ').length - 1]}
              {selectedValues.size > 1 && 's'}
            </>
          ) : (
            <> by {title}</>
          )}
          {selectedValues.size > 0 && (
            <>
              <Separator orientation='vertical' className='mx-2 h-4' />
              <SelectedTooltip>
                <Badge className='rounded-sm px-1 font-normal lg:hidden'>
                  {selectedValues.size === options.length
                    ? 'Showing all'
                    : selectedValues.size}
                </Badge>
              </SelectedTooltip>
              <div className='hidden space-x-0.5 lg:flex lg:space-x-2'>
                {selectedValues.size > 2 ? (
                  <SelectedTooltip>
                    <Badge className='rounded-sm px-1 font-normal'>
                      {selectedValues.size === options.length
                        ? `Showing all (noop)`
                        : `${selectedValues.size} selected`}
                    </Badge>
                  </SelectedTooltip>
                ) : (
                  options
                    .filter((option) => selectedValues.has(option.value))
                    .map((option) => (
                      <Badge
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
      <PopoverContent className={`${btnWidth}`} align='start'>
        <Command
          loop={true}
          className={`${innerWidth} text-center`}
          filter={(value, search, keywords) => {
            const s = search.toLowerCase()
            let extendedValue = value.toLowerCase()
            if (keywords.length > 0) extendedValue += ` ${keywords.join(' ')}`

            if (extendedValue.includes(s)) return 1
            return 0
          }}
        >
          <CommandInput autoFocus placeholder={title} />
          <CommandList>
            <CommandEmpty>Invalid {title.toLowerCase()}</CommandEmpty>
            <CommandGroup>
              {options.map((option, i) => {
                let isSelected = selectedValues.has(option.value)
                return (
                  <CommandItem
                    key={i}
                    className='mx-1 flex items-center gap-1'
                    keywords={option.value.toLowerCase() === 'mac' ? ['apple'] : []}
                    onSelect={() => {
                      if (isSelected) selectedValues.delete(option.value)
                      else selectedValues.add(option.value)

                      const filters = selectedValues.length
                        ? undefined
                        : Array.from(selectedValues)
                      column.setFilterValue(filters)
                    }}
                  >
                    {/* Checked box with optionally invisible black check icon */}
                    <div
                      className={cn(
                        'mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary',
                        isSelected
                          ? 'bg-primary text-primary-foreground'
                          : 'opacity-50 [&_svg]:invisible',
                      )}
                    >
                      <CheckIcon className='h-4 w-4' />
                    </div>
                    {/* Actual Row */}
                    <>
                      <span className='mr-1'> {option.icon}</span>
                      {capitalize(option.value)}
                      {/* Faceted Value */}
                      &nbsp;
                      <span className='ml-auto flex h-4 w-4 items-center justify-center font-mono text-sm'>
                        {facets.get(findPartialKey(option.value))}
                      </span>
                    </>
                  </CommandItem>
                )
              })}
              {selectedValues.size > 0 && (
                <>
                  <CommandSeparator className={`mx-[0.34rem] mt-1`} />
                  <CommandItem
                    onSelect={() => column.setFilterValue(undefined)}
                    className='mx-1 mt-1 justify-center text-center '
                  >
                    Clear filters
                  </CommandItem>
                </>
              )}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
