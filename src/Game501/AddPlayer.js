import { Button } from '@fluentui/react-components';
import { InputField } from '@fluentui/react-components/unstable';
import { useState } from 'react';

export function AddPlayer({ addPlayer }) {
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
      <InputField
        label="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <Button onClick={() => handleAddPlayer()}>Add Player</Button>
    </div>
  );
}
