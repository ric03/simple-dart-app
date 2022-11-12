import { Title3 } from '@fluentui/react-components';
import { useImmerReducer } from 'use-immer';
import { AddPlayer } from './AddPlayer';
import { ScoreOutput } from './PlayerScore';
import { ThrowInput } from './ThrowProgress';
import { calculateRemainingPoints } from './util/calculateRemainingPoints';
import { handleUnknownReducerAction } from './util/handleUnknwonReducerAction';
import { WinnerDialog } from './WinnerDialog';

function game501Reducer(draft, action) {
  function isStateEmpty(draft) {
    return draft.players.length === 0;
  }

  function getHighestId(draft) {
    if (isStateEmpty(draft)) return -1;
    const ids = draft.players.map((p) => p.id);
    ids.sort((a, b) => b - a); // sort desc (highest to lowest)
    return ids[0];
  }

  function createNewPlayer(draft, name) {
    const currentlyHighestId = getHighestId(draft);
    const nextId = currentlyHighestId + 1;
    return { id: nextId, name, throws: [] };
  }

  function getCurrentPlayer(draft) {
    return draft.players[0];
  }

  function calculateIntermediaryPoints(draft, newThrows) {
    const currentPlayer = getCurrentPlayer(draft);
    const accumulatedThrows = [...currentPlayer.throws, ...newThrows];
    return calculateRemainingPoints(accumulatedThrows);
  }

  function hasPlayerOvershot(draft, newThrows) {
    const remainingPoints = calculateIntermediaryPoints(draft, newThrows);
    return remainingPoints < 0;
  }

  function hasPlayerWon(draft, newThrows) {
    const remainingPoints = calculateIntermediaryPoints(draft, newThrows);
    return remainingPoints === 0;
  }

  switch (action.type) {
    case 'addThrowsToCurrentPlayer': {
      const { throws } = action;
      if (isStateEmpty(draft)) return draft;
      if (hasPlayerOvershot(draft, throws)) {
        // todo show warning/popup?
        return draft;
      }
      if (hasPlayerWon(draft, throws)) {
        draft.winnerDialog.show = true;
        draft.winnerDialog.name = getCurrentPlayer(draft).name;
      }
      const currentPlayer = getCurrentPlayer(draft);
      currentPlayer.throws.push(throws);
      return draft;
    }
    case 'moveCurrentPlayerToEndOfArray': {
      if (isStateEmpty(draft)) return draft;
      const currentPlayer = getCurrentPlayer(draft);
      draft.players.shift(); // remove first item
      draft.players.push(currentPlayer);
      return draft;
    }
    case 'addPlayer': {
      const { name } = action;
      const newPlayer = createNewPlayer(draft, name);
      draft.players.push(newPlayer);
      return draft;
    }
    case 'updatePlayerName': {
      const { id, newName } = action;
      const index = draft.players.findIndex((player) => player.id === id);
      if (index !== -1) draft.players[index].name = newName;
      return draft;
    }
    case 'removePlayer': {
      const { id } = action;
      const index = draft.players.findIndex((player) => player.id === id);
      if (index !== -1) draft.players.splice(index, 1);
      return draft;
    }
    case 'updateWinnerDialogShow': {
      const { isOpen } = action;
      draft.winnerDialog.show = isOpen;
      return draft;
    }
    default:
      handleUnknownReducerAction();
  }
}

export function Game501() {
  const [state, dispatch] = useImmerReducer(game501Reducer, {
    players: [
      { id: 0, name: 'Klaus', throws: [] },
      { id: 1, name: 'Hans', throws: [] },
      { id: 2, name: 'Ismeralda', throws: [] },
    ],
    winnerDialog: { show: false, name: null },
  });

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

  function handleUpdateWinnerDialogOpenState(isOpen) {
    dispatch({ type: 'updateWinnerDialogShow', isOpen });
  }

  return (
    <div>
      <Title3>Dart 501</Title3>
      <ThrowInput submitThrows={handleInput} />
      <ScoreOutput
        players={state.players}
        updatePlayerName={handleUpdatePlayerName}
        removePlayer={handleRemovePlayer}
      />
      <AddPlayer addPlayer={handleAddPlayer} />
      <WinnerDialog
        isDialogOpen={state.winnerDialog.show}
        playerName={state.winnerDialog.name}
        updateOpen={handleUpdateWinnerDialogOpenState}
      />
    </div>
  );
}
