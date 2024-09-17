import PlusIcon from '@/assets/plus.svg?react'
import RefreshIcon from '@/assets/refresh.svg?react'
import SearchIcon from '@/assets/search.svg?react'
import Button from '@/components/shadcn/button'
import Input from '@/components/shadcn/input'
import Skeleton from '@/components/shadcn/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/shadcn/table'

import FilterMenu from './filter-menu'
import SortMenu from './sort-menu'

export default function () {
  return (
    <>
      <div className='flex items-center justify-between py-5 text-2xl font-medium'>
        Devices
        <Button className='animate-pulse bg-muted text-transparent'>
          + &nbsp; Add device
        </Button>
      </div>
      {/* Table Options */}
      <div className='flex flex-wrap justify-between gap-2 py-2'>
        <div className='flex flex-wrap gap-3'>
          <div className='flex flex-col space-y-3'>
            <div className='flex w-80 animate-pulse items-center bg-muted text-transparent'>
              <Input className='bg-muted pl-8 disabled:opacity-0' disabled />
            </div>
          </div>
          <FilterMenu disabled title='Bananas' />
          <SortMenu disabled={true} title='Snails' />
          <SortMenu disabled={true} title='Coconuts' />
        </div>
        <div className='animate-pulse bg-muted'>
          <Button className='px-3' variant='ghost' disabled>
            &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
          </Button>
        </div>
      </div>
      <Table>
        {/* actual table */}
        <TableHeader>
          <TableRow>
            {Array.from({ length: 4 }, (_, i) => (
              <TableHead key={i}>
                {i === 0 ? <Skeleton className='h-4 w-[10rem]' /> : null}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody className='max-w-10'>
          {Array.from({ length: 10 }, (_, j) => (
            <TableRow key={j}>
              {Array.from({ length: 4 }, (_, i) => (
                <TableCell key={i}>
                  <Skeleton className='h-4 w-[10rem]' />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  )
}
