export function handleUnknownReducerAction(action) {
  throw Error('Unknown action: ' + action?.type);
}
