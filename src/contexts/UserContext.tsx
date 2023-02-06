import React, { FC, useContext, useState } from "react";
import { User } from "../types/user";

export const USER_KEY = "user";

const UserContext = React.createContext<
  User & {
    setUser: React.Dispatch<React.SetStateAction<User>>;
  }
>({
  name: "",
  id: "",
  token: "",
  setUser: () => {},
});

export const UserProvider: FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem(USER_KEY) || "{}") as User
  );

  return (
    <UserContext.Provider value={{ ...user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const user = useContext(UserContext);

  return user;
};
