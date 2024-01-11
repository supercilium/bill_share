/* eslint-disable jsx-a11y/anchor-is-valid */
import { FC, useCallback, useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTranslation } from "react-i18next";
import cx from "classnames";
import { Item } from "../../types/item";
import "./OtherItem.scss";
import { createPortal } from "react-dom";
import { useClickOutside } from "../../hooks/useClickOutside";
import { Modal } from "../Modal";
import { EditItemForm } from "../../containers/EditItemForm";

type IOtherItem = Item & { originalIndex: number; isMuted?: boolean };

interface OtherItemProps {
  item: IOtherItem;
  isReadOnly?: boolean;
  onAddItem: (item: IOtherItem) => void;
  onDeleteItem: (id: string) => void;
  onChangeItem: (
    item: Partial<Omit<Item, "id" | "users">> & { itemId: string }
  ) => void;
}

export const OtherItem: FC<OtherItemProps> = ({
  item,
  onAddItem,
  isReadOnly = true,
  onDeleteItem,
  onChangeItem,
}) => {
  const { t } = useTranslation();
  const ref = useRef<HTMLDivElement>(null);
  const refDropdown = useClickOutside<HTMLDivElement>(() => setIsOpen(false));

  const [isOpen, setIsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const setMenuPosition = useCallback(() => {
    requestAnimationFrame(() => {
      const bound = ref.current?.getBoundingClientRect();
      refDropdown?.current?.setAttribute(
        "style",
        `top: ${bound?.bottom}px; left: ${bound?.left}px`
      );
    });
  }, [refDropdown]);

  const handleOpenDropdown = () => {
    setIsOpen(true);
    setMenuPosition();
  };

  useEffect(() => {
    if (!isOpen) {
      return;
    }
    const handleScroll = () => {
      if (isOpen) {
        setMenuPosition();
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isOpen, setMenuPosition]);

  return (
    <>
      <div
        key={item.id}
        className={cx("other-item-row", {
          "has-text-grey": item.isMuted,
          "is-clickable": !item.isMuted && !isReadOnly,
          active: isOpen,
        })}
        title={t("CLICK_TO_SEE_MENU")}
      >
        <div
          onClick={() => !isReadOnly && !item.isMuted && handleOpenDropdown()}
          className="other-item p-2"
          aria-controls="dropdown-menu"
          ref={ref}
        >
          <span className="text-overflow-hidden is-size-5">{item.name}</span>
          <span className="is-size-5">{item.amount}</span>
          <span className="is-size-5">{item.price}</span>
          <div className="has-text-right is-pulled-right is-justify-content-flex-end full-width is-size-5">
            <span className="icon">
              <FontAwesomeIcon icon="ellipsis-vertical" />
            </span>
          </div>
        </div>
        {isOpen &&
          createPortal(
            <div
              ref={refDropdown}
              className="dropdown-item-menu dropdown-menu"
              id="dropdown-menu"
              role="menu"
            >
              <div className="dropdown-content">
                <a
                  onClick={() => onAddItem(item)}
                  className="dropdown-item has-text-primary"
                >
                  {t("ADD_TO_BILL", { name: item.name })}
                </a>
                <a
                  onClick={() => {
                    setIsOpen(false);
                    setIsEditing(true);
                  }}
                  className="dropdown-item"
                >
                  {t("BUTTON_EDIT")}
                </a>
                <a
                  onClick={() => onDeleteItem(item.id)}
                  className="dropdown-item has-text-danger"
                >
                  {t("BUTTON_DELETE_FROM_PARTY")}
                </a>
              </div>
            </div>,
            document.body
          )}
      </div>
      {isEditing &&
        createPortal(
          <Modal onClose={() => setIsEditing(false)} isOpen={isEditing}>
            <EditItemForm
              onClose={() => setIsEditing(false)}
              onChangeItem={onChangeItem}
              isReadOnly={isReadOnly}
              item={item}
            />
          </Modal>,
          document.body
        )}
    </>
  );
};
