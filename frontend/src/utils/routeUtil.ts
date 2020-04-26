import { RouteComponentProps } from "react-router-dom";

export function extractPath(prefix: string, fullPath: string): string {
  let parts = fullPath.split(prefix);

  if (parts.length < 2) {
    return "";
  }

  if (parts[1].startsWith("/")) {
    return parts[1].substring(1);
  }

  return parts[1];
}

// Accepts route properties and returns the path being referred to in the URL
// assuming that the path begins after the matched portion of the URL.
export function extractPathFromRoute(props: RouteComponentProps) {
  return extractPath(props.match.url, props.location.pathname);
}

export function getFileName(path: string): string {
  const lastSlash = getLastSlash(path);

  return path.substring(lastSlash, path.length);
}

export function getNextDirUp(path: string): string {
  const lastSlash = getLastSlash(path);

  return path.substring(0, lastSlash);
}

function getLastSlash(path: string): number {
  const lastSlash = path.lastIndexOf("/");

  return lastSlash > 0 ? lastSlash : 0;
}

export function getFileExtension(name: string): string {
  let split = name.split(".");

  if(split.length <= 1 || ( split[0] === "" && split.length === 2 )) {
    return "";
  }

  return split.pop() as string;
}