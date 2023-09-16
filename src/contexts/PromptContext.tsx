import React, { FC, useContext, useMemo, useState } from "react";
import { PromptProps } from "../components/Prompt/Prompt";

interface PromptContextInterface {
  prompts?: PromptProps[];
  addPrompt: (prompt: PromptProps) => void;
  removePrompt: (id: string) => void;
}

const PromptContext = React.createContext<PromptContextInterface>({
  prompts: undefined,
  addPrompt: () => {},
  removePrompt: () => {},
});

export const PromptProvider: FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [prompts, setPrompt] = useState<PromptProps[]>([]);

  const value = useMemo(
    () => ({
      prompts,
      addPrompt: (newPrompt: PromptProps) =>
        setPrompt((prev) => [...prev, newPrompt]),
      removePrompt: (id: string) =>
        setPrompt((prev) => prev?.filter((prompt) => prompt.id !== id)),
    }),
    [prompts, setPrompt]
  );
  return (
    <PromptContext.Provider value={value}>{children}</PromptContext.Provider>
  );
};

export const usePrompts = () => {
  const user = useContext(PromptContext);

  return user;
};
