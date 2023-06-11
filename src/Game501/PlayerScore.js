import {
  Body1,
  Button,
  Card,
  CardHeader,
  Input,
  makeStyles,
  Text,
  tokens,
} from '@fluentui/react-components';
import { useState } from 'react';
import { calculateRemainingPoints } from './util/calculateRemainingPoints';
import { Flipped, Flipper } from 'react-flip-toolkit';

const useColorOverrides = makeStyles({
  warn: { backgroundColor: tokens.colorPaletteRedBackground2 },
});

function PlayerScore({ player, updatePlayerName, removePlayer }) {
  const colorOverrides = useColorOverrides();
  const [isEditMode, setEditMode] = useState(false);
  const [newName, setName] = useState(player.name);

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
    <Card>
      <CardHeader
        header={
          !isEditMode ? (
            <Body1>
              {player.name}{' '}
              <Button size="small" onClick={() => handleEdit()}>
                Edit
              </Button>
            </Body1>
          ) : (
            <Body1>
              <Input
                id="name"
                defaultValue={player.name}
                onChange={(e) => setName(e.target.value)}
                autoFocus
              />
              <Button appearance="primary" onClick={() => handleSave()}>
                Save
              </Button>
              <Button
                appearance="primary"
                className={colorOverrides.warn}
                onClick={() => handleRemovePlayer()}
              >
                Remove Player
              </Button>
            </Body1>
          )
        }
      />
      <Text>Remaining Points: {calculateRemainingPoints(player.throws)}</Text>
    </Card>
  );
}

export function ScoreOutput({ players, updatePlayerName, removePlayer }) {
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
              <PlayerScore
                player={player}
                updatePlayerName={updatePlayerName}
                removePlayer={removePlayer}
              />
            </div>
          </Flipped>
        ))}
      </Flipper>
    </div>
  );
}
