
import { BottomNav } from "@/shared/ui/BottomNav";
import { Header } from "@/shared/ui/Header";
import { Categories } from "@/shared/ui/Categories";
import { BookSection } from "@/shared/ui/BookSection";
import React, { useMemo } from "react";
import { useSearchParams } from 'react-router';
import { applyFiltersAndSort, getOffersBySearch } from '@/shared/mocks/mockData';

const HomePage: React.FC = () => {
    const [searchParams] = useSearchParams();

    // Get filter parameters from URL
    const filters = useMemo(() => {
        const exchange = searchParams.get('exchange');
        const condition = searchParams.get('condition') as 'new' | 'used' | null;
        const sort = searchParams.get('sort');
        const categories = searchParams.get('categories');

        return {
            exchange: exchange === 'true' ? true : exchange === 'false' ? false : undefined,
            condition: condition || undefined,
            sort: sort || undefined,
            categories: categories ? categories.split(',') : undefined,
        };
    }, [searchParams]);

    // Apply filters to get data for each section
    const sectionData = useMemo(() => {
        // If filters are applied, show filtered results in sections
        if (Object.values(filters).some(value => value !== undefined)) {
            return {
                new: applyFiltersAndSort({ ...filters, condition: 'new' }).slice(0, 4),
                recommended: applyFiltersAndSort({ ...filters, query: 'recommended' }).slice(0, 4),
                scifi: applyFiltersAndSort({ ...filters, genre: 'sci-fi' }).slice(0, 4),
            };
        }

        // Default data when no filters
        return {
            new: applyFiltersAndSort({ condition: 'new' }).slice(0, 4),
            recommended: getOffersBySearch('recommended').slice(0, 4),
            scifi: applyFiltersAndSort({ genre: 'sci-fi' }).slice(0, 4),
        };
    }, [filters]);

    // Book sections configuration
    const bookSections = [
        {
            title: "New",
            destination: "/search?condition=new",
            books: sectionData.new
        },
        {
            title: "Recommended",
            destination: "/search?q=recommended",
            books: sectionData.recommended
        },
        {
            title: "Sci-fi",
            destination: "/genres/sci-fi",
            books: sectionData.scifi
        },
        // { title: "Fantasy", destination: "/genres/fantasy" }, // Easy to add new sections
        // { title: "Horror", destination: "/genres/horror" },
    ];

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            <div className="max-w-md mx-auto">
                <Header/>
                <Categories/>

                {/* Book sections */}
                <div className="space-y-2 sm:space-y-4">
                    {bookSections.map((section) => (
                        <BookSection 
                            key={section.title} 
                            title={section.title}
                            viewAllDestination={section.destination}
                            books={section.books?.map(offer => ({ 
                                condition: offer.book.condition.toLowerCase() as 'new' | 'used',
                                offer 
                            }))}
                        />
                    ))}
                </div>
            </div>

            <BottomNav/>
        </div>
    );

}

export { HomePage };
