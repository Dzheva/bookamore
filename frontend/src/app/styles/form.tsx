import clsx from 'clsx';

export const formStyle = {
  title: clsx('font-kyiv text-h6m px-[12px] py-[4px]   '),
  container: clsx('flex flex-col gap-[4px]  '),
  input: clsx(
    'w-full h-[40px] px-[12px] py-[10px]',
    'border-[0.4px] border-gray-700 border-solid rounded-xl',
    'outline-none text-gray-500 text-sm sm:text-base font-kyiv text-h6m caret-black-500',
    'focus:border-gray-400 focus:bg-[#F7F8F2] focus:ring-0 focus:text-black',
    'hover:text-black '
  ),
  radio: clsx(
    'mr-[8px] accent-black w-[18px] h-[18px] font-kyiv',
    ' focus:accent-black focus:ring-0 ',
    ' hover:accent-black '
  ),
};
