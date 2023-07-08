import { calculateRemainingPoints } from '../util/calculateRemainingPoints.js';
import { Player } from '../types/player.ts';
import { Throw } from '../types/throw.ts';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { v4 as uuidv4 } from 'uuid';
import { UUID } from '../types/uuid.ts';

const EMPTY_THROW: Throw = { value: 0, multiplier: 1 };

interface GameState {
  players: Player[];
  currentThrows: Throw[];
  isGameOver: boolean;
}

interface GameStateActions {
  addPlayer: (name: string) => void;
  updatePlayerName: (id: UUID, newName: string) => void;
  removePlayer: (id: UUID) => void;
  getCurrentPlayer: () => Player;
  addThrow: (_throw: Throw) => void;
  updateThrowByIdx: (_throw: Throw, idx: number) => void;
  removeLastThrow: () => void;
  submitThrows: () => void;
  getWinner: () => Player;
}

export const useGameState = create(
  immer<GameState & GameStateActions>((setState, getState) => ({
    /**
     * start initial state
     */
    players: [
      { id: uuidv4(), name: 'Coconut', throws: [] },
      { id: uuidv4(), name: 'Pineapple', throws: [] },
    ],
    currentThrows: [],
    isGameOver: false,
    /**
     * end initial state
     */

    addPlayer: (name: string) => {
      const newPlayer: Player = { id: uuidv4(), name, throws: [] };
      setState((state) => {
        state.players.push(newPlayer);
      });
    },
    updatePlayerName: (id: UUID, newName: string) => {
      setState((state) => {
        const idx = state.players.findIndex((p) => p.id === id);
        if (idx !== -1) state.players[idx].name = newName;
      });
    },
    removePlayer: (id: UUID) => {
      setState((state) => {
        const idx = state.players.findIndex((p) => p.id === id);
        if (idx !== -1) state.players.splice(idx, 1);
      });
    },
    addThrow: (newThrow: Throw) => {
      const currentPlayer = getCurrentPlayer(getState().players);
      const currentThrows = getState().currentThrows;

      if (currentThrows.length >= 3) return;

      const intermediaryPoints = calculateIntermediaryPoints(
        currentPlayer.throws,
        [...currentThrows, newThrow]
      );
      if (intermediaryPoints < 0) {
        // overshot => submit and switch player
        setState((state) => {
          state.players[0].throws.push([EMPTY_THROW]);
          moveCurrentPlayerToEndOfArray(state.players);
          state.currentThrows = [];
        });
        // todo inform user, show some kind of notification
      } else if (intermediaryPoints === 0) {
        // win => sort players by points, end game
        setState((state) => {
          state.players[0].throws.push([...state.currentThrows, newThrow]);
          sortPlayersByRemainingPointsAsc(state.players);
          state.isGameOver = true;
        });
      } else {
        setState((state) => {
          state.currentThrows.push(newThrow);
        });
      }
    },

    getCurrentPlayer: () => {
      return getCurrentPlayer(getState().players);
    },

    updateThrowByIdx: (_throw: Throw, idx: number) => {
      // todo handle edge cases: winning, overshot
      setState((state) => {
        state.currentThrows[idx] = _throw;
      });
    },
    removeLastThrow: () => {
      setState((state) => {
        if (state.currentThrows.length > 0) {
          state.currentThrows.pop();
        }
      });
    },

    submitThrows: () => {
      if (getState().players.length === 0) return;
      setState((state) => {
        state.players[0].throws.push(state.currentThrows);
        moveCurrentPlayerToEndOfArray(state.players);
        state.currentThrows = [];
      });
    },
    getWinner: (): Player => getWinner(getState().players),
  }))
);

function getWinner(players: Player[]): Player {
  const playerWithZeroPoints = (player: Player) =>
    calculateRemainingPoints(player.throws) === 0;

  const winner = players.find(playerWithZeroPoints);
  if (winner === undefined) {
    throw new Error('no player with 0 points found');
  }
  return winner;
}

function getCurrentPlayer(players: Player[]) {
  return players[0];
}

function calculateIntermediaryPoints(
  throws: Throw[][],
  newThrows: Throw[]
): number {
  const accumulatedThrows = [...throws, newThrows];
  return calculateRemainingPoints(accumulatedThrows);
}

/**
 * sort in place
 */
function sortPlayersByRemainingPointsAsc(players: Player[]) {
  players.sort((p1, p2) => {
    const p1Points = calculateRemainingPoints(p1.throws);
    const p2Points = calculateRemainingPoints(p2.throws);
    return p1Points - p2Points; //sort asc (lowest to highest)
  });
}

function moveCurrentPlayerToEndOfArray(players: Player[]) {
  if (players.length < 2) return;
  players.push(players[0]);
  players.shift(); // remove first item
}
