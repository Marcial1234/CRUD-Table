import Icon from '@/assets/ninja.svg?react'

export default function Layout({ children }) {
  return (
    <>
      <div className='flex min-h-14 min-w-full items-center justify-between bg-[#002A42] pl-10'>
        <Icon className='scale-125' />
      </div>
      <div className='mx-6'>{children}</div>
    </>
  )
}
