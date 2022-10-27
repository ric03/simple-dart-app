import { Button, makeStyles, Text, tokens } from '@fluentui/react-components';
import { useState } from 'react';
import './App.css';

const useOverrides = makeStyles({
  1: { backgroundColor: tokens.colorPaletteCornflowerBackground2 },
  2: { backgroundColor: tokens.colorPaletteLavenderBackground2 },
  3: { backgroundColor: tokens.colorPaletteGrapeBackground2 },
});

function MultiplierButtons(props) {
  const colorOverrides = useOverrides();

  return (
    <div>
      <Button
        appearance="primary"
        className={colorOverrides[1]}
        onClick={() => props.setMultiplier(1)}
      >
        Single
      </Button>
      <Button
        appearance="primary"
        className={colorOverrides[2]}
        onClick={() => props.setMultiplier(2)}
      >
        Double
      </Button>
      <Button
        appearance="primary"
        className={colorOverrides[3]}
        onClick={() => props.setMultiplier(3)}
      >
        Triple
      </Button>
      <Text>The current multiplier is {props.multiplier}</Text>
    </div>
  );
}

function InputButtons() {
  const colorOverrides = useOverrides();
  const [multiplier, setMultiplier] = useState(1);

  const numberArray = Array.from({ length: 20 }, (v, k) => k + 1);
  const twentyButtons = numberArray.map((number, idx) => (
    <Button
      className={colorOverrides[multiplier]}
      shape="circular"
      appearance="primary"
      key={idx}
    >
      {number}
    </Button>
  ));

  return (
    <div>
      <p>Input Buttons</p>

      <MultiplierButtons
        setMultiplier={setMultiplier}
        multiplier={multiplier}
      />
      <div>{twentyButtons}</div>
    </div>
  );
}

function App() {
  return (
    <div>
      <Text>Hello World</Text>
      <InputButtons />
    </div>
  );
}

export default App;
