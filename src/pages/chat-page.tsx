import { useState } from 'react'
import { ChatMessage } from '~/components/ChatMessage'
import { Button } from '~/components/ui/button'
import { Textarea } from '~/components/ui/textarea'

type Message = {
  role: 'user' | 'assistant'
  content: string
}

const ChatPage = () => {
  const [messageInput, setMessageInput] = useState('')
  const [streamMessage, setStreamMessage] = useState('')

  const handleSubmit = async () => {
    alert('chat')
  }
  const chatHistory: Message[] = [
    {
      role: 'assistant',
      content: 'Hello! How can I assist you today?',
    },
    {
      role: 'user',
      content: 'Can you explain what React is?',
    },
    {
      role: 'assistant',
      content:
        'React is a popular JavaScript library for building user interfaces. It was developed by Facebook and is widely used for creating interactive, efficient, and reusable UI components. React uses a virtual DOM (Document Object Model) to improve performance by minimizing direct manipulation of the actual DOM. It also introduces JSX, a syntax extension that allows you to write HTML-like code within JavaScript.',
    },
  ]
  return (
    <div className='flex flex-col flex-1'>
      <header className='flex items-center h-16 px-4 border-b'>
        <h1 className='ml-4 text-xl font-bold'>
          AI Chat Dashboard
        </h1>
      </header>
      <main className='flex-1 w-full p-4 overflow-auto'>
        <div className='max-w-screen-md pb-20 mx-auto space-y-4'>
          {chatHistory.map((message, index) => (
            <ChatMessage
              key={index}
              role={message.role}
              content={message.content}
            />
          ))}
        </div>
      </main>
      <footer className='p-4 border-t'>
        <div className='flex max-w-3xl gap-2 mx-auto'>
          <Textarea
            className='flex-1'
            placeholder='Type your message here...'
            rows={5}
            value={messageInput}
            onClick={(e) => setMessageInput(e.target.value)}
          />
          <Button onClick={handleSubmit} type='button'>
            Send
          </Button>
        </div>
      </footer>
    </div>
  )
}

export default ChatPage
