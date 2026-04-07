export const RadioBtn = ({
  name,
  value,
  isChecked,
  label,
  onChange,
}: {
  name: string;
  value: string;
  isChecked: boolean;
  label: string;
  onChange: () => void;
}) => {
  return (
    <label
      className="
        flex
        items-center
        space-x-2
        cursor-pointer
        max-w-max
        lg:px-2 lg:py-1
        lg:rounded-lg
        lg:hover:bg-grass-100
        transition-colors
      "
    >
      <input
        type="radio"
        name={name}
        value={value}
        checked={isChecked}
        onChange={onChange}
        className="w-3.5 h-3.5 peer opacity-0 absolute"
      />
      <div
        className="
          relative
          w-3.5 h-3.5
          rounded-full
          border
          border-icons-black
          peer-checked:[&>div]:bg-icons-black
          peer-focus-visible:outline-2
          peer-focus-visible:outline-offset-2
          peer-focus-visible:outline-grass-500
        "
      >
        <div className="absolute top-0.5 left-0.5 w-2 h-2 rounded-full"></div>
      </div>
      <span className="text-sm sm:text-base text-text-black">{label}</span>
    </label>
  );
};
