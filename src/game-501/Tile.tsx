import { ReactNode } from 'react';

type TileProps = {
  children: ReactNode;
};

export function Tile({ children }: TileProps) {
  return <div className="rounded-3 bg-dark mt-3 p-3">{children}</div>;
}
