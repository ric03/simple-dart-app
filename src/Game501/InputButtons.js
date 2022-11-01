import { Button, makeStyles, tokens } from '@fluentui/react-components';
import { useState } from 'react';

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
   * Range from 1..20
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

export function InputButtons({ addInput }) {
  const [multiplier, setMultiplier] = useState(1);

  /**
   * the multiplier is provided by the MultiplierButtons as a state-hook
   */
  function handleValueWithImplicitMultiplier(value) {
    addInput(value, multiplier);
    resetMultiplier();
  }

  function handleValueWithMultiplier(value, multiplier) {
    addInput(value, multiplier);
    resetMultiplier();
  }

  function resetMultiplier() {
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
