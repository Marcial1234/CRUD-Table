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
// import Toaster from '@/components/shadcn/toaster'
import Tooltip from '@/components/shadcn/tooltip'
import { TYPE_ICONS } from '@/lib/utils'
import {
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { memo, useCallback, useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'

import CrudDialog from './crud-dialogs'
import ActionMenu from './crud-menu'
import FilterMenu from './filter-menu'
import SortMenu from './sort-menu'
import { capacityAccessor } from './utils'

const dummy = Object.freeze([
  {
    id: 'm5gr84i9',
    system_name: "Nikoole's",
    hdd_capacity: 9999,
    type: 'windows',
  },
  {
    id: '3u1reuv4',
    system_name: 'DESKTOP-0VCBIFF',
    hdd_capacity: 1.247e24,
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

export default function DataTable({
  setData,
  create,
  update,
  remove,
  reset,
  data = dummy,
}) {
  /**
   * Note: We can either call `.then(fetchAll)` after all CRUD actions ('server-driver'),
   *       or make *optimistic* changes in the UI.
   */

  const properCreate = useCallback(
    (device) =>
      create(device).then((newDevice) => setData((d) => [newDevice, ...d])),
    [create],
  )

  const properUpdate = useCallback(
    (updatedDevice) =>
      update(updatedDevice).then((ud) =>
        setData((d) => {
          const i = d.findIndex(({ id: did }) => did == ud.id)
          console.log(d[i])
          d[i] = Object.assign(d[i], ud)
          console.log(d[i])
          return [...d]
        }),
      ),
    [update],
  )

  const properRemove = useCallback(
    (id) =>
      remove(id).then(() =>
        setData((d) => {
          const i = d.findIndex(({ id: did }) => did == id)
          d.splice(i, 1)
          return [...d]
        }),
      ),
    [remove],
  )
  /*****/

  /*** Fields for determining action column visiblity ***/
  const [hoveredRow, setHoveredRow] = useState('')
  const [persistUPPopover, setPersistUDPopover] = useState(false)
  /*****/

  /*** Modals/Dialogs open + information setters ***/
  const [createOpen, setCreateOpen] = useState(false)

  const [updateOpen, setUpdateOpen] = useState(false)
  const [updateDiagData, setUpdateDiagData] = useState(
    /* <boolean | [id, name, type, capacity]> */ false,
  )

  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deleteDiagData, setDeleteDiagData] = useState(
    /* <boolean | [id, name, '', '']> */ false,
  )
  /*****/

  /*** React/TanStack Table fields ***/
  const [sorting, setSorting] = useState([])
  const [globalFilter, setGlobalFilter] = useState('')
  const [columnFilters, setColumnFilters] = useState([])

  const resetAllFilters = useCallback(() => {
    setSorting([])
    setGlobalFilter('')
    setColumnFilters([])
    setQueryParams((qps) => {
      if (qps.get('q')) qps.delete('q')
      return qps
    })
  }, [])

  const typeFilterOptions = Object.entries(TYPE_ICONS).map(([k, v]) => ({
    label: 'type',
    value: k,
    icon: v,
  }))

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
          <a onMouseLeave={() => setPersistUDPopover(false)}>
            <ActionMenu
              id={id}
              hoveredRow={hoveredRow}
              close={() => setHoveredRow(null)}
              keepOpen={() => setPersistUDPopover(true)}
              openUpdateDialog={() => {
                if (
                  !setUpdateDiagData([
                    getValue('id'),
                    getValue('name'),
                    getValue('type'),
                    getValue('capacity'),
                  ])
                )
                  setUpdateOpen(true)
              }}
              openDeleteDialog={() => {
                setDeleteDiagData([getValue('id'), getValue('name'), '', ''])
                setDeleteOpen(true)
              }}
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
                v.toLowerCase().includes(row.getValue(id).toLowerCase()),
              )
            : value.toLowerCase().includes(row.getValue(id).toLowerCase()),
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

  const filtrableData = useMemo(
    () =>
      table
        .getAllColumns()
        .filter(({ columnDef: { header } }) => typeof header === typeof ''),
    [table],
  )
  /*****/

  /*** Two-way attachment of the `?q=[param]` as global filter input field ***/
  const [queryParams, setQueryParams] = useSearchParams()
  useEffect(() => {
    if (queryParams.get('q')) setGlobalFilter(decodeURI(queryParams.get('q')))
  }, [queryParams])
  useEffect(() => {
    if (globalFilter !== '' && globalFilter !== queryParams.get('q'))
      setQueryParams({ q: encodeURI(globalFilter) })

    if (globalFilter == '') {
      setQueryParams((qps) => {
        qps.delete('q')
        return qps
      })
    }
  }, [globalFilter])
  /*****/

  return (
    <>
      {/* Dialogs */}
      <CrudDialog
        open={createOpen}
        setOpen={setCreateOpen}
        action={properCreate}
        variant='create'
      />
      <CrudDialog
        open={updateOpen}
        setOpen={setUpdateOpen}
        data={updateDiagData}
        action={properUpdate}
        variant='update'
      />
      <CrudDialog
        open={deleteOpen}
        setOpen={setDeleteOpen}
        data={deleteDiagData}
        action={properRemove}
        variant='remove'
      />
      {/* Title + Creation */}
      <div className='flex items-center justify-between pb-3 pt-2 text-2xl font-medium'>
        Devices
        <Button
          className='bg-[#337AB7] hover:bg-[#0054AE]'
          onClick={() => setCreateOpen(true)}
        >
          <PlusIcon /> &nbsp; Add device
        </Button>
      </div>
      {/* Table Options */}
      <div className='flex flex-row flex-nowrap items-center justify-between gap-2 py-2'>
        <div className='flex flex-wrap gap-3'>
          <div className='flex w-80 items-center'>
            <SearchIcon className='absolute ml-3 h-3' />
            <Input
              autoFocus
              autoComplete='on'
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
            .map((col) => (
              <FilterMenu
                key={col.id}
                column={col}
                title='Device Type'
                options={typeFilterOptions}
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
          {sorting?.length || globalFilter?.length || columnFilters?.length ? (
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
            onClick={() => reset().then(resetAllFilters)}
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
      {/* <Toaster /> */}
    </>
  )
}
