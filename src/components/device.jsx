import Tooltip from '@/components/shadcn/tooltip'
import { TYPE_ICONS, calculateCapacity, capitalize } from '@/lib/utils'

const expoOrLocale = (num) =>
  num > 1e9 ? Number.parseFloat(num).toExponential(2) : num.toLocaleString()

export default function Device({ name, hdd, type }) {
  return (
    <Tooltip
      asChild={false}
      side='bottom'
      content={
        `Workstation '${name}' is a ${type} with ` +
        `${expoOrLocale(hdd)}GB of capacity`
      }
    >
      <div className='grid'>
        <div className='flex items-center gap-1'>
          {TYPE_ICONS[type?.toUpperCase()]} {name?.toUpperCase()}
        </div>
        <span className='text-sm font-normal text-muted-foreground'>
          {`${capitalize(type?.toUpperCase())} Workstation - ` +
            `${calculateCapacity(Number(hdd))}`}
        </span>
      </div>
    </Tooltip>
  )
}
