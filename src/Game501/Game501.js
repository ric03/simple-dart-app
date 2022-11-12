import { Title3 } from '@fluentui/react-components';
import { useImmerReducer } from 'use-immer';
import { AddPlayer } from './AddPlayer';
import { ScoreOutput } from './PlayerScore';
import {
  game501Reducer,
  getWinner,
  initialState,
} from './reducers/game501Reducer';
import { ThrowInput } from './ThrowProgress';
import { Winner } from './Winner';

export function Game501() {
  const [state, dispatch] = useImmerReducer(game501Reducer, initialState);

  function handleInput(throws) {
    dispatch({ type: 'addThrowsToCurrentPlayer', throws });
  }

  function handleUpdatePlayerName(id, newName) {
    dispatch({ type: 'updatePlayerName', id, newName });
  }

  function handleAddPlayer(name) {
    dispatch({ type: 'addPlayer', name });
  }

  function handleRemovePlayer(id) {
    dispatch({ type: 'removePlayer', id });
  }

  return (
    <div>
      <Title3>Dart 501</Title3>
      {!state.isGameOver ? (
        <ThrowInput submitThrows={handleInput} />
      ) : (
        <Winner player={getWinner(state)} />
      )}
      <ScoreOutput
        players={state.players}
        updatePlayerName={handleUpdatePlayerName}
        removePlayer={handleRemovePlayer}
      />
      {!state.isGameOver && <AddPlayer addPlayer={handleAddPlayer} />}
    </div>
  );
}
