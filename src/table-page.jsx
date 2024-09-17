import { getAllDevices } from '@/api/devices'
import { DataTable, Skeleton } from '@/components/data-table'
import { useQuery } from '@tanstack/react-query'
import { Suspense, useDeferredValue, useEffect, useState } from 'react'
import { ErrorBoundary } from 'react-error-boundary'

export default function Page() {
  const [_data, setData] = useState([])
  const deferredData = useDeferredValue(_data)

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ['getAllDevices'],
    queryFn: getAllDevices,
  })
  useEffect(() => {
    setData(data)
  }, [deferredData])
  // mutation.mutate(new FormData(event.target))

  return (
    <ErrorBoundary fallback={<div>Something went wrong... That's all we know</div>}>
      <Suspense fallback={<Skeleton />}>
        {isLoading || isFetching ? <Skeleton /> : <DataTable data={deferredData} />}
      </Suspense>
    </ErrorBoundary>
  )
}
