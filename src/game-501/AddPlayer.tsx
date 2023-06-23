import { Button, Field, Input, useId } from '@fluentui/react-components';
import { MouseEvent, useState } from 'react';
import { useGameState } from './state/game.state.ts';
import { Tile } from './Tile.tsx';
import { PersonAddFilled } from '@fluentui/react-icons';

export function AddPlayer() {
  const { addPlayer } = useGameState();

  const nameInputId = useId('input-name');
  const [name, setName] = useState('');

  function handleAddPlayer(event: MouseEvent) {
    event.preventDefault();
    if (name && name.length > 0) {
      addPlayer(name);
      setName('');
    }
  }

  return (
    <Tile>
      <p>Would you like to add a player?</p>
      <form>
        <div className="d-flex flex-wrap">
          <div
            className="
          col-12 col-sm-8 col-md-9 col-lg-10
          mb-3 mb-sm-0
          "
          >
            <Field label="Name" className="w-100" required={true}>
              <Input
                id={nameInputId}
                value={name}
                placeholder="Salmon King"
                onChange={(e) => setName(e.target.value)}
                className="me-sm-3"
              />
            </Field>
          </div>
          <div className="col-12 col-sm-4 col-md-3 col-lg-2 d-flex">
            <Button
              onClick={(e) => handleAddPlayer(e)}
              icon={<PersonAddFilled />}
              type="submit"
              className="w-100 align-self-end"
            >
              Add Player
            </Button>
          </div>
        </div>
      </form>
    </Tile>
  );
}
