import React, { FC, useContext, useState } from "react";
import { PromptProps } from "../components/Prompt/Prompt";

interface PromptContextInterface {
  prompts?: PromptProps;
  addPrompt: React.Dispatch<React.SetStateAction<PromptProps | undefined>>;
  removePrompt: () => void;
}

const PromptContext = React.createContext<PromptContextInterface>({
  prompts: undefined,
  addPrompt: () => {},
  removePrompt: () => {},
});

export const PromptProvider: FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [prompts, setPrompt] = useState<PromptProps>();

  return (
    <PromptContext.Provider
      value={{
        prompts,
        addPrompt: setPrompt,
        removePrompt: () => setPrompt(undefined),
      }}
    >
      {children}
    </PromptContext.Provider>
  );
};

export const usePrompts = () => {
  const user = useContext(PromptContext);

  return user;
};
