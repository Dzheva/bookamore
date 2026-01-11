import React, { useState } from "react";
import { useNavigate } from "react-router";
import { BottomNav } from "@shared/ui/BottomNav";
import BackButton from "@/shared/ui/BackButton";

// Mock data types
interface ChatMessage {
  id: string;
  text: string;
  timestamp: Date;
  isFromMe: boolean;
}

interface Chat {
  id: string;
  userName: string;
  userAvatar?: string;
  lastMessage: ChatMessage;
  unreadCount: number;
  bookTitle?: string;
  isSellingChat: boolean; // true = I'm selling, false = I'm buying
}

// Mock chats data
const mockChats: Chat[] = [
  {
    id: "1",
    userName: "Jane Walker",
    lastMessage: {
      id: "msg1",
      text: "Deal then! Thanks!)",
      timestamp: new Date("2025-03-21T21:34:00"),
      isFromMe: false,
    },
    unreadCount: 0,
    bookTitle: "Dune",
    isSellingChat: true,
  },
  {
    id: "2",
    userName: "Jane Walker",
    lastMessage: {
      id: "msg2",
      text: "Deal then! Thanks!)",
      timestamp: new Date("2025-03-21T21:34:00"),
      isFromMe: false,
    },
    unreadCount: 0,
    bookTitle: "Foundation",
    isSellingChat: false,
  },
  {
    id: "3",
    userName: "John Smith",
    lastMessage: {
      id: "msg3",
      text: "Is this book still available?",
      timestamp: new Date("2025-03-20T15:22:00"),
      isFromMe: false,
    },
    unreadCount: 2,
    bookTitle: "The Martian",
    isSellingChat: true,
  },
  {
    id: "4",
    userName: "Sarah Johnson",
    lastMessage: {
      id: "msg4",
      text: "Perfect! I'll take it",
      timestamp: new Date("2025-03-19T12:15:00"),
      isFromMe: true,
    },
    unreadCount: 0,
    bookTitle: "Babel",
    isSellingChat: false,
  },
];

// Chat List Item Component
interface ChatListItemProps {
  chat: Chat;
  onClick: (chatId: string) => void;
}

function ChatListItem({ chat, onClick }: ChatListItemProps) {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  return (
    <div
      className="flex items-center p-4 hover:bg-gray-50 cursor-pointer border-b border-gray-100"
      onClick={() => onClick(chat.id)}
    >
      {/* Avatar */}
      <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
        <span className="text-gray-600 font-medium text-sm">
          {chat.userName
            .split(" ")
            .map((n) => n[0])
            .join("")}
        </span>
      </div>

      {/* Chat content */}
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start mb-1">
          <h3 className="font-medium text-gray-900 text-sm truncate">
            {chat.userName}
          </h3>
          <div className="flex items-center ml-2">
            <span className="text-xs text-gray-500">
              {formatTime(chat.lastMessage.timestamp)}
            </span>
            {chat.unreadCount > 0 && (
              <span className="ml-2 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {chat.unreadCount}
              </span>
            )}
          </div>
        </div>
        <p className="text-sm text-gray-600 truncate">
          {chat.lastMessage.text}
        </p>
      </div>
    </div>
  );
}

// Tab Switcher Component
interface TabSwitcherProps {
  activeTab: "selling" | "buying";
  onTabChange: (tab: "selling" | "buying") => void;
}

function TabSwitcher({ activeTab, onTabChange }: TabSwitcherProps) {
  return (
    <div className="flex bg-gray-100 rounded-lg p-1 mx-4 mb-4">
      <button
        onClick={() => onTabChange("selling")}
        className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
          activeTab === "selling"
            ? "bg-white text-gray-900 shadow-sm"
            : "text-gray-600 hover:text-gray-900"
        }`}
      >
        My sellings
      </button>
      <button
        onClick={() => onTabChange("buying")}
        className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
          activeTab === "buying"
            ? "bg-white text-gray-900 shadow-sm"
            : "text-gray-600 hover:text-gray-900"
        }`}
      >
        My purchases
      </button>
    </div>
  );
}

const AllChatsPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"selling" | "buying">("selling");

  const handleChatClick = (chatId: string) => {
    navigate(`/chats/${chatId}`);
  };

  // Filter chats based on active tab
  const filteredChats = mockChats.filter((chat) =>
    activeTab === "selling" ? chat.isSellingChat : !chat.isSellingChat
  );

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white px-4 sm:px-6 lg:px-8 py-3 flex items-center border-b border-gray-200">
        <BackButton />
        <h1 className="text-base sm:text-lg lg:text-xl font-semibold flex-1 text-center">
          Chats
        </h1>
        <div className="w-6 sm:w-8"></div>
      </div>

      <div className="w-full max-w-md mx-auto lg:max-w-4xl xl:max-w-6xl">
        {/* Tab Switcher */}
        <div className="pt-4">
          <TabSwitcher activeTab={activeTab} onTabChange={setActiveTab} />
        </div>

        {/* Chats List */}
        <div className="pb-20">
          {filteredChats.length > 0 ? (
            <div className="divide-y divide-gray-100">
              {filteredChats.map((chat) => (
                <ChatListItem
                  key={chat.id}
                  chat={chat}
                  onClick={handleChatClick}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 px-4">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl">💬</span>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No chats yet
              </h3>
              <p className="text-sm text-gray-600 text-center max-w-md">
                {activeTab === "selling"
                  ? "When buyers contact you about your books, conversations will appear here."
                  : "When you contact sellers about books, conversations will appear here."}
              </p>
            </div>
          )}
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export { AllChatsPage };
