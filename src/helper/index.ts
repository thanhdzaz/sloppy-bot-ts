export function ErrorBound(executor: any) {
  try {
    executor();
  } catch (error) {
    console.log('ERROR: ', error.message);
  }
}