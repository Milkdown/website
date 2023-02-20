/* Copyright 2021, Milkdown by Mirone. */
import type { FC, ReactNode } from 'react'
import { Suspense } from 'react'
import HashLoader from 'react-spinners/HashLoader'

export const LazyLoad: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <Suspense fallback={
      <div className='w-full h-full flex items-center justify-center'>
        <HashLoader color='#81A1C1' />
      </div>
    }>
      {children}
    </Suspense>
  )
}
