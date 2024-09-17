/* Inspiration: https://ui.shadcn.com/docs/components/data-table */
import PlusIcon from '@/assets/plus.svg?react'
import RefreshIcon from '@/assets/refresh.svg?react'
import SearchIcon from '@/assets/search.svg?react'
import Device from '@/components/device'
import { Button } from '@/components/shadcn/button'
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
import { TYPE_ICONS } from '@/lib/utils'
import {
  flexRender,
  getCoreRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { memo, useDeferredValue, useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'

import ActionMenu from './crud-menu'
import FilterMenu from './filter-menu'
import SortMenu from './sort-menu'
import { capacityAccessor } from './utils'

const dummy = [
  {
    id: 'm5gr84i9',
    system_name: "Nikoole's",
    hdd_capacity: 9999,
    type: 'windows',
  },
  {
    id: '3u1reuv4',
    system_name: 'Foota',
    hdd_capacity: 1.247e24,
    type: 'linux',
  },
  {
    id: 'derv1ws0',
    system_name: 'Oink',
    hdd_capacity: 1018,
    type: 'mac',
  },
]

const NoResults = memo(({ colSpan /* 'colSpan' does not change */ }) => (
  <TableRow>
    <TableCell colSpan={colSpan} className='h-24 text-center'>
      No results
    </TableCell>
  </TableRow>
))
NoResults.displayName = 'NoResults'

export default function DataTable({ data = dummy }) {
  const [globalFilter, setGlobalFilter] = useState('')
  const [columnFilters, setColumnFilters] = useState([])
  const [sorting, setSorting] = useState([])
  const resetAllFilters = () => {
    setSorting([])
    setColumnFilters([])
    setGlobalFilter('')
  }

  /* Two-way attachment of the `?q=[param]` as global filter input field */
  const [queryParams, setQueryParams] = useSearchParams()
  const deferredGlobalFilter = useDeferredValue(globalFilter)
  useEffect(() => {
    if (queryParams.get('q')) setGlobalFilter(decodeURI(queryParams.get('q')))
  }, [queryParams])
  useEffect(() => {
    if (deferredGlobalFilter !== '' && deferredGlobalFilter != queryParams.get('q'))
      setQueryParams({ q: encodeURI(globalFilter) })
  }, [deferredGlobalFilter])

  /*** Fields for determining action column visiblity ****/
  const [hoveredRow, setHoveredRow] = useState('')
  const [keepOpen, setKeepOpen] = useState(false)
  /*****/

  const filterOptions = Object.entries(TYPE_ICONS).map(([k, v]) => ({
    label: 'type',
    value: k,
    icon: v,
  }))

  const HIDDEN_COLUMNS = {
    id: false,
    type: false,
    system_name: false,
    hdd_capacity: false,
  }

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
        cell: ({ row }) => (
          <a onMouseLeave={() => setKeepOpen(false)}>
            <ActionMenu
              close={() => setHoveredRow(null)}
              keepOpen={() => setKeepOpen(true)}
              hoveredRow={hoveredRow}
              id={row.id}
            />
          </a>
        ),
      },
      /* Hidden columns. These are required for easier filtering / sorting */
      {
        id: 'id',
        accessorFn: ({ id }) => id,
      },
      {
        id: 'system_name',
        header: 'Name',
        accessorFn: ({ system_name }) => system_name,
      },
      {
        id: 'hdd_capacity',
        header: 'HDD Capacity',
        accessorFn: ({ hdd_capacity }) => hdd_capacity,
        filterFn: (row, colId, value) =>
          capacityAccessor(row.getValue(colId)).includes(value),
      },
      {
        id: 'type',
        header: 'Operating System',
        accessorFn: ({ type }) => (type == 'mac' ? 'macapple' : type),
        filterFn: (row, id, value) =>
          Array.isArray(value)
            ? value.length == 0 || // this resets all filters when we de-select manually/thru-the-ui
              value.some((v) =>
                v.toLowerCase().includes(row.getValue(id).toLowerCase()),
              )
            : value.includes(row.getValue(id)),
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
    getFilteredRowModel: getFilteredRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getSortedRowModel: getSortedRowModel(),
  })

  const filtrableData = table
    .getAllColumns()
    .filter(({ columnDef: { header } }) => typeof header === typeof '')

  return (
    <>
      <Toaster /> {/* Required to use `Toasts` */}
      <div className='flex items-center justify-between py-5 text-2xl font-medium'>
        Devices
        <Button
          className='bg-[#337AB7] hover:bg-[#0054AE]'
          onClick={() => alert('tbd!')}
        >
          <PlusIcon /> &nbsp; Add device
        </Button>
      </div>
      {/* Table Options */}
      <div className='flex flex-wrap justify-between gap-2 py-2'>
        <div className='flex flex-wrap gap-3'>
          <div className='flex w-80 items-center'>
            <SearchIcon className='absolute ml-3 h-3' />
            <Input
              autoFocus
              id='gFilter'
              value={globalFilter ?? ''}
              className='pl-8'
              placeholder='Search anything within all devices'
              onChange={(e) => setGlobalFilter(e.target.value.split())}
            />
          </div>
          {/* Filters */}
          {filtrableData
            .filter(({ columnDef: { id } }) => id === 'type')
            .map((col, i) => (
              <FilterMenu
                key={i}
                title='Device Type'
                column={col}
                options={filterOptions}
              />
            ))}
          {/* Sorting */}
          {filtrableData.map((col) => (
            <SortMenu
              id={col.columnDef.id}
              key={col.columnDef.id}
              title={col.columnDef.header}
              toggle={col.toggleSorting}
              tableSorting={sorting}
            />
          ))}
          {sorting?.length || globalFilter?.length || columnFilters?.length ? (
            <Button variant='ghost' onClick={resetAllFilters}>
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
            onClick={() => {
              alert('tbd!')
              resetAllFilters()
            }}
          >
            <RefreshIcon />
          </Button>
        </Tooltip>
      </div>
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map(({ id, headers }) => (
            <TableRow className='hover:bg-transparent' key={id}>
              {headers.map((header) => {
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
        <TableBody onMouseLeave={() => (keepOpen ? null : setHoveredRow(null))}>
          {!table.getRowModel().rows?.length ? (
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
    </>
  )
}
