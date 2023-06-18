import { Throw } from './throw.ts';
import { UUID } from './uuid.ts';

export interface Player {
  id: UUID
  name: string
  throws: Throw[][]
}