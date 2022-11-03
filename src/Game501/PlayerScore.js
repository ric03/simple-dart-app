import { Body1, Button, Input, Text } from '@fluentui/react-components';
import { Card, CardHeader } from '@fluentui/react-components/unstable';
import { useState } from 'react';
import { calculateRemainingPoints } from './util/calculateRemainingPoints';

function PlayerScore({ player, updatePlayerName }) {
  const [isEditMode, setEditMode] = useState(false);
  const [newName, setName] = useState(player.name);

  function handleEdit() {
    setEditMode(true);
  }

  function handleSave() {
    updatePlayerName(player.id, newName);
    setEditMode(false);
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
            </Body1>
          )
        }
      />
      <Text>Remaining Points: {calculateRemainingPoints(player.throws)}</Text>
    </Card>
  );
}

export function ScoreOutput({ state, updatePlayerName }) {
  return (
    <div>
      {state.map((player, idx) => (
        <PlayerScore
          player={player}
          key={idx}
          updatePlayerName={updatePlayerName}
        />
      ))}
    </div>
  );
}
