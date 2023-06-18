import { Title1 } from '@fluentui/react-components';
import { useGameState } from './state/game.state.ts';


export function Winner() {

  const winner = useGameState(state => state.getWinner());

  return (
    <div>
      <Title1>
        Congratulations,{' '}
        <span style={{ textDecoration: 'underline' }}>{winner.name}</span>, you
        have won.
      </Title1>
    </div>
  );
}
