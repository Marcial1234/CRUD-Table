import * as api from '@/api/devices'
import { DataTable, Skeleton } from '@/components/data-table'
import { useCallback, useEffect, useState } from 'react'
import { ErrorBoundary } from 'react-error-boundary'

export default function Page() {
  const [data, setData] = useState([])
  const [isFetching, setIsFetching] = useState(true)

  /* Initial fetch / get-all */
  const getAllDevices = async () => {
    const data = await api.getAllDevices()
    setData(data)
    setIsFetching(false)
  }
  useEffect(() => {
    getAllDevices()
  }, [])

  /**
   * Note: We can either call `.then(reset)` after all CRUD actions ('server-driver'),
   *       or make *optimistic* changes in the UI.
   *       Opting for the UI-driven approach
   */
  const create = useCallback(async (device) => {
    const newDevice = await api.createDevice(device)
    setData((d) => [newDevice, ...d])
  }, [])

  const update = useCallback(async (updatedDevice) => {
    const serverDevice = await api.updateDevice(updatedDevice)

    setData((oldData) =>
      oldData.map((d) => (d.id !== serverDevice.id ? d : { ...serverDevice })),
    )
  }, [])

  const remove = useCallback(async (id) => {
    await api.deleteDevice(id)
    setData((oldData) => oldData.filter(({ id: did }) => did !== id))
  }, [])

  const reset = useCallback(async () => {
    setIsFetching(true)
    const resetData = await api.resetDevices()
    setData(resetData)
    setIsFetching(false)
    return resetData
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
