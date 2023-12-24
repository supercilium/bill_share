import React, { FC, useContext, useEffect, useMemo } from "react";
import { User } from "../types/user";
import { useQuery, useQueryClient } from "react-query";
import { fetchUser } from "../__api__/users";

export const USER_KEY = "user";
export const USER_STALE_TIMEOUT = 1000 * 60 * 60 * 24;
type UserContextValue = User | null | undefined;

interface UserContextInterface {
  user: UserContextValue;
  setUser: (value: UserContextValue) => void;
  refetch: () => void;
}

const UserContext = React.createContext<UserContextInterface>({
  user: null,
  setUser: () => {},
  refetch: () => {},
});

export const UserProvider: FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const queryClient = useQueryClient();
  const query = useQuery(["user"], fetchUser, {
    placeholderData: localStorage.getItem(USER_KEY)
      ? (JSON.parse(localStorage.getItem(USER_KEY) ?? "{}") as User)
      : null,
    refetchOnMount: false,
    staleTime: USER_STALE_TIMEOUT,
  });

  useEffect(() => {
    if (query.data) {
      window.localStorage.setItem(USER_KEY, JSON.stringify(query.data));
    } else {
      window.localStorage.removeItem(USER_KEY);
    }
  }, [query.data]);

  const value = useMemo(
    () => ({
      user: query.data,
      setUser: (data: UserContextValue) =>
        queryClient.setQueryData(["user"], data),
      refetch: () => query.refetch(),
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [query.data, queryClient.setQueryData, query.refetch]
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUser = () => {
  const user = useContext(UserContext);

  return user;
};
