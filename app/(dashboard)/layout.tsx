import TopNavbar from '@/app/layouts/navbars/TopNavbar'
import React from 'react'

export default function layout({children}:{children: React.ReactNode}) {
  return (
    <div className='flex flex-col gap-4'>
      <TopNavbar/>
      <div className='m-5'>
         {children}
      </div>
      
    </div>
  )
}