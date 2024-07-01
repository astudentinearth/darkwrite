import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable'

function App() {

  return (
    <div className='w-full h-full'>
      <ResizablePanelGroup direction='horizontal' className='w-full h-full bg-slate-500'>
        <ResizablePanel defaultSize={20} maxSize={30} minSize={10}>
          <div className='bg-background h-full'>
            <h1>Sidebar</h1>
          </div>
        </ResizablePanel>
        <ResizableHandle></ResizableHandle>
        <ResizablePanel maxSize={100}>
          <div className='bg-view-1 h-full'>Editor</div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  )
}

export default App
