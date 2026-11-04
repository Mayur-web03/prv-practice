import { useCallback, useEffect, useState } from "react";
import { api } from "../api/client";

// GET helper exposing loading / error / data / retry.
export default function useApi(path) {
  const [state, setState] = useState({ data: null, error: null, loading: true });

  const load = useCallback(() => {
    let alive = true;
    setState((s) => ({ ...s, loading: true, error: null }));
    api
      .get(path)
      .then((data) => alive && setState({ data, error: null, loading: false }))
      .catch((e) => alive && setState({ data: null, error: e.message, loading: false }));
    return () => {
      alive = false;
    };
  }, [path]);

  useEffect(() => load(), [load]);

  return { ...state, retry: load };
}

