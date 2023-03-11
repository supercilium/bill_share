import { useEffect } from "react";
import { QueryKey, useQueryClient } from "react-query";
import { useUser } from "../contexts/UserContext";
import { Transport } from "../services/transport";

export const useLogout = ({ queryKey }: { queryKey: QueryKey }) => {
  const queryClient = useQueryClient();
  const state = queryClient.getQueryState<unknown, Response>(queryKey);
  const { setUser } = useUser();

  useEffect(() => {
    return () => {
      Transport.terminate();
    };
  }, []);

  const { status, error } = state || {};
  useEffect(() => {
    if (status === "error" && error) {
      if (error.status === 401) {
        setUser(null);
        queryClient.setQueryData(queryKey, null);
        Transport.terminate();
      }
    }
  }, [error, queryClient, queryKey, setUser, status]);
};
