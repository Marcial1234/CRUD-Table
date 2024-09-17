// Hopely this doesn't need to be updated for 10+ years :)
const CAPACITY_TIERS = {
  0: 'G',
  1: 'T',
  2: 'P',
  3: 'E',
  4: 'Z',
  5: 'Y',
  6: 'B',
  7: 'Ge',
}

// For consistency's sake
export const capitalize = (string) =>
  string.charAt(0).toUpperCase() + string.slice(1).toLowerCase()

// Note: Units will overflow 1028 past 1.247e24
export function calculateCapacity(hdd, singleDigits = false) {
  let counter = hdd
  let times = 0

  // Note: Bit-wise shifting is not stable past 2^32, division is stable to ~1e308
  while (counter / 1028 >= 1) {
    counter /= 1028
    times += 1
  }
  if (singleDigits) return `${Math.floor(counter)} ${CAPACITY_TIERS[times]}B`

  return `${Math.floor(counter * 100) / 100} ${CAPACITY_TIERS[times]}B`
}

// Fine to define outside since it's used in a memoized variable
export const capacityAccessor = (hdd_capacity) =>
  `${hdd_capacity}GB ${calculateCapacity(hdd_capacity)}`
