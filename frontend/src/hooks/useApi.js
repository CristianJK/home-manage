import useSWR from "swr";
import api from "../services/api";

const fetcher = (url) => api.get(url).then((res) => res.data);

export function useApi(url, options = {}) {
  const { data, error, isLoading, mutate } = useSWR(url, fetcher, options);

  return {
    data: Array.isArray(data) ? data : data ?? [],
    error,
    isLoading,
    mutate,
  };
}

export function useApiData(url, options = {}) {
  const { data, error, isLoading, mutate } = useSWR(url, fetcher, options);

  return {
    data: data ?? null,
    error,
    isLoading,
    mutate,
  };
}

export { fetcher };
