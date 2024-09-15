/* Inspiration: https://ui.shadcn.com/docs/components/data-table */
import PlusIcon from '@/assets/plus.svg?react'
import RefreshIcon from '@/assets/refresh.svg?react'
import SearchIcon from '@/assets/search.svg?react'
import ActionMenu from '@/components/data-table/crud-menu'
import Device from '@/components/device'
import Button from '@/components/shadcn/button'
import Input from '@/components/shadcn/input'
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
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from '@tanstack/react-table'
import {
  /* useContext, */
  useEffect,
  useMemo,
  useState,
} from 'react'

const data = [
  {
    id: 'm5gr84i9',
    system_name: "Nikoole's",
    hdd_capacity: 9999,
    type: 'windows',
  },
  {
    id: '3u1reuv4',
    system_name: "Oink's",
    hdd_capacity: 1.247e24,
    type: 'linux',
  },
  {
    id: 'derv1ws0',
    system_name: "Oink's",
    hdd_capacity: 1018,
    type: 'mac',
  },
]

export default function DataTable() {
  const [globalFilter, setGlobalFilter] = useState('')

  /*** Fields for determining action column visiblity ****/
  const [hoveredRow, setHoveredRow] = useState() /* ID of row that's being hovered */
  const [keepOpen, setKeepOpen] = useState(false)
  /*****/

  const columns = useMemo(
    () => [
      {
        id: 'display',
        accessorFn: ({ system_name, hdd_capacity, type }) =>
          system_name + hdd_capacity + type,
        header: () => <div className='text-left text-primary'>Device</div>,
        cell: ({ row }) => (
          <div className='text-left font-medium'>
            <Device
              name={row.original['system_name']}
              hdd={row.original['hdd_capacity']}
              type={row.original['type']}
            />
          </div>
        ),
      },
      {
        id: 'actions',
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
    state: {
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    // sort later...
  })

  useEffect(() => document.getElementById('globalFilter').focus(), [])

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
      <div className='flex justify-between py-2'>
        <div className='flex gap-3'>
          <div className='flex items-center'>
            <SearchIcon className='absolute ml-3 h-3' />
            <Input
              autofocus
              id='globalFilter'
              value={globalFilter} /* TODO: get from query param */
              className='min-w-64 pl-8'
              placeholder='Search details within all devices'
              onChange={(e) => setGlobalFilter(e.target.value)}
            />
          </div>
          {/* <Input placeholder='Sort' />
          <Input placeholder='Filter' /> */}
          {/* Tooltip? Filter Table Content */}
        </div>
        <Tooltip content='Reset All Table Changes'>
          <Button className='px-3' variant='ghost' onClick={() => alert('tbd!')}>
            <RefreshIcon />
            {/*
             If we can figure it out...
              style={{
                transition: '.5s ease-in-out',
                rotate: '1.5turn',
              }}
            */}
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
