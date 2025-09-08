import React from 'react'
import { useParams, useNavigate } from "react-router"
import { IoChevronBack } from 'react-icons/io5'
import { BottomNav } from '@shared/ui/BottomNav'

const ChatPage: React.FC = () => {
    const { chatId } = useParams()
    const navigate = useNavigate()

    const handleBack = () => {
        navigate(-1)
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white px-4 sm:px-6 lg:px-8 py-3 flex items-center border-b border-gray-200">
                <button onClick={handleBack} className="p-1">
                    <IoChevronBack className="w-5 h-5 sm:w-6 sm:h-6 text-black" />
                </button>
                <h1 className="text-base sm:text-lg lg:text-xl font-semibold flex-1 text-center">
                    Chat {chatId && <span className="font-bold">{chatId}</span>}
                </h1>
                <div className="w-6 sm:w-8"></div>
            </div>

            <div className="w-full max-w-md mx-auto lg:max-w-4xl xl:max-w-6xl">
                {/* Coming Soon State */}
                <div className="flex flex-col items-center justify-center py-16 sm:py-20 lg:py-24 px-4">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 bg-gray-200 rounded-full flex items-center justify-center mb-6 lg:mb-8">
                        <span className="text-2xl sm:text-3xl lg:text-4xl">💬</span>
                    </div>
                    <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-900 mb-3">
                        Chat Feature Coming Soon
                    </h2>
                    <p className="text-sm sm:text-base lg:text-lg text-gray-600 text-center mb-8 max-w-md">
                        Individual chat conversations will be available here soon.
                    </p>
                    <button
                        onClick={() => navigate('/')}
                        className="px-6 sm:px-8 py-3 sm:py-4 bg-gray-900 text-white rounded-lg font-medium hover:bg-black transition-colors text-sm sm:text-base lg:text-lg"
                    >
                        Back to Home
                    </button>
                </div>

                {/* Bottom spacing */}
                <div className="h-20"></div>
            </div>

            <BottomNav />
        </div>
    )
}

export {ChatPage}

