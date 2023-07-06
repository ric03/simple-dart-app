import { Button, Input, makeStyles, Text, tokens, Tooltip } from '@fluentui/react-components';
import { useState } from 'react';
import { calculateRemainingPoints } from './util/calculateRemainingPoints';
import { Flipped, Flipper } from 'react-flip-toolkit';
import { Player } from './types/player.ts';
import { useGameState } from './state/game.state.ts';
import { EditRegular } from '@fluentui/react-icons/lib/fonts';
import { DeleteRegular, SaveRegular } from '@fluentui/react-icons';
import { Tile } from './Tile.tsx';

const useColorOverrides = makeStyles({
  warn: { backgroundColor: tokens.colorPaletteRedBackground2 },
});

interface PlayerScoreProps {
  player: Player;
}

function PlayerScore({ player }: PlayerScoreProps) {

  const [isEditMode, setEditMode] = useState(false);
  const [newName, setName] = useState(player.name);

  const { removePlayer, updatePlayerName, getCurrentPlayer } = useGameState();

  const colorOverrides = useColorOverrides();

  function handleEdit() {
    setEditMode(true);
  }

  function handleSave() {
    updatePlayerName(player.id, newName);
    setEditMode(false);
  }

  function handleRemovePlayer() {
    removePlayer(player.id);
  }

  return (
    <Tile className={getCurrentPlayer().id === player.id ? 'border border-white' : ''}>
      <div className="d-flex">
        <div>
          {isEditMode ? (
            <form>
              <Input
                id="name"
                defaultValue={player.name}
                onChange={(e) => setName(e.target.value)}
                autoFocus
              />
              <Button
                className="mx-2"
                appearance="primary"
                icon={<SaveRegular />}
                type="button"
                onClick={() => handleSave()}
              >
                Save
              </Button>
              <Button
                appearance="secondary"
                className={colorOverrides.warn}
                icon={<DeleteRegular />}
                onClick={() => handleRemovePlayer()}
              >
                Remove Player
              </Button>
            </form>
          ) : (
            <div>
              {player.name}
              <span className="ms-1">
                <Tooltip content="Edit" relationship="label">
                  <Button
                    size="small"
                    appearance="transparent"
                    onClick={() => handleEdit()}
                    icon={<EditRegular />}
                  />
                </Tooltip>
              </span>
            </div>
          )}
        </div>
        <div className="ms-auto">
          <Tooltip content="Remaining Points" relationship="label">
            <Text weight="bold">{calculateRemainingPoints(player.throws)}</Text>
          </Tooltip>
        </div>
      </div>
    </Tile>
  );
}

export function ScoreOutput() {
  const { players } = useGameState();

  /**
   * Important Notes:
   * - flipKey prop changes every time animations should happen.
   * - Flipped passes down props in order to work:
   *    either pass them down to a react-component
   *    or use an intermediary vanilla tag
   */
  return (
    <div>
      <Flipper flipKey={players}>
        {players.map((player) => (
          <Flipped key={player.id} flipId={player.id}>
            <div>
              <PlayerScore player={player} />
            </div>
          </Flipped>
        ))}
      </Flipper>
    </div>
  );
}
