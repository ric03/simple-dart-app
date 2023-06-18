import { Body1, Button, Card, CardHeader, Input, makeStyles, Text, tokens } from '@fluentui/react-components';
import { useState } from 'react';
import { calculateRemainingPoints } from './util/calculateRemainingPoints';
import { Flipped, Flipper } from 'react-flip-toolkit';
import { Player } from './types/player.ts';
import { useGameState } from './state/game.state.ts';

const useColorOverrides = makeStyles({
  warn: { backgroundColor: tokens.colorPaletteRedBackground2 }
});

interface PlayerScoreProps {
  player: Player;
}

function PlayerScore({ player }: PlayerScoreProps) {

  const [isEditMode, setEditMode] = useState(false);
  const [newName, setName] = useState(player.name);

  const { removePlayer, updatePlayerName } = useGameState();

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
    <Card>
      <CardHeader
        header={
          isEditMode ? (
            <Body1>
              <Input
                id='name'
                defaultValue={player.name}
                onChange={(e) => setName(e.target.value)}
                autoFocus
              />
              <Button appearance='primary' onClick={() => handleSave()}>
                Save
              </Button>
              <Button
                appearance='primary'
                className={colorOverrides.warn}
                onClick={() => handleRemovePlayer()}
              >
                Remove Player
              </Button>
            </Body1>
          ) : (
            <Body1>
              {player.name}{' '}
              <Button size='small' onClick={() => handleEdit()}>
                Edit
              </Button>
            </Body1>
          )
        }
      />
      <Text>Remaining Points: {calculateRemainingPoints(player.throws)}</Text>
    </Card>
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
