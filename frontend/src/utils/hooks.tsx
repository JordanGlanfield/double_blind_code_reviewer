import { useEffect, useState } from "react";

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
    setState({data: undefined, isFetching: true, hasError: false});

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