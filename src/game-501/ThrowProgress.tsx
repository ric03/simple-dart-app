import { Button, Text } from '@fluentui/react-components';
import { useState } from 'react';
import { Throw } from './types/throw.ts';
import { Multiplier } from './types/multiplier.ts';
import { InputButtons } from './InputButtons.tsx';
import { useGameState } from './state/game.state.ts';

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
                       endUpdate
                     }: ThrowOutputProps) {
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
        <Button size='small' onClick={() => handleEdit()}>
          Edit
        </Button>
      ) : (
        <Button appearance='primary' size='small' onClick={() => handleSave()}>
          Save
        </Button>
      )}
    </div>
  );
}


export function ThrowInput() {

  const { addThrow, updateThrowByIdx, removeLastThrow, submitThrows, currentThrows } = useGameState();

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
    removeLastThrow();
  }

  function handleSubmit() {
    submitThrows();
  }

  return (
    <div>
      <InputButtons addInput={handleInput} />
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
      {currentThrows.length > 0 && <Button onClick={() => handleRemoveLastThrow()}>Revert Last Throw</Button>}
      <Button
        disabled={currentThrows.length !== 3}
        onClick={() => {
          handleSubmit();
        }}
      >
        Submit
      </Button>
    </div>
  );
}
