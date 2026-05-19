import { useNavigate } from 'react-router-dom';
// import { FaTrashAlt, FaEdit, FaSyncAlt } from 'react-icons/fa';
import { BottomNav } from '@/shared/ui/BottomNav';
import HeaderTitle from '@/shared/ui/HeaderTitle';
import { useSelector } from 'react-redux';
import { useGetAllOffersWithBooksQuery } from '@/app/store/api/OffersApi';
import { useEffect } from 'react';
import { selectIsLoading, selectUser } from '@/app/store/slices/authSlice';

// interface Announcement {
//   id: number;
//   title: string;
//   author: string;
//   condition: string;
//   price: string;
//   image: string;
//   isAvailable: boolean;
//   canExchange?: boolean;
// }
const MyAnnouncementsPage = () => {
  const navigate = useNavigate();

  const user = useSelector(selectUser);
  const isLoading = useSelector(selectIsLoading);
  const { data } = useGetAllOffersWithBooksQuery();

  const allOffers =
    data?.content.filter((offer) => offer.seller?.id === user?.id) || [];
  console.log('allOffers', allOffers);

  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/sign-in');
    }
  }, [user, isLoading, navigate]);

  return (
    <div className="flex flex-col min-h-screen bg-white pb-24">
      <HeaderTitle title="My Announcements" />
      <div className="px-4 py-6">
        <button
          type="button"
          onClick={() => navigate('/offers/new')}
          className="w-full
        bg-[#033F63] text-white
          sm:py-4 lg:py-5
          py-[10px] px-[16px] mb-[20px]
          cursor-pointer
          rounded-[12px]
          text-h3m
      "
        >
          Add a new book
        </button>

        <section className="mb-8">
          <h2 className="text-h3m font-bold mb-4">
            Available
            <div
              className="relative inline-block 
          after:absolute after:-inset-0.5 after:bg-gray-200
           w-full "
            ></div>
          </h2>

          <ul>
            {allOffers?.map((offer) => (
              <li key={offer.id}>
                {offer.book.images?.length >= 1 ? (
                  <img src={offer.book.images[0]} alt="image" />
                ) : null}
                {/* <p> {offer.book.images[0]}</p> */}
                <p> Title: {offer.book.title}</p>
                <p> Authors: {offer.book.authors.join(', ')}</p>
                <p> Condition:{offer.book.condition}</p>
              </li>
            ))}
          </ul>

          {/* <div className="space-y-6">
            {' '}
            text-slate-800
            {availableBooks.map((book) => (
              <AnnouncementCard key={book.id} book={book} />
            ))}
          </div> */}
        </section>
        <section className="mb-8">
          <h2 className="text-h3m font-bold mb-4">
            Unavailable
            <div
              className="relative inline-block 
          after:absolute after:-inset-0.5 after:bg-gray-200
           w-full "
            ></div>
          </h2>

          {/* <div className="space-y-6">
            {' '}
            text-slate-800
            {availableBooks.map((book) => (
              <AnnouncementCard key={book.id} book={book} />
            ))}
          </div> */}
        </section>
        {/* <section> */}
        {/* <h2 className="text-2xl font-bold text-slate-800 mb-4">
            Unavailableld
          </h2>
          {/* <div className="space-y-6">
            {unavailableBooks.map((book) => (
              <AnnouncementCard key={book.id} book={book} />
            ))}
          </div> */}
        {/* </section> */}
      </div>

      <BottomNav />
    </div>
  );
};

// Допоміжний компонент картки оголошення
// const AnnouncementCard = ({ book }: { book: Announcement }) => {
//   const cardColor = book.isAvailable
//     ? 'border-[#A1D9D6] bg-[#F2FBFB]'
//     : 'border-[#FFD9A1] bg-[#FFF9F2]';
//   const accentColor = book.isAvailable ? 'text-[#008080]' : 'text-[#E68A00]';
//   const btnBorderColor = book.isAvailable
//     ? 'border-[#A1D9D6]'
//     : 'border-[#FFD9A1]';

//   return (
//     <div className="flex flex-col">
//       {/* Кнопки над карткою */}
//       <div className="flex mb-[-1px]">
//         <button className="flex items-center gap-2 px-6 py-2 border border-red-200 border-b-white rounded-t-xl text-red-500 text-sm font-medium bg-white">
//           <FaTrashAlt size={14} /> Delete
//         </button>
//         <button
//           className={`flex items-center gap-2 px-6 py-2 border ${btnBorderColor} border-b-white rounded-t-xl ${accentColor} text-sm font-medium bg-white`}
//         >
//           <FaEdit size={14} /> Change card
//         </button>
//       </div>

//       {/* Основне тіло картки */}
//       <div
//         className={`flex gap-4 p-4 border-2 ${cardColor} rounded-r-2xl rounded-bl-2xl shadow-sm`}
//       >
//         {/* Обкладинка */}
//         <div className="w-28 h-40 shrink-0 shadow-md overflow-hidden rounded-md border border-gray-200">
//           <img
//             src={book.image}
//             alt={book.title}
//             className="w-full h-full object-cover"
//           />
//         </div>

//         {/* Інформація */}
//         <div className="flex flex-col flex-1 py-1">
//           {/* Перемикач статусу */}
//           <div className="flex items-center justify-end gap-2 mb-2">
//             <span className="text-xs font-medium text-slate-500">
//               {book.isAvailable ? 'Available' : 'Unavailable'}
//             </span>
//             <div
//               className={`w-10 h-5 rounded-full relative p-1 ${
//                 book.isAvailable ? 'bg-[#004261]' : 'bg-slate-300'
//               }`}
//             >
//               <div
//                 className={`w-3 h-3 bg-white rounded-full transition-all ${
//                   book.isAvailable ? 'translate-x-5' : 'translate-x-0'
//                 }`}
//               />
//             </div>
//           </div>

//           <h3 className="text-xl font-bold text-slate-800">{book.title}</h3>
//           <p className="text-sm text-slate-500 italic">by {book.author}</p>

//           <div className="mt-2 space-y-1">
//             <p className="text-sm text-slate-600">
//               <span className="font-medium">Condition:</span> {book.condition}
//             </p>
//             <p className="text-sm text-slate-600">
//               <span className="font-medium">Price:</span>
//             </p>
//             <p className="text-lg font-bold text-[#004261]">{book.price}</p>
//           </div>

//           {book.canExchange && (
//             <div className="flex items-center justify-end gap-1 mt-auto text-[#008080] text-xs font-bold uppercase tracking-tight">
//               <FaSyncAlt size={10} /> Exchange
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

export default MyAnnouncementsPage;
