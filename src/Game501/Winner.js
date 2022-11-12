import { Title1 } from '@fluentui/react-components';

export function Winner({ player }) {
  return (
    <div>
      <Title1>
        Congratulations,{' '}
        <span style={{ textDecoration: 'underline' }}>{player.name}</span>, you
        have won.
      </Title1>
    </div>
  );
}
