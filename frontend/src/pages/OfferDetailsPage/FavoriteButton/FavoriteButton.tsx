import clsx from 'clsx';
import { AddToFavoritesSvg } from '@/shared/ui/icons/AddToFavoritesSvg';

export const FavoriteButton = ({
  isFavorite,
  onToggle,
}: {
  isFavorite: boolean;
  onToggle: () => void;
}) => (
  <button type="button" onClick={onToggle}>
    <AddToFavoritesSvg
      className={clsx('cursor-pointer hover:bg-aquamarine-100', {
        'text-powder-600': isFavorite,
        'text-transparent': !isFavorite,
      })}
    />
  </button>
);
