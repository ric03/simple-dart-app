import { Button, Input, Label, useId } from '@fluentui/react-components';
import { useState } from 'react';

export function AddPlayer({ addPlayer }) {
  const nameInputId = useId("input-name")
  const [name, setName] = useState('');

  function handleAddPlayer() {
    if (name && name.length > 0) {
      addPlayer(name);
      setName('');
    }
  }

  return (
    <div>
      <p>Would you like to add a player?</p>
      <Label htmlFor={nameInputId}>Name</Label>
      <Input
        id={nameInputId}
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <Button onClick={() => handleAddPlayer()}>Add Player</Button>
    </div>
  );
}
