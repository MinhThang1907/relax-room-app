const getBackendUrl = (): string => {
  const url = process.env.NEXT_PUBLIC_BACKEND_URL
  if (!url) {
    throw new Error("NEXT_PUBLIC_BACKEND_URL environment variable is not set")
  }
  return url.replace(/\/$/, "") // Remove trailing slash
}

export const env = {
  backendUrl: getBackendUrl(),
}
