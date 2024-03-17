import { FC, ReactNode } from "react";

interface ModalProps {
  children: ReactNode;
  isOpen: boolean;
  onClose: () => void;
}

export const Modal: FC<ModalProps> = (props) => {
  if (!props.isOpen) {
    return null;
  }
  return (
    <div className={`modal${props.isOpen ? " is-active" : ""}`}>
      <div className="modal-background" onClick={props.onClose}></div>
      <div className="modal-content">
        <div className="box has-background-white">{props.children}</div>
      </div>
      <button
        className="modal-close is-large"
        type="button"
        aria-label="close"
        onClick={props.onClose}
      ></button>
    </div>
  );
};
