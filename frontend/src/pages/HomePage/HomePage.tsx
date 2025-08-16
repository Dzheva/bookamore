import { BottomNav } from "@/shared/ui/BottomNav";
import { Header } from "@/shared/ui/Header";
import { Categories } from "@/shared/ui/Categories";
import { BookSection } from "@/shared/ui/BookSection";
import React from "react";

const HomePage: React.FC = () => {
  // Book sections configuration
  const bookSections = [
    { title: "New" },
    { title: "Recommended" },
    { title: "Sci-fi" },
    // { title: "Fantasy" }, // Easy to add new sections
    // { title: "Horror" },
  ];

  return (
    <div className="pb-20">
      <Header />
      <Categories />
      
      {/* Book sections */}
      {bookSections.map((section) => (
        <BookSection key={section.title} title={section.title} />
      ))}
      
      <BottomNav />
    </div>
  );
};

export { HomePage };
