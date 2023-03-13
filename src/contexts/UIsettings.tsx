import React, { FC, useContext, useEffect, useState } from "react";

export const IS_PARTY_HINTS_HIDDEN = "IS_PARTY_HINTS_HIDDEN";

export interface UISettings {
  isAsideVisible: boolean;
  areHintsVisible: boolean;
  setHintsVisibility: React.Dispatch<React.SetStateAction<boolean>>;
  setAsideVisibility: React.Dispatch<React.SetStateAction<boolean>>;
}

const UISettingsContext = React.createContext<UISettings>({
  isAsideVisible: false,
  areHintsVisible: true,
  setAsideVisibility: () => {},
  setHintsVisibility: () => {},
});

export const UISettingsProvider: FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [isAsideVisible, setAsideVisibility] = useState(false);
  const [areHintsVisible, setHintsVisibility] = useState(
    !localStorage.getItem(IS_PARTY_HINTS_HIDDEN)
  );
  const value = {
    isAsideVisible,
    areHintsVisible,
    setAsideVisibility,
    setHintsVisibility,
  };

  useEffect(() => {
    if (isAsideVisible) {
      window.requestAnimationFrame(() => {
        document.documentElement.classList.add("is-clipped");
      });
    } else {
      window.requestAnimationFrame(() => {
        document.documentElement.classList.remove("is-clipped");
      });
    }
  }, [isAsideVisible]);

  return (
    <UISettingsContext.Provider value={value}>
      {children}
    </UISettingsContext.Provider>
  );
};

export const useUISettings = () => {
  const settings = useContext(UISettingsContext);

  return settings;
};
