
export function extractPath(prefix: string, fullPath: string): string {
  let parts = fullPath.split(prefix);

  if (parts.length < 2) {
    return "";
  }

  return parts[1];
}