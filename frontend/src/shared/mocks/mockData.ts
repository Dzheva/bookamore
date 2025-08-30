import type { OfferWithBook } from '@/types/entities/OfferWithBook.d';
import type { ListResponse } from '@/types/entities/ListResponse.d';
import { OfferType, OfferStatus } from '@/types/entities/Offer.d';
import { BookCondition } from '@/types/entities/Book.d';

// Mock book offers data
export const mockOffers: OfferWithBook[] = [
  {
    id: 1,
    price: 300,
    type: OfferType.SELL,
    status: OfferStatus.OPEN,
    description: 'Great condition sci-fi book',
    previewImage: '',
    sellerId: 1,
    book: {
      id: 1,
      title: 'Babel',
      authors: ['Rebecca Kuang'],
      genres: ['sci-fi', 'fantasy'],
      condition: BookCondition.NEW,
      description: 'A dark academic fantasy novel about the power of translation and colonialism.',
      images: [],
      isbn: '978-0-06-303752-8',
      yearOfRelease: 2022
    }
  },
  {
    id: 2,
    price: 250,
    type: OfferType.SELL,
    status: OfferStatus.OPEN,
    description: 'Excellent sci-fi book',
    previewImage: '',
    sellerId: 2,
    book: {
      id: 2,
      title: 'Babel',
      authors: ['Rebecca Kuang'],
      genres: ['sci-fi', 'fantasy'],
      condition: BookCondition.NEW,
      description: 'A dark academic fantasy novel about the power of translation and colonialism.',
      images: [],
      isbn: '978-0-06-303752-8',
      yearOfRelease: 2022
    }
  },
  {
    id: 3,
    price: 280,
    type: OfferType.EXCHANGE,
    status: OfferStatus.OPEN,
    description: 'Looking to exchange this amazing book',
    previewImage: '',
    sellerId: 3,
    book: {
      id: 3,
      title: 'Babel',
      authors: ['Rebecca Kuang'],
      genres: ['sci-fi', 'fantasy'],
      condition: BookCondition.NEW,
      description: 'A dark academic fantasy novel about the power of translation and colonialism.',
      images: [],
      isbn: '978-0-06-303752-8',
      yearOfRelease: 2022
    }
  },
  {
    id: 4,
    price: 200,
    type: OfferType.SELL,
    status: OfferStatus.OPEN,
    description: 'Classic science fiction masterpiece',
    previewImage: '',
    sellerId: 4,
    book: {
      id: 4,
      title: 'Dune',
      authors: ['Frank Herbert'],
      genres: ['sci-fi'],
      condition: BookCondition.USED,
      description: 'Epic science fiction novel set on the desert planet Arrakis.',
      images: [],
      isbn: '978-0-441-17271-9',
      yearOfRelease: 1965
    }
  },
  {
    id: 5,
    price: 350,
    type: OfferType.SELL,
    status: OfferStatus.OPEN,
    description: 'Amazing survival story',
    previewImage: '',
    sellerId: 5,
    book: {
      id: 5,
      title: 'The Martian',
      authors: ['Andy Weir'],
      genres: ['sci-fi'],
      condition: BookCondition.NEW,
      description: 'A thrilling story of survival on Mars.',
      images: [],
      isbn: '978-0-553-41802-6',
      yearOfRelease: 2011
    }
  },
  {
    id: 6,
    price: 180,
    type: OfferType.SELL,
    status: OfferStatus.OPEN,
    description: 'Classic Foundation series',
    previewImage: '',
    sellerId: 6,
    book: {
      id: 6,
      title: 'Foundation',
      authors: ['Isaac Asimov'],
      genres: ['sci-fi'],
      condition: BookCondition.USED,
      description: 'Classic science fiction about psychohistory and the fall of empire.',
      images: [],
      isbn: '978-0-553-29335-0',
      yearOfRelease: 1951
    }
  },
  {
    id: 7,
    price: 320,
    type: OfferType.EXCHANGE,
    status: OfferStatus.OPEN,
    description: 'Cyberpunk classic for trade',
    previewImage: '',
    sellerId: 7,
    book: {
      id: 7,
      title: 'Neuromancer',
      authors: ['William Gibson'],
      genres: ['sci-fi', 'cyberpunk'],
      condition: BookCondition.NEW,
      description: 'Groundbreaking cyberpunk novel about cyberspace and artificial intelligence.',
      images: [],
      isbn: '978-0-441-56956-9',
      yearOfRelease: 1984
    }
  },
  {
    id: 8,
    price: 275,
    type: OfferType.SELL,
    status: OfferStatus.OPEN,
    description: 'Ursula K. Le Guin masterpiece',
    previewImage: '',
    sellerId: 8,
    book: {
      id: 8,
      title: 'The Left Hand of Darkness',
      authors: ['Ursula K. Le Guin'],
      genres: ['sci-fi'],
      condition: BookCondition.NEW,
      description: 'Influential science fiction exploring gender and society.',
      images: [],
      isbn: '978-0-441-47812-5',
      yearOfRelease: 1969
    }
  },
  {
    id: 9,
    price: 190,
    type: OfferType.SELL,
    status: OfferStatus.OPEN,
    description: 'Space military fiction',
    previewImage: '',
    sellerId: 9,
    book: {
      id: 9,
      title: 'Ender\'s Game',
      authors: ['Orson Scott Card'],
      genres: ['sci-fi'],
      condition: BookCondition.USED,
      description: 'Military science fiction about a child prodigy in space war.',
      images: [],
      isbn: '978-0-312-93208-2',
      yearOfRelease: 1985
    }
  },
  {
    id: 10,
    price: 310,
    type: OfferType.SELL,
    status: OfferStatus.OPEN,
    description: 'H.G. Wells classic',
    previewImage: '',
    sellerId: 10,
    book: {
      id: 10,
      title: 'The Time Machine',
      authors: ['H.G. Wells'],
      genres: ['sci-fi', 'classic'],
      condition: BookCondition.NEW,
      description: 'Classic time travel story by the father of science fiction.',
      images: [],
      isbn: '978-0-486-28472-1',
      yearOfRelease: 1895
    }
  }
];

// Mock romantic books
export const mockRomanticOffers: OfferWithBook[] = [
  {
    id: 11,
    price: 280,
    type: OfferType.SELL,
    status: OfferStatus.OPEN,
    description: 'Classic romance novel',
    previewImage: '',
    sellerId: 11,
    book: {
      id: 11,
      title: 'Pride and Prejudice',
      authors: ['Jane Austen'],
      genres: ['romantic', 'classic'],
      condition: BookCondition.NEW,
      description: 'Classic romance novel about Elizabeth Bennet and Mr. Darcy.',
      images: [],
      isbn: '978-0-14-143951-8',
      yearOfRelease: 1813
    }
  },
  {
    id: 12,
    price: 250,
    type: OfferType.SELL,
    status: OfferStatus.OPEN,
    description: 'Heart-wrenching romance',
    previewImage: '',
    sellerId: 12,
    book: {
      id: 12,
      title: 'The Notebook',
      authors: ['Nicholas Sparks'],
      genres: ['romantic', 'contemporary'],
      condition: BookCondition.USED,
      description: 'Heart-wrenching love story spanning decades.',
      images: [],
      isbn: '978-0-446-60523-4',
      yearOfRelease: 1996
    }
  },
  {
    id: 13,
    price: 300,
    type: OfferType.EXCHANGE,
    status: OfferStatus.OPEN,
    description: 'Emotional contemporary romance',
    previewImage: '',
    sellerId: 13,
    book: {
      id: 13,
      title: 'Me Before You',
      authors: ['Jojo Moyes'],
      genres: ['romantic', 'contemporary'],
      condition: BookCondition.NEW,
      description: 'Emotional love story that will change your perspective on life.',
      images: [],
      isbn: '978-0-14-312454-1',
      yearOfRelease: 2012
    }
  }
];

// Function to create mock API response
export function createMockResponse<T>(content: T[], totalElements?: number): ListResponse<T> {
  return {
    content,
    totalElements: totalElements || content.length,
    totalPages: Math.ceil((totalElements || content.length) / 20),
    size: 20,
    number: 0,
    numberOfElements: content.length,
    pageable: {
      offset: 0,
      pageNumber: 0,
      pageSize: 20,
      pages: false,
      sort: {
        empty: true,
        sorted: false,
        unsorted: true
      }
    },
    sort: {
      empty: true,
      sorted: false,
      unsorted: true
    }
  };
}

// Filter functions for different scenarios
export function getOffersByGenre(genre: string): OfferWithBook[] {
  switch (genre.toLowerCase()) {
    case 'sci-fi':
      return mockOffers.filter(offer => offer.book.genres.includes('sci-fi'));
    case 'romantic':
      return mockRomanticOffers;
    case 'fantasy':
      return mockOffers.filter(offer => offer.book.genres.includes('fantasy'));
    default:
      return mockOffers.slice(0, 5); // Return some default books
  }
}

export function getOffersBySearch(query: string): OfferWithBook[] {
  const lowerQuery = query.toLowerCase();
  return [...mockOffers, ...mockRomanticOffers].filter(offer => 
    offer.book.title.toLowerCase().includes(lowerQuery) ||
    offer.book.authors.some(author => author.toLowerCase().includes(lowerQuery)) ||
    offer.book.genres.some(genre => genre.toLowerCase().includes(lowerQuery))
  );
}

export function getOffersByCondition(offers: OfferWithBook[], condition: 'new' | 'used'): OfferWithBook[] {
  return offers.filter(offer => offer.book.condition.toLowerCase() === condition);
}
