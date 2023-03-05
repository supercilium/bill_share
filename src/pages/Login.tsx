import { Columns, Header, Main } from "../components";
import { PlainLayout } from "../layouts/plain";
import { LoginForm } from "../containers/LoginForm";
import { useEffect, useState } from "react";
import { RegisterForm } from "../containers/RegisterForm";
import { useUser } from "../contexts/UserContext";
import { useLocation, useNavigate } from "react-router";

export const Login = () => {
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  const { user } = useUser();
  const { search } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      if (search) {
        const returnPath = new URLSearchParams(search).get("returnPath");
        returnPath && navigate(returnPath);
      } else {
        navigate("/");
      }
    }
  }, [user, search, navigate]);

  return (
    <PlainLayout
      Header={
        <Header>
          <div className="tabs is-large">
            <ul>
              <li className={activeTab === "login" ? "is-active" : ""}>
                {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                <a onClick={() => setActiveTab("login")}>Log in</a>
              </li>
              <li className={activeTab === "register" ? "is-active" : ""}>
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
                {search && (
                  <p className="has-text-grey-dark is-size-5 mb-3">
                    Log in to proceed
                  </p>
                )}
                {activeTab === "login" && <LoginForm />}
                {activeTab === "register" && <RegisterForm />}
              </div>
            </div>
          </Columns>
        </Main>
      }
    />
  );
};

Login.whyDidYouRender = true;
