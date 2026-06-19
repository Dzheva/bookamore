
import { BottomNav } from "@/shared/ui/BottomNav";
import { Header } from "@/shared/ui/Header";
import { Categories } from "@/shared/ui/Categories";
import { BookSection } from "@/shared/ui/BookSection";
import React from "react";
import { useGetAllOffersWithBooksQuery } from "@/app/store/api/OffersApi";

const HomePage: React.FC = () => {
    const { data } = useGetAllOffersWithBooksQuery({ size: 8, page: 0 });
    const offers = data?.content ?? [];

    const toBooks = (items: typeof offers) =>
        items.map(offer => ({
            condition: offer.book.condition.toLowerCase() as 'new' | 'used',
            offer,
        }));

    const bookSections = [
        { title: "New",         destination: "/search?condition=new", books: toBooks(offers.slice(0, 4)) },
        { title: "Recommended", destination: "/search",               books: toBooks(offers.slice(0, 4)) },
        { title: "Sci-fi",      destination: "/genres/sci-fi",        books: toBooks(offers.slice(0, 4)) },
    ];

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            <div className="w-full max-w-md mx-auto lg:max-w-6xl xl:max-w-7xl">
                <Header/>
                <Categories/>

                <div className="space-y-2 sm:space-y-4 lg:space-y-6">
                    {bookSections.map((section) => (
                        <BookSection
                            key={section.title}
                            title={section.title}
                            viewAllDestination={section.destination}
                            books={section.books}
                        />
                    ))}
                </div>
            </div>

            <BottomNav/>
        </div>
    );

}

export { HomePage };
