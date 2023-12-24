import { Columns, Header, Main } from "../components";
import { PlainLayout } from "../layouts/plain";
import { useUser } from "../contexts/UserContext";
import { PartiesList } from "../containers/PartiesList";
import { useNavigate } from "react-router";
import { useEffect } from "react";
import { CreatePartyForm } from "../containers/CreatePartyForm";
import { useTranslation } from "react-i18next";

export const Dashboard = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    if (!user) {
      navigate("/");
    }
  }, [navigate, user]);

  return (
    <PlainLayout
      Header={
        <Header>
          <h1 className="title is-1">
            {t("TITLE_DASHBOARD", { name: user?.name })}
          </h1>
        </Header>
      }
      Main={
        <Main>
          {user && (
            <Columns>
              <div className="box">
                <CreatePartyForm />
              </div>
              <div>
                <PartiesList />
              </div>
            </Columns>
          )}
        </Main>
      }
    />
  );
};

Dashboard.whyDidYouRender = true;

export default Dashboard;
