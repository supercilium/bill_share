import { useEffect } from "react";
import { QueryKey, useQueryClient } from "react-query";
import { useUser } from "../contexts/UserContext";

export const useLogout = ({ queryKey }: { queryKey: QueryKey }) => {
  const queryClient = useQueryClient();
  const state = queryClient.getQueryState<unknown, Response>(queryKey);
  const { setUser } = useUser();

  const { status, error } = state || {};
  useEffect(() => {
    if (status === "error" && error) {
      if (error.status === 401) {
        setUser(null);
        queryClient.setQueryData(queryKey, null);
      }
    }
  }, [error, queryClient, queryKey, setUser, status]);
};
