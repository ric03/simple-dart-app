import {
  Body1,
  Button,
  Input,
  makeStyles,
  Text,
  tokens,
} from '@fluentui/react-components';
import { Card, CardHeader } from '@fluentui/react-components/unstable';
import { useState } from 'react';
import { calculateRemainingPoints } from './util/calculateRemainingPoints';

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

export function ScoreOutput({ state, updatePlayerName, removePlayer }) {
  return (
    <div>
      {state.map((player) => (
        <PlayerScore
          key={player.id}
          player={player}
          updatePlayerName={updatePlayerName}
          removePlayer={removePlayer}
        />
      ))}
    </div>
  );
}
