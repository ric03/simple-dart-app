import { Button, Text, Tooltip } from '@fluentui/react-components';
import { EditRegular, SaveRegular } from '@fluentui/react-icons';
import { useState } from 'react';
import { Throw } from './types/throw.ts';
import { Multiplier } from './types/multiplier.ts';
import { InputButtons } from './InputButtons.tsx';
import { useGameState } from './state/game.state.ts';
import { Tile } from './Tile.tsx';

interface ThrowOutputProps {
  item: Throw;
  idx: number;
  updateIdx: number | undefined;
  initUpdate: (idx: number) => void;
  endUpdate: () => void;
}

function ThrowOutput({
  item,
  idx,
  updateIdx,
  initUpdate,
  endUpdate,
}: ThrowOutputProps) {
  const { value, multiplier } = item;
  const computedValue = value * multiplier;

  function handleEdit() {
    initUpdate(idx);
  }

  function handleSave() {
    endUpdate();
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
        <Tooltip content="Edit" relationship="label">
          <Button
            size="small"
            appearance="transparent"
            onClick={() => handleEdit()}
            icon={<EditRegular />}
          />
        </Tooltip>
      ) : (
        <Button
          size="small"
          appearance="primary"
          onClick={() => handleSave()}
          icon={<SaveRegular />}
        >
          Save
        </Button>
      )}
    </div>
  );
}

export function ThrowInput() {
  const {
    addThrow,
    updateThrowByIdx,
    removeLastThrow,
    submitThrows,
    currentThrows,
    getSumOfCurrentThrows,
  } = useGameState();

  const { getCurrentPlayer } = useGameState();

  const [updateIdx, setUpdateIdx] = useState<number | undefined>(undefined);

  function handleInput(value: number, multiplier: Multiplier) {
    if (updateIdx !== undefined) {
      updateThrowByIdx({ value, multiplier }, updateIdx);
    } else {
      addThrow({ value, multiplier });
    }
  }

  function handleStartUpdateThrow(idx: number) {
    setUpdateIdx(idx);
  }

  function handleEndUpdateThrow() {
    setUpdateIdx(undefined);
  }

  function handleRemoveLastThrow() {
    setUpdateIdx(undefined);
    removeLastThrow();
  }

  function handleSubmit() {
    setUpdateIdx(undefined);
    submitThrows();
  }

  return (
    <div className="mb-3">
      <Tile>
        <InputButtons addInput={handleInput} />
      </Tile>
      <Tile>
        <div className="mb-3">
          <div className="my-1">
            <Text>
              It's your turn{' '}
              <span className="fw-bold">{getCurrentPlayer().name}</span>.{' '}
              {currentThrows.length < 3 && 'Please select a number.'}
            </Text>
          </div>
          {currentThrows.map((item: Throw, idx: number) => (
            <ThrowOutput
              item={item}
              key={idx}
              idx={idx}
              updateIdx={updateIdx}
              initUpdate={handleStartUpdateThrow}
              endUpdate={handleEndUpdateThrow}
            />
          ))}
        </div>

        {currentThrows.length > 0 && (
          <div className="mb-3">Sum: {getSumOfCurrentThrows()}</div>
        )}

        {currentThrows.length > 0 && (
          <Button className="me-3" onClick={() => handleRemoveLastThrow()}>
            Revert Last Throw
          </Button>
        )}

        <Button
          appearance="primary"
          disabled={currentThrows.length !== 3}
          onClick={() => {
            handleSubmit();
          }}
        >
          Submit
        </Button>
      </Tile>
    </div>
  );
}
