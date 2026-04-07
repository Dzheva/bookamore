import { CheckboxFrameSvg } from '../ui/checkbox/CheckboxFrameSvg';
import { СheckMarkSvg } from '../ui/checkbox/СheckMarkSvg';

export const Checkbox = ({
  isChecked,
  onChange,
  label,
  size = 18,
}: {
  isChecked: boolean;
  onChange: () => void;
  label: string;
  size?: number;
}) => {
  return (
    <label
      className={
        'relative flex items-center gap-2 text-sm sm:text-base max-w-max lg:px-2 lg:py-1 lg:rounded-lg lg:hover:bg-grass-100 cursor-pointer'
      }
    >
      <input
        type="checkbox"
        checked={isChecked}
        onChange={onChange}
        className="w-4 h-4 cursor-pointer peer opacity-0 absolute"
      />
      <div
        className="relative peer-checked:[&>svg]:opacity-100 peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-blue-500"
        style={{ width: size, height: size }}
      >
        <CheckboxFrameSvg className="text-icons-black" size={size} />
        <СheckMarkSvg
          className="absolute top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2 opacity-0 text-icons-black"
          size={size}
        />
      </div>

      <span className="text-text-black">{label}</span>
    </label>
  );
};
