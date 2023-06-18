import { Title3 } from '@fluentui/react-components';
import { AddPlayer } from './AddPlayer.js';
import { ScoreOutput } from './PlayerScore';
import { ThrowInput } from './ThrowProgress';
import { Winner } from './Winner';
import { useGameState } from './state/game.state.ts';

export function Game501() {
  const { isGameOver } = useGameState();

  return (
    <div>
      <Title3>Dart 501</Title3>
      {isGameOver ? <Winner /> : <ThrowInput />}
      <ScoreOutput />
      {!isGameOver && <AddPlayer />}
    </div>
  );
}
