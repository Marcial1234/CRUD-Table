import * as api from '@/api/devices'
import { DataTable, Skeleton } from '@/components/data-table'
import { useCallback, useDeferredValue, useEffect, useState } from 'react'
import { ErrorBoundary } from 'react-error-boundary'

export default function Page() {
  const [_data, setData] = useState([])
  const [isFetching, setIsFetching] = useState(true)

  const fetchAll = useCallback(() => {
    setIsFetching(true)
    api.getAllDevices().then((data) => {
      setData(data)
      setIsFetching(false)
    })
  }, [])
  useEffect(() => fetchAll, [fetchAll])

  // const {
  //   data,
  //   isLoading: dataIsLoading,
  //   isFetching: isFetching,
  //   refetch,
  // } = useQuery({
  //   queryKey: ['getAllDevices'],
  //   queryFn: api.getAllDevices,
  // })
  // useEffect(() => {
  //   if (data.length == 0) refetch()
  //   setData(data)
  // }, [data])

  /**
   * The standard approach to easily revalidate changing server data is to have the below in all mutations definitions,
   * but ommited in all the since it'd reset frontend CRUD changes as it'd refetch `devices.json` again.
   *
   * const queryClient = useQueryClient()
   * onSucess: () => queryClient.revalidateQueries({ queryKey: ['getAllDevices'] }),
   */
  // const cMutation = useMutation({
  //   mutationFn: api.createDevice,
  // })
  // const createDevice = (device) => cMutation.mutate(crypto.randomUUID(), device)
  // (new FormData(event.target))

  // const uMutation = useMutation({
  //   mutationFn: api.updateDevice,
  // })
  // const updateDevice = (id, device) => uMutation.mutate(id, device)

  // const dMutation = useMutation({
  //   mutationFn: api.deleteDevice,
  //   // onSucess: () => queryClient.revalidateQueries({ queryKey: ['getAllDevices'] }),
  // })
  // const deleteDevice = (id) => dMutation.mutate(id)

  return (
    <ErrorBoundary
      fallback={
        <div className='py-4'>Something went wrong... That's all we know</div>
      }
    >
      {/* <DataTable reset={refetch} /> */}
      {isFetching ? (
        <Skeleton />
      ) : (
        <DataTable
          data={_data}
          reset={fetchAll}
          // create={createDevice}
          // update={updateDevice}
          // remove={deleteDevice} /* `delete` is a reserved keyword */
        />
      )}
    </ErrorBoundary>
  )
}
