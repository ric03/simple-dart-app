import { ReactNode } from 'react';

type TileProps = {
  children: ReactNode;
  className?: string;
};

export function Tile({ children, className: additionalClasses }: TileProps) {
  if (!additionalClasses) additionalClasses = '';
  return (
    <div className={`rounded-3 bg-dark mt-3 p-3 ${additionalClasses}`}>
      {children}
    </div>
  );
}
