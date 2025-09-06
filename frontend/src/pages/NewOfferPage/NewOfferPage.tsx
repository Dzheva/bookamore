import React, { useState } from 'react'
import { useNavigate } from 'react-router'
import { IoChevronBack } from 'react-icons/io5'
import { useAddOfferWithBookMutation } from '@app/store/api/OffersApi'
import { BottomNav } from '@shared/ui/BottomNav'
import type { OfferType, OfferStatus } from '@/types/entities/Offer.d.ts'
import type { OfferWithBookRequest } from '@/types/entities/OfferWithBook.d.ts'
import type { BookCondition } from '@/types/entities/Book.d.ts'

const NewOfferPage: React.FC = () => {
    const navigate = useNavigate()
    const [addOfferWithBook, { isLoading: isSubmitting }] = useAddOfferWithBookMutation()

    // Form state
    const [formData, setFormData] = useState({
        title: '',
        author: '',
        condition: 'NEW' as BookCondition,
        dealType: 'SELL' as OfferType,
        price: '',
        description: '',
        photos: [] as File[]
    })

    const handleInputChange = (field: string, value: string | BookCondition | OfferType) => {
        setFormData(prev => ({ ...prev, [field]: value }))
    }

    const handlePhotosChange = (files: FileList | null) => {
        if (files) {
            setFormData(prev => ({ ...prev, photos: Array.from(files) }))
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        
        if (!formData.title || !formData.author || !formData.price) {
            alert('Please fill in all required fields')
            return
        }

        try {
            const offerWithBookRequest: OfferWithBookRequest = {
                type: formData.dealType,
                status: 'OPEN' as OfferStatus,
                description: formData.description,
                price: parseFloat(formData.price),
                previewImage: formData.photos[0] || null,
                book: {
                    title: formData.title,
                    yearOfRelease: new Date().getFullYear(), // Default to current year
                    description: formData.description,
                    isbn: '', // Optional
                    condition: formData.condition,
                    authors: [formData.author],
                    genres: [], // Empty for now
                    images: formData.photos
                },
                sellerId: 1 // TODO: Get from auth context
            }

            const result = await addOfferWithBook(offerWithBookRequest).unwrap()
            navigate(`/offers/${result.id}`)
        } catch (error) {
            console.error('Error creating offer:', error)
            alert('Failed to create offer. Please try again.')
        }
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white px-4 py-3 flex items-center border-b border-gray-200">
                <button onClick={() => navigate(-1)} className="p-1">
                    <IoChevronBack className="w-6 h-6 text-black" />
                </button>
                <h1 className="text-lg font-semibold flex-1 text-center">Sell a book</h1>
                <div className="w-8"></div>
            </div>

            {/* Form Container - responsive */}
            <div className="w-full max-w-md mx-auto px-4 py-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                {/* Book Title */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Book Title
                    </label>
                    <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => handleInputChange('title', e.target.value)}
                        placeholder="Babel"
                        className="w-full px-4 py-3 bg-gray-100 rounded-lg border-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>

                {/* Author */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Author
                    </label>
                    <input
                        type="text"
                        value={formData.author}
                        onChange={(e) => handleInputChange('author', e.target.value)}
                        placeholder="Rebecca Kuang"
                        className="w-full px-4 py-3 bg-gray-100 rounded-lg border-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>

                {/* Condition */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Condition
                    </label>
                    <select
                        value={formData.condition}
                        onChange={(e) => handleInputChange('condition', e.target.value as BookCondition)}
                        className="w-full px-4 py-3 bg-gray-100 rounded-lg border-none focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                    >
                        <option value="NEW">New</option>
                        <option value="AS_NEW">As New</option>
                        <option value="USED">Used</option>
                    </select>
                </div>

                {/* Type of deal */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                        Type of deal
                    </label>
                    <div className="space-y-3">
                        <label className="flex items-center">
                            <input
                                type="radio"
                                name="dealType"
                                value="SELL"
                                checked={formData.dealType === 'SELL'}
                                onChange={(e) => handleInputChange('dealType', e.target.value as OfferType)}
                                className="mr-3 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="text-gray-700">purchase only</span>
                        </label>
                        <label className="flex items-center">
                            <input
                                type="radio"
                                name="dealType"
                                value="EXCHANGE"
                                checked={formData.dealType === 'EXCHANGE'}
                                onChange={(e) => handleInputChange('dealType', e.target.value as OfferType)}
                                className="mr-3 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="text-gray-700">exchange only</span>
                        </label>
                        <label className="flex items-center">
                            <input
                                type="radio"
                                name="dealType"
                                value="SELL_EXCHANGE"
                                checked={formData.dealType === 'SELL_EXCHANGE'}
                                onChange={(e) => handleInputChange('dealType', e.target.value as OfferType)}
                                className="mr-3 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="text-gray-700">both</span>
                        </label>
                    </div>
                </div>

                {/* Price */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Price
                    </label>
                    <input
                        type="number"
                        value={formData.price}
                        onChange={(e) => handleInputChange('price', e.target.value)}
                        placeholder="250"
                        className="w-full px-4 py-3 bg-gray-100 rounded-lg border-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                        min="0"
                        step="0.01"
                    />
                </div>

                {/* Description */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Add a description
                    </label>
                    <textarea
                        value={formData.description}
                        onChange={(e) => handleInputChange('description', e.target.value)}
                        placeholder="Used, in good condition..."
                        rows={4}
                        className="w-full px-3 py-3 bg-gray-100 rounded-lg border-none focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    />
                </div>

                {/* Upload photo */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                        Upload photo
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                        {/* Main photo upload */}
                        <label className="relative">
                            <input
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={(e) => handlePhotosChange(e.target.files)}
                                className="hidden"
                            />
                            <div className="w-full aspect-square bg-gray-200 rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-300 transition-colors">
                                <div className="w-8 h-8 border-2 border-gray-400 rounded-full flex items-center justify-center">
                                    <span className="text-gray-400 text-xl">+</span>
                                </div>
                            </div>
                        </label>
                        
                        {/* Additional photo slots */}
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="w-full aspect-square bg-gray-200 rounded-lg flex items-center justify-center">
                                <div className="w-6 h-6 border border-gray-400 rounded-full flex items-center justify-center">
                                    <span className="text-gray-400 text-sm">+</span>
                                </div>
                            </div>
                        ))}
                    </div>
                    {formData.photos.length > 0 && (
                        <p className="text-sm text-gray-600 mt-2">
                            {formData.photos.length} photo(s) selected
                        </p>
                    )}
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 bg-gray-900 text-white font-semibold rounded-lg hover:bg-black transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed text-lg"
                >
                    {isSubmitting ? 'Publishing...' : 'Publish'}
                </button>
            </form>
            </div>

            {/* Bottom spacing before BottomNav */}
            <div className="pb-20">
            </div>

            <BottomNav />
        </div>
    )
}

export {NewOfferPage}

