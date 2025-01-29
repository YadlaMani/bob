import React from 'react'
import { Skeleton } from "@/components/ui/skeleton"


const Loading = () => {
  return (
    <div className='grid grid-cols-3 min-h-[100vh] max-h-[100vh] max-full max-w-full gap-3 m-4'>
        <Skeleton className=" rounded-lg" />
        <Skeleton className=" rounded-lg" />
        <Skeleton className=" rounded-lg" />
        <Skeleton className=" rounded-lg" />
        <Skeleton className=" rounded-lg" />
        <Skeleton className=" rounded-lg" />
    </div>

  )
}

export default Loading;