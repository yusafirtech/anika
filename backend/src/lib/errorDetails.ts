// Returns the underlying error message in development so it's easy to debug,
// but omits it in production so internal details (SQL fragments, file paths,
// library internals) never reach the client in an API response.
export function errorDetails(err: unknown): string | undefined {
  if (process.env.NODE_ENV === 'production') return undefined;
  return err instanceof Error ? err.message : String(err);
}
