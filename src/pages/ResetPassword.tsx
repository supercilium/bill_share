import { FC } from "react";
import { useLocation } from "react-router-dom";
import { ResetPasswordForm } from "../containers/ResetPasswordForm";
import { HeroLayout } from "../layouts/heroLayout";

export const ResetPassword: FC = () => {
  const { search } = useLocation();
  const code = new URLSearchParams(search)?.get("code");

  return (
    <HeroLayout>
      <div style={{ minWidth: "600px" }}>
        <p className="title mb-6">Resetting password</p>
        {!code && (
          <p className="subtitle">Check your mailbox and follow instructions</p>
        )}
        {code && (
          <div className="box">
            <ResetPasswordForm code={code} />
          </div>
        )}
      </div>
    </HeroLayout>
  );
};
