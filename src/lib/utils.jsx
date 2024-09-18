import WindowsIcon from '@/assets/Windows.svg?react'
import AppleIcon from '@/assets/apple.svg?react'
import LinuxIcon from '@/assets/linux.svg?react'
import axios from 'axios'
import {
  /* type ClassValue, */
  clsx,
} from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs /* : ClassValue[] */) {
  return twMerge(clsx(inputs))
}

export const api = axios.create({
  // Ideally this is passed from .env or other config variables
  baseURL: (() => {
    if (window.location.port == 5173 /* vite's default port */)
      return `${window.location.protocol}//${window.location.hostname}:3000/api`
    return `${window.location.protocol}//${window.location.hostname}:${window.location.port}/api`
  })(),
  timeout: 1000,
  // onDownloadProgress: (progressEvent) => {
  //   // Handle progress updates here
  //   const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total)
  //   console.log(`Download progress: ${progress}%`)
  // },
})

export const TYPE_ICONS = Object.freeze({
  WINDOWS: <WindowsIcon />,
  LINUX: <LinuxIcon />,
  MAC: <AppleIcon />,
})

// Hopely this doesn't need to be updated for 10+ years :)
const CAPACITY_TIERS = Object.freeze({
  0: 'G',
  1: 'T',
  2: 'P',
  3: 'E',
  4: 'Z',
  5: 'Y',
  6: 'B',
  7: 'Ge',
})

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
