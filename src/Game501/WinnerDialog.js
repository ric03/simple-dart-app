import {
  Button,
  Dialog,
  DialogActions,
  DialogBody,
  DialogContent,
  DialogSurface,
  DialogTitle,
  DialogTrigger,
} from '@fluentui/react-components';

export function WinnerDialog({ isDialogOpen, playerName, updateOpen }) {
  return (
    <Dialog
      open={isDialogOpen}
      onOpenChange={(event, data) => updateOpen(data.open)}
    >
      <DialogSurface>
        <DialogBody>
          <DialogTitle>
            Congratulations, {playerName}, you have won!
          </DialogTitle>
          <DialogContent>
            <p>Should we display something here? Maybe a statistic?</p>
            <p>Rounds</p>
            <p> Average Points per throw, lowest, best</p>
            <p>Maybe even display a chart?</p>
            <p>how did the contestants perform? was it close?</p>
          </DialogContent>
          <DialogActions>
            <DialogTrigger disableButtonEnhancement>
              <Button appearance="secondary">Close</Button>
            </DialogTrigger>
            <Button appearance="primary">
              Do Something (not yet implemented)
            </Button>
          </DialogActions>
        </DialogBody>
      </DialogSurface>
    </Dialog>
  );
}
