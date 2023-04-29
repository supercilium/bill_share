import { FC, ReactNode } from "react";
import "./Definition.scss";
import React from "react";

interface DefinitionListProps {
  items: Array<{
    label: ReactNode;
    value?: ReactNode;
  }>;
}

export const DefinitionList: FC<DefinitionListProps> = ({ items }) => {
  if (!items) {
    return null;
  }
  return (
    <div>
      {items.map(({ label, value }, i) => {
        if (!value) {
          return null;
        }
        return (
          <div className="list" key={i}>
            <span className="list-label has-text-weight-semibold">{label}</span>
            <span className="value">{value}</span>
          </div>
        );
      })}
    </div>
  );
};
