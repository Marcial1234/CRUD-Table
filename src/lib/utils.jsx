import AppleIcon from '@/assets/apple.svg?react'
import LinuxIcon from '@/assets/linux.svg?react'
import WindowsIcon from '@/assets/windows.svg?react'
import axios from 'axios'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

const API = 'api'
const SECONDS = 1000
const { hostname, port, protocol } = window.location

export const api = axios.create({
  // Ideally this is passed from `.env` or other config variables
  baseURL: (() => {
    if (['4173', '5173'].includes(port) /* vite's default ports */) {
      console.log('Using port 3000 for API')
      return `${protocol}//${hostname}:3000/${API}`
    }
    if (port) {
      console.log(`Using defined port ${port} for API`)
      return `${protocol}//${hostname}:${port}/${API}`
    }
    console.log(`Using default application port for API`)
    return `${protocol}//${hostname}/${API}`
  })(),
  timeout: 5 * SECONDS,
})

export const TYPE_ICONS = Object.freeze({
  WINDOWS: <WindowsIcon />,
  LINUX: <LinuxIcon />,
  MAC: <AppleIcon />,
})

// Hopefully these don't need to be updated for 10+ years :)
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

// Note: Units will overflow 1024 past 1.208e24
export function calculateCapacity(hdd) {
  let counter = hdd
  let times = 0

  // Note: Bit-wise shifting is not stable past 2^32, division is stable to ~1.8e308
  while (counter / 1024 >= 1) {
    counter /= 1024
    times += 1
  }

  return `${Math.floor(counter * 100) / 100} ${CAPACITY_TIERS[times]}B`
}
