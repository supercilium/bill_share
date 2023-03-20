import React, { FC, useContext, useEffect, useState } from "react";
import { useQuery } from "react-query";
import { User } from "../types/user";
import { fetchToken } from "../__api__/auth";

export const USER_KEY = "user";

interface UserContextInterface {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

const UserContext = React.createContext<UserContextInterface>({
  user: null,
  setUser: () => {},
});

export const UserProvider: FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [user, setUser] = useState<User | null>(
    localStorage.getItem(USER_KEY)
      ? (JSON.parse(localStorage.getItem(USER_KEY) || "{}") as User)
      : null
  );

  useQuery(["csrf-token"], fetchToken, {
    onSuccess: (data) => {
      window.requestAnimationFrame(() => {
        document
          .querySelector("meta[name='_csrf_header']")
          ?.setAttribute("content", data.token);
      });
    },
  });

  useEffect(() => {
    if (user) {
      window.localStorage.setItem(USER_KEY, JSON.stringify(user));
    } else {
      window.localStorage.removeItem(USER_KEY);
    }
  }, [user]);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const user = useContext(UserContext);

  return user;
};
