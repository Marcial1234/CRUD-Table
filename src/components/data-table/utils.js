import { calculateCapacity } from '@/lib/utils'

// Fine to define outside since it's used in a memoized variable
export const capacityAccessor = (hdd_capacity) =>
  `${hdd_capacity}GB ${calculateCapacity(hdd_capacity)}`
