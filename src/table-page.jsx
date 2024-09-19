import * as api from '@/api/devices'
import { DataTable, Skeleton } from '@/components/data-table'
import { useCallback, useEffect, useState } from 'react'
import { ErrorBoundary } from 'react-error-boundary'

export default function Page() {
  const [data, setData] = useState([])
  const [isFetching, setIsFetching] = useState(true)

  /* Initial fetch / get-all */
  useEffect(() => {
    api.getAllDevices().then((data) => {
      setData(data)
      setIsFetching(false)
    })
  }, [])

  /**
   * Note: We can either call `.then(reset)` after all CRUD actions ('server-driver'),
   *       or make *optimistic* changes in the UI.
   *       Opting for the UI-driven approach
   */
  const create = useCallback(
    (device) =>
      api
        .createDevice(device)
        .then((newDevice) => setData((d) => [newDevice, ...d])),
    [],
  )

  const update = useCallback(
    (updatedDevice) =>
      api.updateDevice(updatedDevice).then((ud) =>
        setData((d) => {
          const i = d.findIndex(({ id: did }) => did == ud.id)
          d[i] = Object.assign(d[i], ud)
          return [...d]
        }),
      ),
    [],
  )

  const remove = useCallback(
    (id) =>
      api.deleteDevice(id).then(() =>
        setData((d) => {
          const i = d.findIndex(({ id: did }) => did == id)
          d.splice(i, 1)
          return [...d]
        }),
      ),
    [],
  )

  const reset = useCallback(() => {
    setIsFetching(true)
    return api.resetDevices().then((resetData) => {
      setData(resetData)
      setIsFetching(false)
      return resetData
    })
  }, [])

  return (
    <ErrorBoundary
      fallback={
        <div className='py-4'>Something went wrong... That&apos;s all we know</div>
      }
    >
      {isFetching ? (
        <Skeleton />
      ) : (
        <DataTable
          data={data}
          create={create}
          update={update}
          remove={remove}
          reset={reset}
          // Commented out below if interested on 'server-driven' approach instead
          // Currently, we don't handle backend errors.
          //
          // create={(device) => api.createDevice(device).then(reset)}
          // update={(device) => api.updateDevice(device).then(reset)}
          // remove={(id) => api.deleteDevice(id).then(reset)}
          // reset={(id) => api.resetDevices(id)}
        />
      )}
    </ErrorBoundary>
  )
}
