import React, { useState } from 'react'
import { useNavigate } from 'react-router'
import { IoChevronBack, IoTrashOutline } from 'react-icons/io5'
import { BottomNav } from '@shared/ui/BottomNav'

// Mock data для demonstration
const mockFavorites = [
    {
        id: '1',
        book: {
            title: 'Babel',
            authors: ['Rebecca Kuang'],
            condition: 'NEW' as const,
            images: []
        },
        price: 300,
        type: 'SELL_EXCHANGE',
        sellerId: 1
    },
    {
        id: '2',
        book: {
            title: 'Babel',
            authors: ['Rebecca Kuang'],
            condition: 'NEW' as const,
            images: []
        },
        price: 300,
        type: 'SELL_EXCHANGE',
        sellerId: 1
    },
    {
        id: '3',
        book: {
            title: 'Babel',
            authors: ['Rebecca Kuang'],
            condition: 'NEW' as const,
            images: []
        },
        price: 300,
        type: 'SELL',
        sellerId: 1
    }
]

const FavoritesPage: React.FC = () => {
    const navigate = useNavigate()
    const [favorites, setFavorites] = useState(mockFavorites)

    const handleBack = () => {
        navigate(-1)
    }

    const handleRemoveFromFavorites = (offerId: string) => {
        setFavorites(prev => prev.filter(item => item.id !== offerId))
    }

    const handleContact = (offerId: string) => {
        // TODO: Implement contact functionality
        console.log('Contact for offer:', offerId)
    }

    const totalValue = favorites.reduce((sum, item) => sum + item.price, 0)

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white px-4 py-3 flex items-center border-b border-gray-200">
                <button onClick={handleBack} className="p-1">
                    <IoChevronBack className="w-6 h-6 text-black" />
                </button>
                <h1 className="text-lg font-semibold flex-1 text-center">My Favorites</h1>
                <div className="w-8"></div>
            </div>

            <div className="max-w-md mx-auto">
                {favorites.length > 0 ? (
                    <>
                        {/* Summary */}
                        <div className="px-4 py-4 bg-white">
                            <p className="text-sm text-gray-600">{favorites.length} items on your list</p>
                            <p className="text-sm font-semibold text-gray-800">Your Total: {totalValue} UAH</p>
                        </div>

                        {/* Favorites List */}
                        <div className="px-4 py-4 space-y-4">
                            {favorites.map((item) => (
                                <div key={item.id} className="bg-white rounded-lg p-4 shadow-sm">
                                    <div className="flex gap-4">
                                        {/* Book Image */}
                                        <div className="w-20 h-24 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                            {item.book.images?.length > 0 ? (
                                                <img 
                                                    src={item.book.images[0]} 
                                                    alt={item.book.title}
                                                    className="w-full h-full object-cover rounded-lg"
                                                />
                                            ) : (
                                                <span className="text-xs text-gray-400 text-center px-1">
                                                    No Image
                                                </span>
                                            )}
                                        </div>

                                        {/* Book Info */}
                                        <div className="flex-1">
                                            <div className="flex items-start justify-between mb-1">
                                                <h3 className="font-semibold text-gray-900">{item.book.title}</h3>
                                                <button 
                                                    onClick={() => handleRemoveFromFavorites(item.id)}
                                                    className="p-1 hover:bg-gray-100 rounded"
                                                >
                                                    <IoTrashOutline className="w-5 h-5 text-gray-500" />
                                                </button>
                                            </div>
                                            
                                            <p className="text-sm text-gray-600 mb-1">
                                                by {item.book.authors.join(', ')}
                                            </p>
                                            
                                            <p className="text-sm text-gray-600 mb-1">
                                                Condition: {item.book.condition === 'NEW' ? 'New' : 'Used'}
                                            </p>
                                            
                                            <div className="flex items-center justify-between mb-3">
                                                <div>
                                                    <p className="text-sm text-gray-600">Price:</p>
                                                    <p className="font-semibold text-gray-900">{item.price} UAH</p>
                                                </div>
                                                
                                                {(item.type === 'SELL_EXCHANGE' || item.type === 'EXCHANGE') && (
                                                    <div className="flex items-center text-sm text-gray-600 bg-gray-50 px-2 py-1 rounded">
                                                        <span className="mr-1">⇄</span>
                                                        Exchange
                                                    </div>
                                                )}
                                            </div>

                                            {/* Contact Button */}
                                            <button
                                                onClick={() => handleContact(item.id)}
                                                className="w-full py-2 bg-gray-900 text-white rounded-lg font-medium hover:bg-black transition-colors"
                                            >
                                                Contact
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                ) : (
                    /* Empty State */
                    <div className="flex flex-col items-center justify-center py-20 px-4">
                        <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-4">
                            <span className="text-2xl">💝</span>
                        </div>
                        <h2 className="text-lg font-semibold text-gray-900 mb-2">No favorites yet</h2>
                        <p className="text-gray-600 text-center mb-6">
                            Start browsing and add books to your favorites list
                        </p>
                        <button
                            onClick={() => navigate('/')}
                            className="px-6 py-3 bg-gray-900 text-white rounded-lg font-medium hover:bg-black transition-colors"
                        >
                            Browse Books
                        </button>
                    </div>
                )}

                {/* Bottom spacing */}
                <div className="h-20"></div>
            </div>

            <BottomNav />
        </div>
    )
}

export {FavoritesPage}

