import NinjaOneIcon from '@/assets/ninjaone.svg?react'

export default function Layout({ children }) {
  return (
    <>
      <div className='min-h-14 bg-[#002A42]'></div>
      <div className='mx-6'>
        <NinjaOneIcon className='absolute top-3' style={{ zoom: 1.2 }} />
        {children}
      </div>
    </>
  )
}
