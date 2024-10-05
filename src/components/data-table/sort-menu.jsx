import Button from '@/components/shadcn/button'
import Tooltip from '@/components/shadcn/tooltip'
import { cn } from '@/lib/utils'
import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'

export default function Menu({ title, toggle, sorting, id, disabled = false }) {
  const [sort, setSort] = useState(0)

  useEffect(() => {
    if (disabled) return

    if (!sorting.length || (sorting.length == 1 && sorting[0].id !== id)) setSort(0)
  }, [id, disabled, sorting])

  const liteDirectionEnumMap = Object.freeze({
    0: 'Ascending',
    1: 'Descending',
    2: 'Remove / Reset sort',
  })
  const toggleSort = useCallback(() => {
    toggle()
    setSort((s) => (s + 1) % 3)
  }, [toggle])

  return (
    <Tooltip
      className='my-1'
      content={`Next sorting order: ${liteDirectionEnumMap[sort]}`}
    >
      <Button
        disabled={disabled}
        variant='outline'
        className={cn(
          'border-dashed font-normal focus:border-none focus:bg-secondary-hover-background',
          sort ? 'border-none bg-accent	focus:bg-accent' : '',
        )}
        onClick={toggleSort}
      >
        <span className='sr-only'>Open menu</span>
        {!sort && <ArrowUpDown width='15' className='mr-2' />}
        {sort === 1 && <ArrowDown width='15' className='mr-2' />}
        {sort === 2 && <ArrowUp width='15' className='mr-2' />}
        {title}
      </Button>
    </Tooltip>
  )
}
