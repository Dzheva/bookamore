import React from "react";
import { useNavigate } from "react-router-dom";
import { FaTrashAlt, FaEdit, FaSyncAlt, FaPlus } from "react-icons/fa";
import BackButton from "@/shared/ui/BackButton";
import { BottomNav } from "@/shared/ui/BottomNav";

// Типізація для оголошення
interface Announcement {
  id: number;
  title: string;
  author: string;
  condition: string;
  price: string;
  image: string;
  isAvailable: boolean;
  canExchange?: boolean;
}

const MyAnnouncementsPage = () => {
  const navigate = useNavigate();

  // Мокові дані згідно з прототипом
  const availableBooks: Announcement[] = [
    {
      id: 1,
      title: "Babel",
      author: "Rebecca Kuang",
      condition: "New",
      price: "300 UAH",
      image: "https://m.media-amazon.com/images/I/71uM-S699NL._AC_UF1000,1000_QL80_.jpg", // Приклад обкладинки
      isAvailable: true,
    },
  ];

  const unavailableBooks: Announcement[] = [
    {
      id: 2,
      title: "Babel",
      author: "Rebecca Kuang",
      condition: "New",
      price: "300 UAH",
      image: "https://m.media-amazon.com/images/I/71uM-S699NL._AC_UF1000,1000_QL80_.jpg",
      isAvailable: false,
      canExchange: true,
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-white pb-24">
      {/* Header */}
      <div className="px-4 py-4 flex items-center border-b border-gray-100 sticky top-0 bg-white z-10">
        <BackButton />
        <h1 className="text-xl font-semibold flex-1 text-center text-slate-800">My Announcements</h1>
        <div className="w-8"></div>
      </div>

      <div className="px-4 py-6">
        {/* Кнопка додавання нової книги */}
        <button
          onClick={() => navigate("/offers/new")}
          className="w-full bg-[#004261] text-white py-4 rounded-xl font-semibold text-lg mb-8 shadow-sm active:scale-[0.98] transition-transform flex items-center justify-center gap-2"
        >
          Add a new book
        </button>

        {/* Секція Available */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-slate-800 mb-4">Available</h2>
          <div className="space-y-6">
            {availableBooks.map((book) => (
              <AnnouncementCard key={book.id} book={book} />
            ))}
          </div>
        </section>

        {/* Секція Unavailable */}
        <section>
          <h2 className="text-2xl font-bold text-slate-800 mb-4">Unavailable</h2>
          <div className="space-y-6">
            {unavailableBooks.map((book) => (
              <AnnouncementCard key={book.id} book={book} />
            ))}
          </div>
        </section>
      </div>

      <BottomNav isProfilePage={false} />
    </div>
  );
};

// Допоміжний компонент картки оголошення
const AnnouncementCard = ({ book }: { book: Announcement }) => {
  const cardColor = book.isAvailable ? "border-[#A1D9D6] bg-[#F2FBFB]" : "border-[#FFD9A1] bg-[#FFF9F2]";
  const accentColor = book.isAvailable ? "text-[#008080]" : "text-[#E68A00]";
  const btnBorderColor = book.isAvailable ? "border-[#A1D9D6]" : "border-[#FFD9A1]";

  return (
    <div className="flex flex-col">
      {/* Кнопки над карткою */}
      <div className="flex mb-[-1px]">
        <button className="flex items-center gap-2 px-6 py-2 border border-red-200 border-b-white rounded-t-xl text-red-500 text-sm font-medium bg-white">
          <FaTrashAlt size={14} /> Delete
        </button>
        <button className={`flex items-center gap-2 px-6 py-2 border ${btnBorderColor} border-b-white rounded-t-xl ${accentColor} text-sm font-medium bg-white`}>
          <FaEdit size={14} /> Change card
        </button>
      </div>

      {/* Основне тіло картки */}
      <div className={`flex gap-4 p-4 border-2 ${cardColor} rounded-r-2xl rounded-bl-2xl shadow-sm`}>
        {/* Обкладинка */}
        <div className="w-28 h-40 shrink-0 shadow-md overflow-hidden rounded-md border border-gray-200">
          <img src={book.image} alt={book.title} className="w-full h-full object-cover" />
        </div>

        {/* Інформація */}
        <div className="flex flex-col flex-1 py-1">
          {/* Перемикач статусу */}
          <div className="flex items-center justify-end gap-2 mb-2">
            <span className="text-xs font-medium text-slate-500">
              {book.isAvailable ? "Available" : "Unavailable"}
            </span>
            <div className={`w-10 h-5 rounded-full relative p-1 ${book.isAvailable ? "bg-[#004261]" : "bg-slate-300"}`}>
              <div className={`w-3 h-3 bg-white rounded-full transition-all ${book.isAvailable ? "translate-x-5" : "translate-x-0"}`} />
            </div>
          </div>

          <h3 className="text-xl font-bold text-slate-800">{book.title}</h3>
          <p className="text-sm text-slate-500 italic">by {book.author}</p>
          
          <div className="mt-2 space-y-1">
            <p className="text-sm text-slate-600">
              <span className="font-medium">Condition:</span> {book.condition}
            </p>
            <p className="text-sm text-slate-600">
              <span className="font-medium">Price:</span>
            </p>
            <p className="text-lg font-bold text-[#004261]">{book.price}</p>
          </div>

          {book.canExchange && (
            <div className="flex items-center justify-end gap-1 mt-auto text-[#008080] text-xs font-bold uppercase tracking-tight">
              <FaSyncAlt size={10} /> Exchange
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyAnnouncementsPage;
