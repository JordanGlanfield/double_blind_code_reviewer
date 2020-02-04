import {RouteComponentProps} from "react-router-dom";

function extractPath(prefix: string, fullPath: string): string {
  let parts = fullPath.split(prefix);

  if (parts.length < 2) {
    return "";
  }

  return parts[1];
}

// Accepts route properties and returns the path being referred to in the URL
// assuming that the path begins after the matched portion of the URL.
export function extractPathFromRoute(props: RouteComponentProps) {
  return extractPath(props.match.url, props.location.pathname);
}

export function getNextDirUp(path: string): string {
  if (path === "") {
    return "";
  }

  const lastSlash = path.lastIndexOf("/");
  return path.substring(0, lastSlash);
}