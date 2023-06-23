import { Button, makeStyles, tokens } from '@fluentui/react-components';
import { useState } from 'react';
import { Multiplier } from './types/multiplier.ts';

const useColorOverrides = makeStyles({
  1: { backgroundColor: tokens.colorPaletteCornflowerBackground2 },
  2: { backgroundColor: tokens.colorPaletteLavenderBackground2 },
  3: { backgroundColor: tokens.colorPaletteGrapeBackground2 },
  bull: { backgroundColor: tokens.colorPalettePinkBackground2 },
  bullseye: { backgroundColor: tokens.colorPaletteMagentaBackground2 },
  miss: { backgroundColor: tokens.colorPaletteBeigeBackground2 },
});

interface SpecialButtonsProps {
  addValueWithMultiplier: (value: number, multiplier: Multiplier) => void;
}

function SpecialButtons({ addValueWithMultiplier }: SpecialButtonsProps) {
  const colorOverrides = useColorOverrides();

  return (
    <div className="w-100 d-flex justify-content-center">
      <div>
        <Button
          shape="circular"
          appearance="primary"
          className={colorOverrides.miss}
          onClick={() => addValueWithMultiplier(0, 1)}
        >
          MISS
        </Button>
      </div>
      <div className="mx-3">
        <Button
          shape="circular"
          appearance="primary"
          className={colorOverrides.bull}
          onClick={() => addValueWithMultiplier(25, 1)}
        >
          BULL
        </Button>
      </div>
      <div>
        <Button
          shape="circular"
          appearance="primary"
          className={colorOverrides.bullseye}
          onClick={() => addValueWithMultiplier(25, 2)}
        >
          BULLSEYE
        </Button>
      </div>
    </div>
  );
}

interface MultiplierButtonsProps {
  setMultiplier: (multiplier: Multiplier) => void;
}

function MultiplierButtons({ setMultiplier }: MultiplierButtonsProps) {
  const colorOverrides = useColorOverrides();

  return (
    <div className="w-100 d-flex justify-content-center">
      <Button
        appearance="primary"
        className={colorOverrides[1]}
        onClick={() => setMultiplier(1)}
      >
        Single
      </Button>
      <div className="mx-3">
        <Button
          appearance="primary"
          className={colorOverrides[2]}
          onClick={() => setMultiplier(2)}
        >
          Double
        </Button>
      </div>
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

interface TwentyButtonsProps {
  multiplier: Multiplier;
  addValue: (value: number) => void;
}

function TwentyButtons({ multiplier, addValue }: TwentyButtonsProps) {
  const colorOverrides = useColorOverrides();

  /**
   * Range from 1..20
   * @type {number[]}
   */
  const numberArray = Array.from({ length: 20 }, (_, idx) => idx + 1);

  return (
    <div className="w-100 d-flex flex-wrap justify-content-center">
      {numberArray.map((number, idx) => (
        <div className="m-1" key={idx}>
          <Button
            className={colorOverrides[multiplier]}
            shape="circular"
            appearance="primary"
            onClick={() => addValue(number)}
          >
            {number}
          </Button>
        </div>
      ))}
    </div>
  );
}

interface InputButtonsProps {
  addInput: (value: number, multiplier: Multiplier) => void;
}

export function InputButtons({ addInput }: InputButtonsProps) {
  const [multiplier, setMultiplier] = useState<Multiplier>(1);

  function handleValueWithImplicitMultiplier(value: number) {
    addInput(value, multiplier);
    resetMultiplier();
  }

  function handleValueWithMultiplier(value: number, multiplier: Multiplier) {
    addInput(value, multiplier);
    resetMultiplier();
  }

  function resetMultiplier() {
    setMultiplier(1);
  }

  return (
    <>
      <div className="mb-4">
        <SpecialButtons addValueWithMultiplier={handleValueWithMultiplier} />
      </div>
      <div className="mb-2">
        <MultiplierButtons setMultiplier={setMultiplier} />
      </div>
      <div>
        <TwentyButtons
          multiplier={multiplier}
          addValue={handleValueWithImplicitMultiplier}
        />
      </div>
    </>
  );
}
