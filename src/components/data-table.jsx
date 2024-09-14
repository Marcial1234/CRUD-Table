/* Stipped TS version of https://ui.shadcn.com/docs/components/data-table */
// import { Button } from '@/components/shadcn/button'
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from '@/components/shadcn/dropdown-menu'
// import { Input } from '@/components/shadcn/input'
import ActionMenu from '@/components/__ud-actions-menu'
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
import { useContext, useMemo, useState } from 'react'

const data = [
  {
    id: 'm5gr84i9',
    device: '316',
  },
  {
    id: '3u1reuv4',
    device: '242',
  },
  {
    id: 'derv1ws0',
    device: '837',
  },
  {
    id: '5kma53ae',
    device: '874',
  },
  {
    id: 'bhqecj4p',
    device: '721',
  },
]

export default function DataTableDemo() {
  const [sorting, setSorting] = useState(/* <SortingState> */ [])
  const [columnFilters, setColumnFilters] = useState(/* <ColumnFiltersState> */ [])
  const [rowSelection, setRowSelection] = useState({})

  const [hoveredRow, setHoveredRow] = useState() /* ID of row that's being hovered */

  const columns = useMemo(
    () => [
      {
        accessorKey: 'device',
        header: () => <div className='text-left text-primary'>Device</div>,
        cell: ({ row }) => {
          const device = row.getValue('device')
          return <div className='text-left font-medium'>{device}</div>
        },
      },
      {
        id: 'actions',
        enableHiding: false,
        cell: ({ row }) => (
          <ActionMenu
            setHoveredRow={setHoveredRow}
            hoveredRow={hoveredRow}
            row={row}
          />
        ),
      },
    ],
    [hoveredRow],
  )

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
    <>
      {/* Clickable element to reset visibily hovered-row */}
      <a
        className='absolute left-0 top-0 min-h-[100%] min-w-[100%]'
        onMouseEnter={() => setHoveredRow(null)}
      >
        &nbsp;
      </a>{' '}
      <div>
        <div className='flex items-center py-2'>
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
            <TableHeader onMouseEnter={() => setHoveredRow(null)}>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
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
                    key={row.id}
                    data-state={row.getIsSelected() && 'selected'}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        className='text-end'
                        key={cell.id}
                        onMouseEnter={() => {
                          setHoveredRow(cell.row.id)
                        }}
                      >
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
    </>
  )
}
