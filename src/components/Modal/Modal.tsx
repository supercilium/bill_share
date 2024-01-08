import { FC, ReactNode } from "react";
import { useClickOutside } from "../../hooks/useClickOutside";

interface ModalProps {
  children: ReactNode;
  isOpen: boolean;
  onClose: () => void;
}

export const Modal: FC<ModalProps> = (props) => {
  const ref = useClickOutside<HTMLDivElement>(() => props.onClose());

  if (!props.isOpen) {
    return null;
  }
  return (
    <div className={`modal${props.isOpen ? " is-active" : ""}`}>
      <div className="modal-background"></div>
      <div ref={ref} className="modal-content">
        <div className="box has-background-white">{props.children}</div>
      </div>
      <button
        className="modal-close is-large"
        aria-label="close"
        onClick={() => props.onClose()}
      ></button>
    </div>
  );
};