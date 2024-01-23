import React, { FC, useContext, useMemo, useState } from "react";

interface PartyModalContextValue {
  isAddItemModalOpen: boolean;
  setAddItemModalVisibility: React.Dispatch<React.SetStateAction<boolean>>;
}

export const PartyModalContext = React.createContext<PartyModalContextValue>({
  isAddItemModalOpen: false,
  setAddItemModalVisibility: () => {},
});

export const PartySettingsContextProvider: FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [isAddItemModalOpen, setAddItemModalVisibility] = useState(false);

  const value = useMemo(
    () => ({
      isAddItemModalOpen,
      setAddItemModalVisibility,
    }),
    [isAddItemModalOpen, setAddItemModalVisibility]
  );

  return (
    <PartyModalContext.Provider value={value}>
      {children}
    </PartyModalContext.Provider>
  );
};

export const usePartySettingsContext = () => {
  const value = useContext(PartyModalContext);

  return value;
};
