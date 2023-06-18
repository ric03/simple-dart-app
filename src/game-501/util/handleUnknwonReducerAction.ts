export function handleUnknownReducerAction(action: Partial<{type: string}>) {
  throw Error('Unknown action: ' + action?.type);
}
