import Tooltip from '@/components/shadcn/tooltip'
import { TYPE_ICONS, calculateCapacity, capitalize } from '@/lib/utils'

const expoOrCommaSeparated = (num) =>
  num > 1e9
    ? parseFloat(num).toExponential(2)
    : parseInt(num).toLocaleString('en-US')

export default function Device({ name, hdd, type }) {
  return (
    <Tooltip
      asChild={false}
      side='bottom'
      content={
        `Workstation '${name}' is a ${type} with ` +
        `${expoOrCommaSeparated(hdd)}GB of capacity`
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
