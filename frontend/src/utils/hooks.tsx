import { useEffect, useState } from "react";

export interface FetchableData {
  data: any,
  isFetching: boolean,
  hasError: boolean
}

// Use to load data once from an API. Loading messages or error messages may be displayed based on the flags.
export function useDataSource(api: () => Promise<any>): FetchableData {
  const [state, setState] = useState({data: undefined, isFetching: true, hasError: false});

  useEffect(() => {
    api()
      .then(data => setState({data: data, isFetching: false, hasError: false}))
      .catch(error => {
        console.log(error);
        setState({data: undefined, isFetching: false, hasError: true})
      });
  });

  return state;
}

export function useDataSourceWithMessages(api: () => Promise<any>): FetchableData & {message: string | null} {
  const {data, isFetching, hasError} = useDataSource(api);
  let message = null;

  if (isFetching) {
    message = "Loading...";
  } else if (hasError) {
    message = "Failed to fetch data";
  }

  return {data, isFetching, hasError, message}
}