import {
  Button,
  makeStyles,
  Text,
  Title3,
  tokens,
} from '@fluentui/react-components';
import { useReducer, useState } from 'react';
import './App.css';

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

function throwsReducer(state, action) {
  // TODO use `use-immer-reducer` to simplify the state patching
  // TODO see: https://beta.reactjs.org/learn/extracting-state-logic-into-a-reducer#writing-concise-reducers-with-immer
  switch (action.type) {
    case 'addValueWithMultiplier': {
      return [
        ...state,
        {
          value: action.value,
          multiplier: action.multiplier,
        },
      ];
    }
    default:
      return { ...state };
  }
}

function InputButtons() {
  const [multiplier, setMultiplier] = useState(1);
  const [throws, dispatch] = useReducer(throwsReducer, []);

  /**
   * the multiplier is provided by the MultiplierButtons as a state (hook)
   * @param value
   */
  function handleValueWithMultiplier(value) {
    dispatch({
      type: 'addValueWithMultiplier',
      value,
      multiplier,
    });
  }

  function handleValueWithExplicitMultiplier(value, multiplier) {
    dispatch({
      type: 'addValueWithMultiplier',
      value,
      multiplier,
    });
  }

  return (
    <div>
      <p>Input Buttons</p>

      <SpecialButtons
        addValueWithMultiplier={handleValueWithExplicitMultiplier}
      />

      <MultiplierButtons
        multiplier={multiplier}
        setMultiplier={setMultiplier}
      />

      <TwentyButtons
        multiplier={multiplier}
        addValue={handleValueWithMultiplier}
      />

      {throws.map((item, idx) => (
        <ThrowOutput item={item} key={idx} />
      ))}
    </div>
  );
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

function App() {
  return (
    <div>
      <Title3>Dart Board</Title3>
      <InputButtons />
    </div>
  );
}

export default App;
