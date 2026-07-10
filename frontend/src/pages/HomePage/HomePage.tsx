import { BottomNav } from '@/shared/ui/BottomNav';
import { Header } from '@/shared/ui/Header';
import { Categories } from '@/shared/ui/Categories';
import { BookSection } from '@/shared/ui/BookSection';
import { useGetAllOffersWithBooksQuery } from '@/app/store/api/OffersApi.ts';
import { useTranslation } from 'react-i18next';

// Size of items per section slider
const SECTION_SIZE = 10;

const HomePage: React.FC = () => {
  const { t } = useTranslation();
  const bookSections = [
    {
      title: t('categories.new'),
      destination: '/search?condition=new',
      queryResult: useGetAllOffersWithBooksQuery({
        condition: 'new',
        size: SECTION_SIZE,
      }),
    },
    {
      title: t('categories.recommended'),
      destination: '/search?q=recommended',
      queryResult: useGetAllOffersWithBooksQuery({
        search: 'recommended',
        size: SECTION_SIZE,
      }),
    },
    {
      title: t('categories.sci-fi'),
      destination: '/genres/sci-fi',
      queryResult: useGetAllOffersWithBooksQuery({
        genres: 'sci-fi',
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
