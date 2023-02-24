import { Columns, Header, Main } from "../components";
import { PlainLayout } from "../layouts/plain";
import { LoginForm } from "../containers/LoginForm";
import { RegisterForm } from "../containers/RegisterForm";
import { useState } from "react";
import { useUser } from "../contexts/UserContext";
import { CreatePartyForm } from "../containers/CreatePartyForm";
import { Navbar } from "../containers/Navbar";
import { PartiesList } from "../containers/PartiesList";

export const Home = () => {
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  const { user } = useUser();
  const { token } = user || {};

  return (
    <PlainLayout
      Navbar={<Navbar shouldShowAuthButtons={false} />}
      Header={
        <Header>
          <h1 className="title is-1">Party for everybody</h1>
        </Header>
      }
      Main={
        <Main>
          <Columns>
            {token ? (
              <div className="box">
                <CreatePartyForm />
              </div>
            ) : (
              <div className="box">
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
                {activeTab === "login" && <LoginForm />}
                {activeTab === "register" && <RegisterForm />}
              </div>
            )}
            <div>{user && <PartiesList />}</div>
          </Columns>
        </Main>
      }
    />
  );
};

Home.whyDidYouRender = true;
