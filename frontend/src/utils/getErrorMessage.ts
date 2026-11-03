export const getErrorMessage = (
  error: unknown,
  fallback = "An unexpected error occurred",
) => (error instanceof Error ? error.message : fallback)
