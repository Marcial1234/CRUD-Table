import Button from '@/components/shadcn/button'
import Tooltip from '@/components/shadcn/tooltip'
import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react'
import { useEffect, useState } from 'react'

export default function Menu({ title, toggle, tableSorting, id, disabled }) {
  const [sort, setSorting] = useState(0)

  useEffect(() => {
    if (disabled) return
    if (
      !tableSorting.length ||
      (tableSorting.length == 1 && tableSorting[0].id !== id)
    ) {
      setSorting(0)
    }
  })

  const liteDirectionEnumMap = {
    0: 'Ascending',
    1: 'Descencing',
    2: 'Remove filter',
  }
  const toggleSort = () => {
    toggle()
    setSorting((d) => (d + 1) % 3)
  }

  return (
    <Tooltip content={`Next sorting order: ${liteDirectionEnumMap[sort]}`}>
      <Button
        disabled={disabled}
        variant='outline'
        className='border-dashed font-normal focus:bg-secondary-hover-background focus:ring-2 focus:ring-ring focus:ring-offset-2'
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
