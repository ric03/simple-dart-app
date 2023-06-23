import { Title1 } from '@fluentui/react-components';
import { useGameState } from './state/game.state.ts';
import { Tile } from './Tile.tsx';

export function Winner() {
  const winner = useGameState((state) => state.getWinner());

  return (
    <Tile>
      <Title1>
        Congratulations,{' '}
        <span style={{ textDecoration: 'underline' }}>{winner.name}</span>, you
        have won.
      </Title1>
    </Tile>
  );
}
