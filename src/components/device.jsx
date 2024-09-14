import WindowsIcon from '@/assets/Windows.svg?react'
import AppleIcon from '@/assets/apple.svg?react'
import LinuxIcon from '@/assets/linux.svg?react'

export default function Device({ system_name, hdd_capacity, type }) {
  const typeIcons = {
    WINDOWS: <WindowsIcon />,
    LINUX: <LinuxIcon />,
    MAC: <AppleIcon />,
  }

  // For consistency's sake
  function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase()
  }

  const capacityTiers = {
    0: 'G',
    1: 'T',
    2: 'P',
    3: 'E',
    4: 'Z',
    5: 'Y',
    6: 'B',
    7: 'Ge',
    // Hopely this doesn't need to be updated for 10+ years :)
  }

  // Note: Units will overflow 1028 past 1.247e24
  function calculateCapacity(hdd) {
    let counter = hdd
    let times = 0

    // Note: Bit-wise shifting is not stable past 2^32, division is stable to ~1e308
    while (counter / 1028 >= 1) {
      counter /= 1028
      times += 1
    }

    return `${Math.floor(counter * 100) / 100} ${capacityTiers[times]}`
  }

  return (
    <div className='grid'>
      <div className='flex items-center gap-1'>
        {typeIcons[type.toUpperCase()]} {system_name.toUpperCase()}
      </div>
      <span className='text-sm font-normal text-muted-foreground'>
        {capitalize[type.toUpperCase()]} Workstation -{' '}
        {calculateCapacity(Number(hdd_capacity))}B
      </span>
    </div>
  )
}
