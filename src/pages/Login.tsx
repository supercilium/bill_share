import cx from "classnames";
import { Columns, Header, Main } from "../components";
import { PlainLayout } from "../layouts/plain";
import { LoginForm } from "../containers/LoginForm";
import { useEffect, useState } from "react";
import { RegisterForm } from "../containers/RegisterForm";
import { useUser } from "../contexts/UserContext";
import { useLocation, useNavigate } from "react-router";
import { JoinPartyForm } from "../containers/JoinPartyForm";

export const Login = () => {
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  const { user } = useUser();
  const { search } = useLocation();
  const navigate = useNavigate();
  const returnPath = new URLSearchParams(search).get("returnPath");

  useEffect(() => {
    if (user) {
      if (search) {
        returnPath && navigate(returnPath);
      } else {
        navigate("/");
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, search, navigate]);

  return (
    <PlainLayout
      Header={
        <Header>
          <div className="tabs is-large">
            <ul>
              <li className={cx({ "is-active": activeTab === "login" })}>
                {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                <a onClick={() => setActiveTab("login")}>Log in</a>
              </li>
              <li className={cx({ "is-active": activeTab === "register" })}>
                {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                <a onClick={() => setActiveTab("register")}>Register</a>
              </li>
            </ul>
          </div>
        </Header>
      }
      Main={
        <Main>
          <Columns
            columnProps={{ className: "column is-half" }}
            containerProps={{
              className: "is-desktop is-flex is-justify-content-center",
            }}
          >
            <div>
              <div className="box">
                {returnPath && (
                  <p className="has-text-grey-dark is-size-5 mb-3">
                    Log in to proceed
                  </p>
                )}
                {activeTab === "login" && <LoginForm />}
                {activeTab === "register" && <RegisterForm />}
              </div>
            </div>
            {returnPath && (
              <div>
                <div className="box">
                  <p className="has-text-grey-dark is-size-5 mb-3">
                    Join as a guest
                  </p>
                  <JoinPartyForm onSuccess={() => navigate(returnPath)} />
                </div>
              </div>
            )}
          </Columns>
        </Main>
      }
    />
  );
};

Login.whyDidYouRender = true;

export default Login;
