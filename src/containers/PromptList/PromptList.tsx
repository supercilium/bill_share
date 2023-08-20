import { FC } from "react";
import { usePrompts } from "../../contexts/PromptContext";
import "./PromptList.scss";
import { Prompt } from "../../components/Prompt";

interface PromptListProps {}

export const PromptList: FC<PromptListProps> = (props) => {
  const { prompts } = usePrompts();

  return (
    <div className="prompts-container">
      {prompts?.length
        ? prompts.map((item) => {
            return <Prompt key={item.id} {...item} />;
          })
        : null}
    </div>
  );
};
