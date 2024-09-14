import axios from 'axios'
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const api = axios.create({
  // baseURL: `${window.location.protocol}//${window.location.host}/api`,
  baseURL: `${window.location.protocol}//${window.location.hostname}:3000/api`,
})
