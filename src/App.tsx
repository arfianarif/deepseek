import { useState } from 'react'
import { ChatSidebar } from '~/components/ChatSidebar'
import { SidebarProvider } from '~/components/ui/sidebar'
import ChatPage from './pages/chat-page'
import { Route, Routes } from 'react-router'

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  return (
    <SidebarProvider
      open={sidebarOpen}
      onOpenChange={setSidebarOpen}
    >
      <div className='flex w-full h-screen bg-background'>
        <ChatSidebar />
        <Routes>
          <Route
            path='/thread/:threadId'
            element={<ChatPage />}
          />
        </Routes>
      </div>
    </SidebarProvider>
  )
}
