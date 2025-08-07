import React, { useEffect } from 'react'
import { useCreateTaskContext } from '~/context/CreateTaskContext';

export const CreateTaskCard = ({ children }: { children: React.ReactNode }) => {
  const { step, handleReset } = useCreateTaskContext();

  useEffect(() => {
    return () => {
      handleReset();
    }
  }, [])
  
  return (
    <div className="flex flex-col m-auto bg-white rounded-lg px-18 py-8 w-[650px] h-[725px] shadow-sm relative">
      <span className="absolute -top-3.5 -translate-x-1/2 left-1/2 text-lg text-accent bg-violet-700 size-7.5 rounded-full place-objects-center">
        { step }
      </span>
      { children }
    </div>
  )
}
