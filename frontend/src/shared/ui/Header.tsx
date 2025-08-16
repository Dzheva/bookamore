import { FiSearch, FiFilter, FiBarChart2 } from "react-icons/fi";
import { LuCircleUserRound } from "react-icons/lu";

export function Header() {
  return (
    <header className="bg-white w-full">
      <div className="px-4 sm:px-6 lg:px-8">
        {/* Top row - Logo and Profile */}
        <div className="flex items-center justify-between py-3 ml-2">
          <h1 className="text-xl font-bold text-black">BookAmore</h1>
          <LuCircleUserRound size={24} className="text-black mr-2" />
        </div>

        {/* Search Bar */}
        <div className="pb-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Search: name, author, seller"
              className="w-full bg-gray-100 rounded-xl px-4 py-2.5 pr-10 text-sm outline-none border-none placeholder-gray-500"
            />
            <FiSearch
              size={20}
              className="absolute right-3.5 top-1/2 transform -translate-y-1/2 text-gray-500"
            />
          </div>
        </div>

        {/* Filter Controls */}
        <div className="pb-4 flex items-center justify-between flex-wrap">
          <label className="flex items-center gap-2 text-sm cursor-pointer ml-3">
            <input
              type="radio"
              name="exchange"
              className="w-4 h-4 accent-black cursor-pointer"
            />
            <span className="text-black">Exchange only</span>
          </label>

          <div className="flex items-center gap-3 mr-3">
            <button className="flex items-center gap-1.5 px-4 py-1.5 border border-gray-300 rounded-lg text-sm text-black bg-white hover:bg-gray-50 transition-colors">
              <FiFilter size={16} />
              <span>Filter</span>
            </button>

            <button className="flex items-center gap-1.5 px-4 py-1.5 border border-gray-300 rounded-lg text-sm text-black bg-white hover:bg-gray-50 transition-colors">
              <FiBarChart2 size={16} className="transform rotate-90" />
              <span>Sort</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
