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

function MultiplierButtons({ setMultiplier }) {
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
    case 'updateValueWithMultiplier':
      draft[action.updateIdx] = {
        value: action.value,
        multiplier: action.multiplier,
      };
      break;
    case 'reset':
      return [];
    default:
      handleUnknownReducerAction();
  }
}

function ThrowOutput({
  item,
  idx,
  updateIdx,
  initUpdateThrow,
  endUpdateThrow,
}) {
  const { value, multiplier } = item;
  if (isNaN(value) || isNaN(multiplier)) {
    console.error(
      'received invalid data, either value or multiplier are NaN',
      item
    );
    return;
  }

  const computedValue = value * multiplier;

  function handleEdit() {
    initUpdateThrow(idx);
  }

  function handleSave() {
    endUpdateThrow();
  }

  function isEditMode() {
    return updateIdx === idx;
  }

  return (
    <div>
      <Text weight={isEditMode() ? 'semibold' : 'regular'}>
        {computedValue}
      </Text>
      <Text size={100} weight={isEditMode() ? 'semibold' : 'regular'}>
        ={value} x{multiplier}
      </Text>
      {!isEditMode() ? (
        <Button size="small" onClick={() => handleEdit()}>
          Edit
        </Button>
      ) : (
        <Button appearance="primary" size="small" onClick={() => handleSave()}>
          Save
        </Button>
      )}
    </div>
  );
}

function InputButtons({ addInput }) {
  const [multiplier, setMultiplier] = useState(1);

  /**
   * the multiplier is provided by the MultiplierButtons as a state (hook)
   * @param value
   */
  function handleValueWithImplicitMultiplier(value) {
    addInput(value, multiplier);
    setMultiplier(1);
  }

  function handleValueWithMultiplier(value, multiplier) {
    addInput(value, multiplier);
    setMultiplier(1);
  }

  return (
    <div>
      <p>Input Buttons</p>

      <SpecialButtons addValueWithMultiplier={handleValueWithMultiplier} />

      <MultiplierButtons setMultiplier={setMultiplier} />

      <TwentyButtons
        multiplier={multiplier}
        addValue={handleValueWithImplicitMultiplier}
      />
    </div>
  );
}

function ThrowInput({ submitThrows }) {
  const [throws, dispatch] = useImmerReducer(throwsReducer, []);
  const [updateIdx, setUpdateIdx] = useState(null);

  function handleSubmit() {
    submitThrows(throws);
    dispatch({ type: 'reset' });
  }

  function handleInput(value, multiplier) {
    if (updateIdx !== null) {
      dispatch({
        type: 'updateValueWithMultiplier',
        updateIdx,
        value,
        multiplier,
      });
    } else {
      dispatch({ type: 'addValueWithMultiplier', value, multiplier });
    }
  }

  function handleInitUpdateThrow(idx) {
    setUpdateIdx(idx);
  }

  function handleEndUpdateThrow() {
    setUpdateIdx(null);
  }

  return (
    <div>
      <InputButtons addInput={handleInput} />
      {throws.map((item, idx) => (
        <ThrowOutput
          item={item}
          key={idx}
          idx={idx}
          updateIdx={updateIdx}
          initUpdateThrow={handleInitUpdateThrow}
          endUpdateThrow={handleEndUpdateThrow}
        />
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
      <Title3>Dart 501</Title3>
      <ThrowInput submitThrows={handleInput} />
      <ScoreOutput state={state} />
    </div>
  );
}
