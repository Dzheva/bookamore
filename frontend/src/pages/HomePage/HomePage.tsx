import { BottomNav } from '@/shared/ui/BottomNav';
import { Header } from '@/shared/ui/Header';
import { Categories } from '@/shared/ui/Categories';
import { BookSection } from '@/shared/ui/BookSection';
import { useGetAllOffersWithBooksQuery } from '@/app/store/api/OffersApi.ts';

// Size of items per section slider
const SECTION_SIZE = 10;

const HomePage: React.FC = () => {
  const bookSections = [
    {
      title: 'New',
      destination: '/search?condition=new',
      queryResult: useGetAllOffersWithBooksQuery({
        condition: 'new',
        size: SECTION_SIZE,
      }),
    },
    {
      title: 'Recommended',
      destination: '/search?q=recommended',
      queryResult: useGetAllOffersWithBooksQuery({
        search: 'recommended',
        size: SECTION_SIZE,
      }),
    },
    {
      title: 'Sci-fi',
      destination: '/genres/sci-fi',
      queryResult: useGetAllOffersWithBooksQuery({
        genre: 'sci-fi',
        size: SECTION_SIZE,
      }),
    },
  ];

  return (
    <div className="min-h-screen pb-20">
      <div className="w-full mx-auto lg:max-w-6xl xl:max-w-7xl">
        <Header />
        <Categories />

        {/* Book sections */}
        <div className="space-y-2 sm:space-y-4 lg:space-y-6">
          {bookSections.map((section) => (
            <BookSection
              key={section.title}
              title={section.title}
              viewAllDestination={section.destination}
              offers={section.queryResult.data?.content ?? []}
              isLoading={section.queryResult.isLoading}
              error={section.queryResult.error}
            />
          ))}
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export { HomePage };
