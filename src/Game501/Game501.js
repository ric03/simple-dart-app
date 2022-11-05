import { Button, Title3 } from '@fluentui/react-components';
import { InputField } from '@fluentui/react-components/unstable';
import { useState } from 'react';
import { useImmerReducer } from 'use-immer';
import { ScoreOutput } from './PlayerScore';
import { ThrowInput } from './ThrowProgress';
import { handleUnknownReducerAction } from './util/handleUnknwonReducerAction';

function game501Reducer(draft, action) {
  function isStateEmpty(draft) {
    return !draft || draft.length === 0;
  }

  switch (action.type) {
    case 'addThrowsToCurrentPlayer': {
      if (isStateEmpty(draft)) return draft;
      const { throws } = action;
      const currentPlayer = draft[0];
      currentPlayer.throws.push(throws);
      return draft;
    }
    case 'moveCurrentPlayerToEndOfArray': {
      if (isStateEmpty(draft)) return draft;
      const currentPlayer = draft[0];
      draft.shift(); // remove first item
      draft.push(currentPlayer);
      return draft;
    }
    case 'addPlayer': {
      const { name } = action;
      const newPlayer = { id: -1, name, throws: [] };
      draft.push(newPlayer);
      return draft;
    }
    case 'updatePlayerName': {
      const { id, newName } = action;
      const index = draft.findIndex((player) => player.id === id);
      if (index !== -1) draft[index].name = newName;
      return draft;
    }
    case 'removePlayer': {
      const { id } = action;
      const index = draft.findIndex((player) => player.id === id);
      if (index !== -1) draft.splice(index, 1);
      return draft;
    }
    default:
      handleUnknownReducerAction();
  }
}

export function Game501() {
  const [state, dispatch] = useImmerReducer(game501Reducer, [
    { id: 0, name: 'Klaus', throws: [] },
    { id: 1, name: 'Hans', throws: [] },
    { id: 2, name: 'Ismeralda', throws: [] },
  ]);

  function switchPlayer() {
    dispatch({ type: 'moveCurrentPlayerToEndOfArray' });
  }

  function handleInput(throws) {
    dispatch({
      type: 'addThrowsToCurrentPlayer',
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

  function handleAddPlayer(name) {
    dispatch({ type: 'addPlayer', name });
  }

  function handleRemovePlayer(id) {
    dispatch({ type: 'removePlayer', id });
  }

  return (
    <div>
      <Title3>Dart 501</Title3>
      <ThrowInput submitThrows={handleInput} />
      <ScoreOutput
        state={state}
        updatePlayerName={handleUpdatePlayerName}
        removePlayer={handleRemovePlayer}
      />
      <AddPlayer addPlayer={handleAddPlayer} />
    </div>
  );
}

function AddPlayer({ addPlayer }) {
  const [name, setName] = useState('');

  function handleAddPlayer() {
    if (name && name.length > 0) {
      addPlayer(name);
      setName('');
    }
  }

  return (
    <div>
      <p>Would you like to add a player?</p>
      <InputField
        label="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <Button onClick={() => handleAddPlayer()}>Add Player</Button>
    </div>
  );
}
