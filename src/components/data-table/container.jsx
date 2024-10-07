/* Inspiration: https://ui.shadcn.com/docs/components/data-table */
import PlusIcon from '@/assets/plus.svg?react'
import RefreshIcon from '@/assets/refresh.svg?react'
import SearchIcon from '@/assets/search.svg?react'
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
import Tooltip from '@/components/shadcn/tooltip'
import useQueryParam from '@/hooks/use-query-param'
import { MAX_CAPACITY, TYPE_ICONS } from '@/lib/utils'
import {
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { memo, useCallback, useMemo, useState } from 'react'
import { Toaster } from 'sonner'

import CrudDialog from './crud-dialogs'
import ActionMenu from './crud-menu'
import FilterMenu from './filter-menu'
import SortMenu from './sort-menu'
import { capacityAccessor } from './utils'

const DUMMY = Object.freeze([
  {
    id: 'm5gr84i9',
    system_name: "Nikoole's",
    hdd_capacity: 9999,
    type: 'windows',
  },
  {
    id: '3u1reuv4',
    system_name: 'DESKTOP-0VCBIFF',
    hdd_capacity: MAX_CAPACITY,
    type: 'linux',
  },
  {
    id: 'derv1ws0',
    system_name: 'Oink',
    hdd_capacity: 1018,
    type: 'mac',
  },
])

const NoResults = memo(({ colSpan /* 'colSpan' does not change */ }) => (
  <TableRow>
    <TableCell colSpan={colSpan} className='h-24 text-center'>
      No results
    </TableCell>
  </TableRow>
))
NoResults.displayName = 'NoResults'

const TYPE_FILTER_OPTIONS = Object.freeze(
  Object.entries(TYPE_ICONS).map(([k, v]) => ({
    value: k,
    icon: v,
  })),
)

export default function DataTable({ create, update, remove, reset, data = DUMMY }) {
  /*** Fields for determining action column visibility ***/
  const [hoveredRow, setHoveredRow] = useState('')
  const [persistUPPopover, setPersistUDPopover] = useState(false)
  /*****/

  /*** Modals/Dialogs open + information setters ***/
  const [dialog, setDialog] = useState({
    variant: 'remove',
    open: false,
    data: {
      /* id, name, type, capacity */
    },
  })
  /*****/

  /*** React/TanStack Table fields ***/
  const [sorting, setSorting] = useState([])
  const [columnFilters, setColumnFilters] = useState([])

  // Two-way attachment of the `?q=[param]` as global filter input field
  const [globalFilter, setGlobalFilter] = useQueryParam({
    paramKey: 'q',
    defaultValue: '',
    /* Defined per TanStack Table array-style filters. */
    setter: (v) => [v],
  })

  const resetAllFilters = useCallback(() => {
    setSorting([])
    setColumnFilters([])
    setGlobalFilter('')
  }, [])

  const HIDDEN_COLUMNS = Object.freeze({
    id: false,
    name: false,
    type: false,
    capacity: false,
  })

  const columns = useMemo(
    () => [
      {
        id: 'display',
        accessorFn: ({ system_name, hdd_capacity, type }) =>
          `${system_name} ${type} ${capacityAccessor(hdd_capacity)}`,
        header: () => <div className='text-left text-primary'>Device</div>,
        cell: ({
          row: {
            original: { system_name, hdd_capacity, type },
          },
        }) => (
          <div className='text-left font-medium'>
            <Device name={system_name} hdd={hdd_capacity} type={type} />
          </div>
        ),
      },
      {
        id: 'actions',
        cell: ({ row: { id, getValue } }) => (
          <Tooltip side='right' content='Modify Device'>
            <a onMouseLeave={() => setPersistUDPopover(false)}>
              <ActionMenu
                id={id}
                hoveredRow={hoveredRow}
                close={() => setHoveredRow(null)}
                keepOpen={() => setPersistUDPopover(true)}
                /* First set the dialog data so they don't flicker on open */
                openUpdateDialog={() => {
                  setDialog({
                    variant: 'update',
                    open: true,
                    data: {
                      id: getValue('id'),
                      name: getValue('name'),
                      type: getValue('type'),
                      capacity: getValue('capacity'),
                    },
                  })
                }}
                /* First set the dialog data so they don't flicker on open */
                openDeleteDialog={() => {
                  setDialog({
                    variant: 'remove',
                    open: true,
                    data: {
                      id: getValue('id'),
                      name: getValue('name'),
                    },
                  })
                }}
              />
            </a>
          </Tooltip>
        ),
      },
      /* Hidden columns. These are required for easier filtering / sorting */
      {
        id: 'id',
        accessorFn: ({ id }) => id,
      },
      {
        id: 'name',
        header: 'Name',
        accessorFn: ({ system_name }) => system_name,
      },
      {
        id: 'type',
        header: 'Operating System',
        accessorFn: ({ type }) => (type.toLowerCase() == 'mac' ? 'macapple' : type),
        filterFn: (row, id, value) =>
          Array.isArray(value)
            ? value.length == 0 || // this resets all filters when we de-select manually/thru-the-ui
              value.some((v) =>
                row.getValue(id).toLowerCase().includes(v.toLowerCase()),
              )
            : row.getValue(id).toLowerCase().includes(value.toLowerCase()),
      },
      {
        id: 'capacity',
        header: 'HDD Capacity',
        accessorFn: ({ hdd_capacity }) => hdd_capacity,
        filterFn: (row, colId, value) =>
          capacityAccessor(row.getValue(colId)).includes(value),
      },
    ],
    [hoveredRow],
  )

  const table = useReactTable({
    data,
    columns,
    state: {
      columnFilters,
      globalFilter,
      sorting,
    },
    initialState: {
      columnVisibility: HIDDEN_COLUMNS,
    },
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
  })

  const filtrableData = table
    .getAllColumns()
    .filter(({ columnDef: { header } }) => typeof header === typeof '')
  /*****/

  return (
    <>
      <CrudDialog
        allData={dialog}
        setOpen={(open) => setDialog((d) => ({ ...d, open }))}
        action={{ create, update, remove }}
      />
      {/* Title + Creation */}
      <div className='flex items-center justify-between pb-3 pt-2 text-2xl font-medium'>
        Devices
        <Button
          className='bg-[#337AB7] hover:bg-[#0054AE]'
          onClick={() => {
            setDialog({ variant: 'create', open: true, data: {} })
          }}
        >
          <PlusIcon /> &nbsp; Add device
        </Button>
      </div>
      {/* Table Options */}
      <div className='flex flex-row flex-nowrap items-end justify-between gap-2 py-2'>
        <div className='flex flex-wrap gap-3'>
          <div className='flex w-80 items-center'>
            <SearchIcon className='absolute ml-3 h-3' />
            <Input
              autoFocus
              autoComplete='on'
              maxLength='22' /* `m` overflows then */
              name='gFilter'
              value={globalFilter}
              className='pl-8'
              placeholder='Search anything within all devices'
              onChange={(e) => setGlobalFilter(e.target.value)}
            />
          </div>
          {/* Filters */}
          {filtrableData
            .filter(({ columnDef: { id } }) => id === 'type')
            .map((col) => (
              <FilterMenu
                key={col.id}
                column={col}
                title='Device Type'
                options={TYPE_FILTER_OPTIONS}
              />
            ))}
          {/* Sorting */}
          {filtrableData.map((col) => (
            <SortMenu
              id={col.columnDef.id}
              key={col.columnDef.id}
              title={col.columnDef.header}
              toggle={col.toggleSorting}
              sorting={sorting}
            />
          ))}
          {sorting.length || globalFilter[0] != '' || columnFilters.length ? (
            <Button
              variant='ghost'
              className='hover:bg-secondary-hover-background'
              onClick={resetAllFilters}
            >
              Reset All Filters
            </Button>
          ) : (
            ''
          )}
        </div>
        <Tooltip side='left' content='Reset All Table Changes'>
          <Button
            className='px-3'
            variant='ghost'
            onClick={async () => {
              resetAllFilters()
              await reset()
            }}
          >
            <RefreshIcon />
          </Button>
        </Tooltip>
      </div>
      <Table className='mb-3'>
        <TableHeader>
          {table.getHeaderGroups().map(({ id, headers }) => (
            <TableRow className='hover:bg-transparent' key={id}>
              {headers.map((header) => (
                <TableHead key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody
          onMouseLeave={() => (persistUPPopover ? null : setHoveredRow(null))}
        >
          {!table.getRowModel().rows.length ? (
            <NoResults colSpan={columns.length} />
          ) : (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
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
      <Toaster
        position='bottom-center'
        closeButton
        richColors
        toastOptions={{ ['duration']: 2_500 }}
      />
    </>
  )
}
