import { FC, ReactNode } from "react";
import "./Prompt.scss";

export interface PromptProps {
  title?: ReactNode;
  text: ReactNode;
  onConfirm: () => void;
  confirmLabel: string;
  onCancel?: () => void;
  cancelLabel?: string;
}

export const Prompt: FC<PromptProps> = (props) => {
  return (
    <div className="box prompt">
      {props.title && <p className="title is-5 my-2">{props.title}</p>}
      {props.text && <p className="is-5 mb-5">{props.text}</p>}
      <button
        type="button"
        className="button is-primary mr-2"
        onClick={props.onConfirm}
      >
        {props.confirmLabel}
      </button>
      {props.onCancel && (
        <button type="button" className="button" onClick={props.onCancel}>
          {props.cancelLabel ?? "Cancel"}
        </button>
      )}
    </div>
  );
};
