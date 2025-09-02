
import { BottomNav } from "@/shared/ui/BottomNav";
import { Header } from "@/shared/ui/Header";
import { Categories } from "@/shared/ui/Categories";
import { BookSection } from "@/shared/ui/BookSection";
import React from "react";

const HomePage: React.FC = () => {
    // Book sections configuration
    const bookSections = [
        {title: "New", destination: "/search?condition=new"},
        {title: "Recommended", destination: "/search?q=recommended"},
        {title: "Sci-fi", destination: "/genres/sci-fi"},
        // { title: "Fantasy", destination: "/genres/fantasy" }, // Easy to add new sections
        // { title: "Horror", destination: "/genres/horror" },
    ];

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            <Header/>
            <Categories/>

            {/* Book sections */}
            <div className="space-y-2 sm:space-y-4">
                {bookSections.map((section) => (
                    <BookSection 
                        key={section.title} 
                        title={section.title}
                        viewAllDestination={section.destination}
                    />
                ))}
            </div>

            <BottomNav/>
        </div>
    );

}

export { HomePage };
