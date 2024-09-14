/* TODO: make custom VSCode Pluggin for this */
import NinjaOneIcon from '@/assets/ninjaone.svg?react'

export default function Layout({ children }) {
  return (
    <>
      <div className='min-h-16 bg-[#002A42]'>&nbsp;</div>
      <div className='mx-6'>
        <NinjaOneIcon className='absolute top-5' />
        {children}
      </div>
    </>
  )
}
