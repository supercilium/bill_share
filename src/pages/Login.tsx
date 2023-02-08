import { Header, Main } from "../components";
import { PlainLayout } from "../layouts/plain";
import { LoginForm } from "../containers/LoginForm";
import { useState } from "react";
import { RegisterForm } from "../containers/RegisterForm";

export const Login = () => {
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
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
          <div className="columns is-desktop is-flex is-justify-content-center">
            <div className="column is-half">
              <div className="box">
                {activeTab === "login" && <LoginForm />}
                {activeTab === "register" && <RegisterForm />}
              </div>
            </div>
          </div>
        </Main>
      }
    />
  );
};

Login.whyDidYouRender = true;
