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
// import { Card, CardHeader } from '@fluentui/react-components/unstable';
import { forwardRef, useState } from 'react';
import FlipMove from 'react-flip-move';
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

/**
 * forward-ref is required by react-flip-move
 * see https://github.com/joshwcomeau/react-flip-move#usage-with-functional-components
 */
const PlayerScoreRefWrapper = forwardRef((props, ref) => (
  <div ref={ref}>
    <PlayerScore
      player={props.player}
      removePlayer={props.removePlayer}
      updatePlayerName={props.updatePlayerName}
    ></PlayerScore>
  </div>
));

export function ScoreOutput({ players, updatePlayerName, removePlayer }) {
  return (
    <div>
      <FlipMove
        easing="ease"
        duration={700}
        staggerDurationBy={15}
        staggerDelayBy={20}
      >
        {players.map((player) => (
          <PlayerScoreRefWrapper
            key={player.id}
            player={player}
            updatePlayerName={updatePlayerName}
            removePlayer={removePlayer}
          />
        ))}
      </FlipMove>
    </div>
  );
}
