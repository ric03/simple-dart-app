import {
  Body1,
  Button,
  makeStyles,
  Text,
  Title3,
  tokens,
} from '@fluentui/react-components';
import {
  Card,
  CardFooter,
  CardHeader,
} from '@fluentui/react-components/unstable';
import { useState } from 'react';
import { useImmerReducer } from 'use-immer';

const useColorOverrides = makeStyles({
  1: { backgroundColor: tokens.colorPaletteCornflowerBackground2 },
  2: { backgroundColor: tokens.colorPaletteLavenderBackground2 },
  3: { backgroundColor: tokens.colorPaletteGrapeBackground2 },
  bull: { backgroundColor: tokens.colorPalettePinkBackground2 },
  bullseye: { backgroundColor: tokens.colorPaletteMagentaBackground2 },
  miss: { backgroundColor: tokens.colorPaletteBeigeBackground2 },
});

function SpecialButtons({ addValueWithMultiplier }) {
  const colorOverrides = useColorOverrides();

  return (
    <div>
      <Button
        shape="circular"
        appearance="primary"
        className={colorOverrides.miss}
        onClick={() => addValueWithMultiplier(0, 1)}
      >
        MISS
      </Button>
      <Button
        shape="circular"
        appearance="primary"
        className={colorOverrides.bull}
        onClick={() => addValueWithMultiplier(25, 1)}
      >
        BULL
      </Button>
      <Button
        shape="circular"
        appearance="primary"
        className={colorOverrides.bullseye}
        onClick={() => addValueWithMultiplier(25, 2)}
      >
        BULLSEYE
      </Button>
    </div>
  );
}

function MultiplierButtons({ multiplier, setMultiplier }) {
  const colorOverrides = useColorOverrides();

  return (
    <div>
      <Button
        appearance="primary"
        className={colorOverrides[1]}
        onClick={() => setMultiplier(1)}
      >
        Single
      </Button>
      <Button
        appearance="primary"
        className={colorOverrides[2]}
        onClick={() => setMultiplier(2)}
      >
        Double
      </Button>
      <Button
        appearance="primary"
        className={colorOverrides[3]}
        onClick={() => setMultiplier(3)}
      >
        Triple
      </Button>
      <Text>The current multiplier is {multiplier}</Text>
    </div>
  );
}

function TwentyButtons({ multiplier, addValue }) {
  const colorOverrides = useColorOverrides();

  /**
   * @type {number[]}
   */
  const numberArray = Array.from({ length: 20 }, (v, k) => k + 1);

  return (
    <div>
      {numberArray.map((number, idx) => (
        <Button
          className={colorOverrides[multiplier]}
          shape="circular"
          appearance="primary"
          key={idx}
          onClick={() => addValue(number)}
        >
          {number}
        </Button>
      ))}
    </div>
  );
}

function throwsReducer(draft, action) {
  switch (action.type) {
    case 'addValueWithMultiplier':
      if (draft.length === 3) {
        console.log('the user has already submitted three throws.');
      } else {
        draft.push({
          value: action.value,
          multiplier: action.multiplier,
        });
      }
      break;
    case 'reset':
      return [];
    default:
      handleUnknownReducerAction();
  }
}

function ThrowOutput({ item }) {
  const { value, multiplier } = item;
  if (isNaN(value) || isNaN(multiplier)) {
    console.error(
      'received invalid data, either value or multiplier are NaN',
      item
    );
    return;
  }

  const computedValue = value * multiplier;

  return (
    <div>
      <Text>{computedValue}</Text>
      <Text size={100}>
        ={value} x{multiplier}
      </Text>
    </div>
  );
}

function InputButtons({ addThrows }) {
  const [multiplier, setMultiplier] = useState(1);
  const [throws, dispatch] = useImmerReducer(throwsReducer, []);

  /**
   * the multiplier is provided by the MultiplierButtons as a state (hook)
   * @param value
   */
  function handleValueWithImplicitMultiplier(value) {
    dispatch({
      type: 'addValueWithMultiplier',
      value,
      multiplier,
    });
  }

  function handleValueWithMultiplier(value, multiplier) {
    dispatch({
      type: 'addValueWithMultiplier',
      value,
      multiplier,
    });
  }

  function handleSubmit() {
    addThrows(throws);
    dispatch({ type: 'reset' });
    setMultiplier(1);
  }

  return (
    <div>
      <p>Input Buttons</p>

      <SpecialButtons addValueWithMultiplier={handleValueWithMultiplier} />

      <MultiplierButtons
        multiplier={multiplier}
        setMultiplier={setMultiplier}
      />

      <TwentyButtons
        multiplier={multiplier}
        addValue={handleValueWithImplicitMultiplier}
      />

      {throws.map((item, idx) => (
        <ThrowOutput item={item} key={idx} />
      ))}

      <Button
        disabled={throws.length !== 3}
        onClick={() => {
          handleSubmit();
        }}
      >
        Submit
      </Button>
    </div>
  );
}

function calculateRemainingPoints(throws) {
  const accumulatedPoints = throws
    .flat()
    .reduce((acc, curr) => acc + curr.value * curr.multiplier, 0);
  return 501 - accumulatedPoints;
}

function PlayerScore({ player }) {
  return (
    <Card>
      <CardHeader header={<Body1>{player.name}</Body1>} />
      <Text>Remaining Points: {calculateRemainingPoints(player.throws)}</Text>
      <CardFooter>
        <Button onClick={() => console.log('TODO implement me.')}>Edit</Button>
      </CardFooter>
    </Card>
  );
}

function ScoreOutput(props) {
  return (
    <div>
      <PlayerScore player={props.state[0]} />
      <PlayerScore player={props.state[1]} />
    </div>
  );
}

function game501Reducer(draft, action) {
  switch (action.type) {
    case 'addThrowsToCurrentPlayer': {
      const index = draft.findIndex(
        (player) => player.id === action.currentPlayerId
      );
      draft[index].throws.push(action.throws);
      return draft;
    }
    default:
      handleUnknownReducerAction();
  }
}

function handleUnknownReducerAction(action) {
  throw Error('Unknown action: ' + action?.type);
}

export function Game501() {
  const [currentPlayerId, setCurrentPlayerId] = useState(0);
  const [state, dispatch] = useImmerReducer(game501Reducer, [
    { id: 0, name: 'Klaus', throws: [] },
    { id: 1, name: 'Hans', throws: [] },
  ]);

  function switchPlayer() {
    setCurrentPlayerId(currentPlayerId === 0 ? 1 : 0);
  }

  function handleInput(throws) {
    dispatch({
      type: 'addThrowsToCurrentPlayer',
      currentPlayerId,
      throws,
    });
    switchPlayer();
  }

  return (
    <div>
      <Title3>Dart Board - 501</Title3>
      <InputButtons addThrows={handleInput} />
      <ScoreOutput state={state} />
    </div>
  );
}
