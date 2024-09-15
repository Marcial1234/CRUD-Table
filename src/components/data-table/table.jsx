/* Inspiration: https://ui.shadcn.com/docs/components/data-table */
// import { Input } from '@/components/shadcn/input'
import PlusIcon from '@/assets/plus.svg?react'
import RefreshIcon from '@/assets/refresh.svg?react'
import ActionMenu from '@/components/data-table/crud-menu'
import Device from '@/components/device'
import Button from '@/components/shadcn/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/shadcn/table'
import Toaster from '@/components/shadcn/toaster'
import Tooltip from '@/components/shadcn/tooltip'
// import { StrategyContext } from '@/proviers/strategy'
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
import {
  /* useContext, */
  useMemo,
  useState,
} from 'react'

const data = [
  {
    id: 'm5gr84i9',
    device: <Device system_name="Nikoole's" hdd_capacity='9999' type='windows' />,
  },
  {
    id: '3u1reuv4',
    device: <Device system_name="Oink's" hdd_capacity={1.247e24} type='linux' />,
  },
  {
    id: 'derv1ws0',
    device: <Device system_name="Oink's" hdd_capacity='1018' type='mac' />,
  },
]

export default function DataTable() {
  const [sorting, setSorting] = useState(/* <SortingState> */ [])
  const [columnFilters, setColumnFilters] = useState(/* <ColumnFiltersState> */ [])
  const [rowSelection, setRowSelection] = useState({})
  const [hoveredRow, setHoveredRow] = useState() /* ID of row that's being hovered */
  const [keepOpen, setKeepOpen] = useState(false)

  const columns = useMemo(
    () => [
      {
        accessorKey: 'device',
        header: () => <div className='text-left text-primary'>Device</div>,
        cell: ({ row }) => (
          <div className='text-left font-medium'>{row.getValue('device')}</div>
        ),
      },
      {
        id: 'actions',
        enableHiding: false,
        cell: ({ row }) => (
          <a onMouseLeave={() => setKeepOpen(false)}>
            {/* // expand this comp to "History", if available */}
            <ActionMenu
              close={() => setHoveredRow(null)}
              keepOpen={() => setKeepOpen(true)}
              hoveredRow={hoveredRow}
              row={row}
            />
          </a>
        ),
      },
    ],
    [hoveredRow],
  )

  // const strategy =
  // useContext(StrategyContext)

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    state: {
      sorting,
      columnFilters,
      rowSelection,
    },
  })

  return (
    <>
      <div
        className='flex items-center justify-between py-5 text-2xl font-medium'
        style={{ zIndex: 1 }}
      >
        Devices
        <Button
          className='bg-[#337AB7] hover:bg-[#0054AE]'
          onClick={() => alert('tbd!')}
        >
          <PlusIcon /> &nbsp; Add device
        </Button>
      </div>
      <div className='flex justify-between py-1'>
        <div className='flex gap-3'>
          {/* <Input /> */}
          {/* <Droppdown> */}
          {/* <Droppdown> */}
          {/* <Droppdown> */}
          <div>many</div>
          <div>things</div>
          <div>on here</div>
        </div>
        <Tooltip content='Reset All Table Changes'>
          <Button
            asChild
            className='px-3'
            variant='ghost'
            onClick={() => alert('tbd!')}
          >
            <RefreshIcon />
          </Button>
        </Tooltip>
      </div>
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow className='hover:bg-transparent' key={headerGroup.id}>
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
        <TableBody
          onMouseLeave={() => {
            if (keepOpen) return
            setHoveredRow(null)
          }}
        >
          {!table.getRowModel().rows?.length ? (
            /* No Results */
            <TableRow>
              <TableCell colSpan={columns.length} className='h-24 text-center'>
                No results.
              </TableCell>
            </TableRow>
          ) : (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                {row.getVisibleCells().map((cell) => (
                  /* Actual row contents */
                  <TableCell
                    className='text-end'
                    key={cell.id}
                    onMouseEnter={() => setHoveredRow(cell.row.id)}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      <Toaster /> {/* Required to use `Toasts` */}
    </>
  )
}
