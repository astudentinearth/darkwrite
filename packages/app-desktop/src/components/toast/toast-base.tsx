
import { ReactNode } from 'react'

export default function ToastBase({children}: {children: ReactNode}) {
  return (
    <div className="flex flex-col rounded-xl select-none bg-background shadow-lg border w-full md:max-w-[364px] md:!w-[364px] p-2 justify-center">
      {children}
    </div>
  )
}
 // " rounded-lg w-full md:max-w-[364px] items-center"

 // "bgw-full md:w-[364px] rounded-xl flex-col gap-1"