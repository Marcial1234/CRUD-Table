/* Stipped TS version of https://ui.shadcn.com/docs/components/data-table */
import { Button } from '@/components/shadcn/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/shadcn/dropdown-menu'
import { Input } from '@/components/shadcn/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/shadcn/table'
import Toaster from '@/components/shadcn/toaster'
import { StrategyContext } from '@/proviers/strategy'
import {
  // ColumnFiltersState,
  // SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { MoreHorizontal } from 'lucide-react'
import { useContext, useState } from 'react'

const data /* : Payment[] */ = [
  {
    id: 'm5gr84i9',
    device: '316',
    status: 'success',
    email: 'ken99@yahoo.com',
  },
  {
    id: '3u1reuv4',
    device: '242',
    status: 'success',
    email: 'Abe45@gmail.com',
  },
  {
    id: 'derv1ws0',
    device: '837',
    status: 'processing',
    email: 'Monserrat44@gmail.com',
  },
  {
    id: '5kma53ae',
    device: '874',
    status: 'success',
    email: 'Silas22@gmail.com',
  },
  {
    id: 'bhqecj4p',
    device: '721',
    status: 'failed',
    email: 'carmella@hotmail.com',
  },
]

const columns = [
  {
    accessorKey: 'device',
    header: () => <div className='text-left text-[#211F33]'>Device</div>,
    cell: ({ row }) => {
      const device = row.getValue('device')
      return <div className='text-left font-medium'>{device}</div>
    },
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: (/* { row } */) => {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant='ghost'
              className='text=[#211F33] h-8 w-8 p-0 hover:bg-[#E8E8EA] focus-visible:bg-[#E8E8EA]'
            >
              <span className='sr-only'>Open menu</span>
              <MoreHorizontal className='h-4 w-4' />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end'>
            <DropdownMenuItem
              className='focus:bg-[#F4F4F5]'
              // onClick={() => navigator.clipboard.writeText(payment.id)}
            >
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem className='text-[#D53948] focus:bg-[#F4F4F5] focus:text-[#D53948]'>
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

// TODO: When empty, persist styles
// hover background
export default function DataTableDemo() {
  const [sorting, setSorting] = useState(/* <SortingState> */ [])
  const [columnFilters, setColumnFilters] = useState(/* <ColumnFiltersState> */ [])
  const [rowSelection, setRowSelection] = useState({})

  // const strategy =
  useContext(StrategyContext)

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      rowSelection,
    },
  })

  return (
    <div className='w-full'>
      <div className='flex items-center py-4'>
        {/*
        <Input
          placeholder='Filter emails...'
          value={table.getColumn('email')?.getFilterValue() ?? ''}
          onChange={(event) =>
            table.getColumn('email')?.setFiltTperValue(event.target.value)
          }
          className='max-w-sm'
        />
         */}
      </div>
      <div className='rounded-md border'>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className='hover:bg-[#F4F4F5]'>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  className='hover:bg-[#F4F4F5]'
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell className='text-end' key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className='h-24 text-center'>
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <Toaster />
    </div>
  )
}
