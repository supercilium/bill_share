import { FC } from "react";

export const Field: FC<{ label: string }> = ({ label }) => {
  return (
    <div className="field">
      <label htmlFor="userName" className="label">
        {label}
      </label>
      <input
        className="input"
        type="text"
        // name="userName"
        // value={userName}
        // onChange={({ target }) => setUserName(target.value)}
      />
    </div>
  );
};
