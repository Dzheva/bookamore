
import { BottomNav } from "@/shared/ui/BottomNav";
import { Header } from "@/shared/ui/Header";
import { Categories } from "@/shared/ui/Categories";
import { BookSection } from "@/shared/ui/BookSection";
import React from "react";

const HomePage: React.FC = () => {
    // Book sections configuration
    const bookSections = [
        {title: "New"},
        {title: "Recommended"},
        {title: "Sci-fi"},
        // { title: "Fantasy" }, // Easy to add new sections
        // { title: "Horror" },
    ];

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            <Header/>
            <Categories/>

            {/* Book sections */}
            <div className="space-y-2 sm:space-y-4">
                {bookSections.map((section) => (
                    <BookSection key={section.title} title={section.title}/>
                ))}
            </div>

            <BottomNav/>
        </div>
    );

}

export { HomePage };
