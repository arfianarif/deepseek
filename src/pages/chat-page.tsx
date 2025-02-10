import { useLayoutEffect, useRef, useState } from 'react'
import { ChatMessage } from '~/components/ChatMessage'
import { Button } from '~/components/ui/button'
import { Textarea } from '~/components/ui/textarea'
import ollama from 'ollama'
import { ThoughtMessage } from '~/components/ThoughtMessage'
import { db } from '~/lib/dexie'
import { useParams } from 'react-router'
import { useLiveQuery } from 'dexie-react-hooks'

const ChatPage = () => {
  const scrollToBottomRef = useRef<HTMLDivElement>(null)
  const { threadId } = useParams()
  const [messageInput, setMessageInput] = useState('')
  const [streamedMessage, setStreamedMessage] = useState('')
  const [streamedThought, setStreamedThought] = useState('')

  const messages = useLiveQuery(
    () => db.getMessagesForThread(threadId as string),
    [threadId]
  )

  const handleSubmit = async () => {
    await db.createMessage({
      content: messageInput,
      role: 'user',
      thought: '',
      thread_id: threadId as string,
    })
    const stream = await ollama.chat({
      model: 'deepseek-r1:1.5b',
      messages: [
        {
          role: 'user',
          content: messageInput.trim(),
        },
      ],
      stream: true,
    })

    setMessageInput('')

    let fullContent = ''
    let fullThought = ''
    /**
     * 2 output modes
     * 1. thought mode
     * 2. answer mode
     */
    let outputMode: 'think' | 'response' = 'think'

    for await (const part of stream) {
      const messageContent = part.message.content
      if (outputMode === 'think') {
        if (
          !(
            messageContent.includes('<think>') ||
            messageContent.includes('</think>')
          )
        ) {
          fullThought += messageContent
        }
        setStreamedThought(fullThought)
        if (messageContent.includes('</think>')) {
          outputMode = 'response'
        }
      } else {
        fullContent += messageContent
        setStreamedMessage(fullContent)
      }
    }

    await db.createMessage({
      content: fullContent,
      role: 'assistant',
      thought: fullThought,
      thread_id: threadId as string,
    })

    setStreamedMessage('')
    setStreamedThought('')
  }

  const handleScrollToBottom = () =>
    scrollToBottomRef.current?.scrollIntoView()

  useLayoutEffect(() => {
    handleScrollToBottom()
  }, [streamedMessage, streamedThought, messages])

  return (
    <div className='flex flex-col flex-1'>
      <header className='flex items-center h-16 px-4 border-b'>
        <h1 className='ml-4 text-xl font-bold'>
          AI Chat Dashboard
        </h1>
      </header>
      <main className='flex-1 w-full p-4 overflow-auto'>
        <div className='max-w-screen-md pb-20 mx-auto space-y-4'>
          {messages?.map((message, index) => (
            <ChatMessage
              key={index}
              role={message.role}
              content={message.content}
              thought={message.thought}
            />
          ))}

          {!!streamedThought && (
            <ThoughtMessage thought={streamedThought} />
          )}

          {!!streamedMessage && (
            <ChatMessage
              role='assistant'
              content={streamedMessage}
            />
          )}
        </div>
        <div ref={scrollToBottomRef}></div>
      </main>
      <footer className='p-4 border-t'>
        <div className='flex max-w-3xl gap-2 mx-auto'>
          <Textarea
            className='flex-1'
            placeholder='Type your message here...'
            rows={3}
            value={messageInput}
            onChange={(e) =>
              setMessageInput(e.target.value)
            }
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
