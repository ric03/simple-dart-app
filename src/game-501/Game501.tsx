import { Title1 } from '@fluentui/react-components';
import { AddPlayer } from './AddPlayer.js';
import { ScoreOutput } from './PlayerScore';
import { ThrowInput } from './ThrowProgress';
import { Winner } from './Winner';
import { useGameState } from './state/game.state.ts';

export function Game501() {
  const { isGameOver } = useGameState();

  return (
    <div className="container">
      <Title1 className="branded-title-gradient">Dart 501</Title1>
      {isGameOver ? <Winner /> : <ThrowInput />}
      <ScoreOutput />
      {!isGameOver && <AddPlayer />}
    </div>
  );
}
