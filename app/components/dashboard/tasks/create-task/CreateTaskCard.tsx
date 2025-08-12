import React, { useEffect } from 'react'
import { useNavigation } from 'react-router';
import { useCreateTaskContext } from '~/context/CreateTaskContext';

export const CreateTaskCard = ({ children }: { children: React.ReactNode }) => {
  const { step, handleReset } = useCreateTaskContext();

  const { state } = useNavigation();

  useEffect(() => {
    return () => {
      handleReset();
    }
  }, [])
  
  return (
    <div role='dialog' className={`relative ${ state !== 'idle' ? 'opacity-50' : '' }`}>
      <span role='heading' className="absolute -top-3.5 -translate-x-1/2 left-1/2 text-lg text-accent bg-violet-700 size-7.5 rounded-full place-objects-center">
        { step }
      </span>
      <div role='contentinfo' className="flex flex-col m-auto bg-white rounded-lg px-18 py-8 w-[650px] h-[725px] overflow-y-auto shadow-sm">
        { children }
      </div>
    </div>
  )
}
