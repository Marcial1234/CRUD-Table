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

export default function Loader() {
  return (
    <>
      <div className='flex items-center justify-between pb-3 pt-2 text-2xl font-medium'>
        Devices
        <Button disabled className='animate-pulse bg-muted text-transparent'>
          + &nbsp; Add device
        </Button>
      </div>
      {/* Table Options */}
      <div className='flex flex-row flex-nowrap items-end justify-between gap-2 py-2'>
        <div className='flex flex-wrap gap-3'>
          <div className='flex flex-col space-y-3'>
            <div className='flex w-80 animate-pulse items-center bg-muted text-transparent'>
              <Input
                id='skeleton'
                className='bg-muted pl-8 disabled:opacity-0'
                disabled
              />
            </div>
          </div>
          <FilterMenu disabled title='Bananas' />
          <SortMenu disabled title='Snails' />
          <SortMenu disabled title='Coconuts' />
        </div>
        <div className='animate-pulse bg-muted'>
          <Button className='px-3' variant='ghost' disabled>
            &nbsp; &nbsp; &nbsp;
          </Button>
        </div>
      </div>
      <Table>
        {/* actual table */}
        <TableHeader>
          <TableRow>
            {Array.from({ length: 4 }, (_, i) => (
              <TableHead key={i}>
                {i === 0 ? <Skeleton className='h-4 w-40' /> : null}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody className='max-w-10'>
          {Array.from({ length: 10 }, (_, j) => (
            <TableRow key={j}>
              {Array.from({ length: 4 }, (_, i) => (
                <TableCell key={i}>
                  <Skeleton className='h-4 w-40' />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  )
}
