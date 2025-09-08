import React, { useState, useRef, useEffect } from 'react'
import { useParams, useNavigate } from "react-router"
import { IoChevronBack, IoSend, IoAttach } from 'react-icons/io5'

// Mock data types
interface Message {
  id: string
  text: string
  timestamp: Date
  isFromMe: boolean
  status: 'sent' | 'delivered' | 'read'
}

interface ChatUser {
  id: string
  name: string
  avatar?: string
  isOnline: boolean
}

interface ChatData {
  id: string
  user: ChatUser
  messages: Message[]
  bookTitle?: string
}

// Mock users data
const mockUsers: Record<string, ChatUser> = {
  '1': {
    id: '1',
    name: 'Jane Walker',
    isOnline: true
  },
  '2': {
    id: '2', 
    name: 'Jane Walker',
    isOnline: true
  },
  '3': {
    id: '3',
    name: 'John Smith',
    isOnline: false
  },
  '4': {
    id: '4',
    name: 'Sarah Johnson',
    isOnline: true
  }
}

// Mock chat data
const mockChatData: Record<string, ChatData> = {
  '1': {
    id: '1',
    user: mockUsers['1'],
    bookTitle: 'Dune',
    messages: [
      {
        id: 'msg1',
        text: 'Hi',
        timestamp: new Date('2025-03-13T10:30:00'),
        isFromMe: false,
        status: 'read'
      },
      {
        id: 'msg2',
        text: 'Hello!',
        timestamp: new Date('2025-03-13T10:31:00'),
        isFromMe: true,
        status: 'read'
      },
      {
        id: 'msg3',
        text: "I'll buy it!!!",
        timestamp: new Date('2025-03-13T10:32:00'),
        isFromMe: true,
        status: 'read'
      },
      {
        id: 'msg4',
        text: 'Deal then! Thanks!)',
        timestamp: new Date('2025-03-21T21:34:00'),
        isFromMe: false,
        status: 'read'
      },
      {
        id: 'msg5',
        text: 'Got it',
        timestamp: new Date('2025-03-21T21:35:00'),
        isFromMe: true,
        status: 'delivered'
      },
      {
        id: 'msg6',
        text: 'Thanks!)',
        timestamp: new Date('2025-03-21T21:36:00'),
        isFromMe: true,
        status: 'sent'
      }
    ]
  },
  '2': {
    id: '2',
    user: mockUsers['2'],
    bookTitle: 'Foundation',
    messages: [
      {
        id: 'msg7',
        text: 'Is this book still available?',
        timestamp: new Date('2025-03-20T15:22:00'),
        isFromMe: true,
        status: 'read'
      },
      {
        id: 'msg8',
        text: 'Yes, it is! Are you interested?',
        timestamp: new Date('2025-03-20T15:25:00'),
        isFromMe: false,
        status: 'read'
      }
    ]
  },
  '3': {
    id: '3',
    user: mockUsers['3'],
    bookTitle: 'The Martian',
    messages: [
      {
        id: 'msg9',
        text: 'Is this book still available?',
        timestamp: new Date('2025-03-20T15:22:00'),
        isFromMe: false,
        status: 'read'
      },
      {
        id: 'msg10',
        text: 'Yes! Would you like to buy it?',
        timestamp: new Date('2025-03-20T15:25:00'),
        isFromMe: true,
        status: 'read'
      },
      {
        id: 'msg11',
        text: 'How much?',
        timestamp: new Date('2025-03-20T15:30:00'),
        isFromMe: false,
        status: 'read'
      },
      {
        id: 'msg12',
        text: '250 UAH, good condition',
        timestamp: new Date('2025-03-20T15:32:00'),
        isFromMe: true,
        status: 'delivered'
      }
    ]
  },
  '4': {
    id: '4',
    user: mockUsers['4'],
    bookTitle: 'Babel',
    messages: [
      {
        id: 'msg13',
        text: "I'm interested in your book",
        timestamp: new Date('2025-03-19T12:10:00'),
        isFromMe: true,
        status: 'read'
      },
      {
        id: 'msg14',
        text: 'Great! Which one?',
        timestamp: new Date('2025-03-19T12:12:00'),
        isFromMe: false,
        status: 'read'
      },
      {
        id: 'msg15',
        text: 'Babel by Rebecca Kuang',
        timestamp: new Date('2025-03-19T12:13:00'),
        isFromMe: true,
        status: 'read'
      },
      {
        id: 'msg16',
        text: "Perfect! I'll take it",
        timestamp: new Date('2025-03-19T12:15:00'),
        isFromMe: true,
        status: 'sent'
      }
    ]
  }
}

// Message Bubble Component
interface MessageBubbleProps {
  message: Message
}

function MessageBubble({ message }: MessageBubbleProps) {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    })
  }

  return (
    <div className={`flex mb-4 ${message.isFromMe ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
        message.isFromMe 
          ? 'bg-blue-500 text-white rounded-br-md' 
          : 'bg-gray-200 text-gray-900 rounded-bl-md'
      }`}>
        <p className="text-sm">{message.text}</p>
        <div className={`flex items-center justify-end mt-1 text-xs ${
          message.isFromMe ? 'text-blue-100' : 'text-gray-500'
        }`}>
          <span>{formatTime(message.timestamp)}</span>
          {message.isFromMe && (
            <span className="ml-1">
              {message.status === 'sent' && '✓'}
              {message.status === 'delivered' && '✓✓'}
              {message.status === 'read' && '✓✓'}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

// Date Separator Component
interface DateSeparatorProps {
  date: Date
}

function DateSeparator({ date }: DateSeparatorProps) {
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  return (
    <div className="flex justify-center my-4">
      <span className="bg-gray-100 text-gray-600 text-xs px-3 py-1 rounded-full">
        {formatDate(date)}
      </span>
    </div>
  )
}

// Group messages by date
function groupMessagesByDate(messages: Message[]) {
  const groups: { date: string; messages: Message[] }[] = []
  
  messages.forEach(message => {
    const dateStr = message.timestamp.toDateString()
    const existingGroup = groups.find(group => group.date === dateStr)
    
    if (existingGroup) {
      existingGroup.messages.push(message)
    } else {
      groups.push({ date: dateStr, messages: [message] })
    }
  })
  
  return groups
}

const ChatPage: React.FC = () => {
    const { chatId } = useParams()
    const navigate = useNavigate()
    const [newMessage, setNewMessage] = useState('')
    const messagesEndRef = useRef<HTMLDivElement>(null)
    const [chatData, setChatData] = useState<ChatData | null>(null)

    // Load chat data
    useEffect(() => {
      if (chatId && mockChatData[chatId]) {
        setChatData(mockChatData[chatId])
      }
    }, [chatId])

    // Auto-scroll to bottom
    useEffect(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [chatData?.messages])

    const handleBack = () => {
        navigate(-1)
    }

    const handleSendMessage = () => {
      if (!newMessage.trim() || !chatData) return

      const message: Message = {
        id: Date.now().toString(),
        text: newMessage.trim(),
        timestamp: new Date(),
        isFromMe: true,
        status: 'sent'
      }

      setChatData(prev => prev ? {
        ...prev,
        messages: [...prev.messages, message]
      } : null)

      setNewMessage('')
    }

    const handleKeyPress = (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault()
        handleSendMessage()
      }
    }

    if (!chatData) {
      return (
        <div className="min-h-screen bg-white flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-4 mx-auto">
              <span className="text-2xl">💬</span>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Chat not found</h3>
            <button
              onClick={handleBack}
              className="text-blue-500 hover:text-blue-600"
            >
              Go back to chats
            </button>
          </div>
        </div>
      )
    }

    const messageGroups = groupMessagesByDate(chatData.messages)

    return (
        <div className="min-h-screen bg-white flex flex-col">
            {/* Header */}
            <div className="bg-white px-4 py-3 flex items-center border-b border-gray-200 flex-shrink-0">
                <button onClick={handleBack} className="p-1 mr-3">
                    <IoChevronBack className="w-5 h-5 text-black" />
                </button>
                
                {/* User info */}
                <div className="flex items-center flex-1">
                  <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center mr-3">
                    <span className="text-gray-600 font-medium text-sm">
                      {chatData.user.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <h1 className="text-base font-semibold text-gray-900">
                      {chatData.user.name}
                    </h1>
                    {chatData.user.isOnline && (
                      <p className="text-xs text-green-500">Online</p>
                    )}
                  </div>
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4">
              {messageGroups.map((group, groupIndex) => (
                <div key={groupIndex}>
                  <DateSeparator date={new Date(group.date)} />
                  {group.messages.map((message) => (
                    <MessageBubble key={message.id} message={message} />
                  ))}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="bg-white border-t border-gray-200 p-4 flex-shrink-0">
              <div className="flex items-center space-x-3">
                <button className="flex-shrink-0 w-10 h-10 flex items-center justify-center text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors">
                  <IoAttach className="w-5 h-5" />
                </button>
                
                <div className="flex-1 relative">
                  <textarea
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type a message..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    rows={1}
                    style={{ minHeight: '44px', maxHeight: '120px' }}
                  />
                </div>
                
                <button 
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                  className={`flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full transition-colors ${
                    newMessage.trim() 
                      ? 'bg-blue-500 text-white hover:bg-blue-600' 
                      : 'bg-gray-200 text-gray-400'
                  }`}
                >
                  <IoSend className="w-5 h-5" />
                </button>
              </div>
            </div>
        </div>
    )
}

export {ChatPage}

