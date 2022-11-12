import { calculateRemainingPoints } from '../util/calculateRemainingPoints';
import { handleUnknownReducerAction } from '../util/handleUnknwonReducerAction';

const EMPTY_THROW = { value: 0, multiplier: 0 };

export const initialState = {
  players: [
    { id: 0, name: 'Klaus', throws: [] },
    { id: 1, name: 'Hans', throws: [] },
    { id: 2, name: 'Ismeralda', throws: [] },
  ],
  isGameOver: false,
};

export function getWinner(state) {
  const playerWithZeroPoints = (player) =>
    calculateRemainingPoints(player.throws) === 0;

  return state.players.find(playerWithZeroPoints);
}

export function game501Reducer(draft, action) {
  switch (action.type) {
    case 'addThrowsToCurrentPlayer': {
      let { throws } = action;
      if (isPlayerArrayEmpty(draft)) return draft;
      if (hasPlayerOvershot(draft, throws)) {
        throws = [EMPTY_THROW];
        // fixme: to prevent confusing, add user feedback, in form of alert/popup...
        // todo from a ux perspective: this should be checked at each button input
        // todo > implement this check in the InputButtons component
        return draft;
      }

      const currentPlayer = getCurrentPlayer(draft);
      currentPlayer.throws.push(throws);

      if (hasPlayerWon(draft, throws)) {
        draft.isGameOver = true;
        sortPlayersByRemainingPointsAsc(draft);
      } else {
        moveCurrentPlayerToEndOfArray(draft);
      }
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
    default:
      handleUnknownReducerAction();
  }
}

function isPlayerArrayEmpty(draft) {
  return draft.players.length === 0;
}

function createNewPlayer(draft, name) {
  function getHighestId(draft) {
    if (isPlayerArrayEmpty(draft)) return -1;
    const ids = draft.players.map((p) => p.id);
    ids.sort((a, b) => b - a); // sort desc (highest to lowest)
    return ids[0];
  }

  const currentlyHighestId = getHighestId(draft);
  const nextId = currentlyHighestId + 1;
  return { id: nextId, name, throws: [] };
}

function getCurrentPlayer(draft) {
  return draft.players[0];
}

function hasPlayerOvershot(draft, newThrows) {
  const remainingPoints = calculateIntermediaryPoints(draft, newThrows);
  return remainingPoints < 0;
}

function calculateIntermediaryPoints(draft, newThrows) {
  const currentPlayer = getCurrentPlayer(draft);
  const accumulatedThrows = [...currentPlayer.throws, ...newThrows];
  return calculateRemainingPoints(accumulatedThrows);
}

function hasPlayerWon(draft) {
  const currentPlayer = getCurrentPlayer(draft);
  const remainingPoints = calculateRemainingPoints(currentPlayer.throws);
  return remainingPoints === 0;
}

/**
 * sort in place
 */
function sortPlayersByRemainingPointsAsc(draft) {
  draft.players.sort((p1, p2) => {
    const p1Points = calculateRemainingPoints(p1.throws);
    const p2Points = calculateRemainingPoints(p2.throws);
    return p1Points - p2Points; //sort asc (lowest to highest)
  });
}

function moveCurrentPlayerToEndOfArray(draft) {
  const currentPlayer = getCurrentPlayer(draft);
  draft.players.shift(); // remove first item
  draft.players.push(currentPlayer);
}
