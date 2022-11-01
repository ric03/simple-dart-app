import { Title3 } from '@fluentui/react-components';
import { useState } from 'react';
import { useImmerReducer } from 'use-immer';
import { ScoreOutput } from './PlayerScore';
import { ThrowInput } from './ThrowProgress';
import { handleUnknownReducerAction } from './util/handleUnknwonReducerAction';

function game501Reducer(draft, action) {
  switch (action.type) {
    case 'addThrowsToCurrentPlayer': {
      const { currentPlayerId, throws } = action;
      const index = draft.findIndex((player) => player.id === currentPlayerId);
      draft[index].throws.push(throws);
      return draft;
    }
    case 'updatePlayerName': {
      const { id, newName } = action;
      const index = draft.findIndex((player) => player.id === id);
      if (index !== -1) draft[index].name = newName;
      return draft;
    }
    default:
      handleUnknownReducerAction();
  }
}

export function Game501() {
  const [currentPlayerId, setCurrentPlayerId] = useState(0);
  const [state, dispatch] = useImmerReducer(game501Reducer, [
    { id: 0, name: 'Klaus', throws: [] },
    { id: 1, name: 'Hans', throws: [] },
  ]);

  function switchPlayer() {
    setCurrentPlayerId(currentPlayerId === 0 ? 1 : 0);
  }

  function handleInput(throws) {
    dispatch({
      type: 'addThrowsToCurrentPlayer',
      currentPlayerId,
      throws,
    });
    switchPlayer();
  }

  function handleUpdatePlayerName(id, newName) {
    dispatch({
      type: 'updatePlayerName',
      id,
      newName,
    });
  }

  return (
    <div>
      <Title3>Dart 501</Title3>
      <ThrowInput submitThrows={handleInput} />
      <ScoreOutput state={state} updatePlayerName={handleUpdatePlayerName} />
    </div>
  );
}
