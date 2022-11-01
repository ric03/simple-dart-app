import { Button, Text } from '@fluentui/react-components';
import { useState } from 'react';
import { useImmerReducer } from 'use-immer';
import { InputButtons } from './InputButtons';
import { handleUnknownReducerAction } from './util/handleUnknwonReducerAction';

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

export function ThrowInput({ submitThrows }) {
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
