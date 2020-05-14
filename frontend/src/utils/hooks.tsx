import React, { useEffect, useState } from "react";
import { Redirect } from "react-router-dom";

export interface FetchableData {
  data: any,
  isFetching: boolean,
  hasError: boolean,
  forceRefetch: () => void
}

// Use to load data once from an API. Loading messages or error messages may be displayed based on the flags.
export function useDataSource(api: () => Promise<any>): FetchableData {
  const [state, setState] = useState({data: undefined, isFetching: true, hasError: false});
  const [fetchId, setFetchId] = useState(0);

  useEffect(() => {
    const requestId = fetchId;

    api()
      .then(data => {
        if (requestId === fetchId) {
          setState({ data: data, isFetching: false, hasError: false })
        }
      })
      .catch(error => {
        if (requestId === fetchId) {
          console.log(error);
          setState({ data: undefined, isFetching: false, hasError: true })
        }
      });
  }, [fetchId]);

  return {
    data: state.data,
    isFetching: state.isFetching,
    hasError: state.hasError,
    forceRefetch: () => setFetchId(fetchId + 1)
  };
}

export function useDataSourceWithMessages(api: () => Promise<any>): FetchableData & {message: string | null} {
  const {data, isFetching, hasError, forceRefetch} = useDataSource(api);
  let message = null;

  if (isFetching) {
    message = "Loading...";
  } else if (hasError) {
    message = "Failed to fetch data";
  }

  return {data, isFetching, hasError, forceRefetch, message}
}

export interface Redirector {
  setRedirect: () => void;
  shouldRedirect: boolean;
  element: JSX.Element;
}

export function useRedirector(getUrl: () => string): Redirector {
  const [shouldRedirect, setShouldRedirect] = useState(false);
  let redirector: Redirector  = {setRedirect: () => setShouldRedirect(true),
    shouldRedirect: shouldRedirect,
    element: <></>};

  if (shouldRedirect) {
    redirector.element = <Redirect to={getUrl()} />
  }

  return redirector;
}