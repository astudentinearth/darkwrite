import { cn } from "@/lib/utils";

export function Card({children, className}: React.HTMLAttributes<HTMLDivElement>){
  return <div className={cn("p-8 border-2 bg-background/40 rounded-2xl", className)}>
    {children}
  </div>
 
}