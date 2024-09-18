import * as api from '@/api/devices'
import { DataTable, Skeleton } from '@/components/data-table'
import { useCallback, useEffect, useState } from 'react'
import { ErrorBoundary } from 'react-error-boundary'

export default function Page() {
  const [data, setData] = useState([])
  const [isFetching, setIsFetching] = useState(true)

  const fetchAll = useCallback(() => {
    setIsFetching(true)
    api.getAllDevices().then((data) => {
      setData(data)
      setIsFetching(false)
    })
  }, [])
  useEffect(() => {
    fetchAll()
  }, [])

  const resetDevices = () => {
    setIsFetching(true)
    return api.resetDevices().then((data) => {
      setIsFetching(false)
      setData(data)
    })
  }

  return (
    <ErrorBoundary
      fallback={
        <div className='py-4'>Something went wrong... That's all we know</div>
      }
    >
      {isFetching ? (
        <Skeleton />
      ) : (
        <DataTable
          data={data}
          setData={setData}
          remove={api.deleteDevice}
          reset={resetDevices}
          // Commented out below if interested on 'server-driven' approach instead
          // Currently, we don't handle backend errors.
          //
          // create={(device) => api.createDevice(device).then(fetchAll)}
          // update={(device) => api.updateDevice(device).then(fetchAll)}
          // remove={(id) => api.deleteDevice(id).then(fetchAll)}
          // reset={(id) => api.resetDevices(id).then(fetchAll)}
        />
      )}
    </ErrorBoundary>
  )
}
