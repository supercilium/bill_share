import { Columns, Header, Main } from "../components";
import { PlainLayout } from "../layouts/plain";
import { useUser } from "../contexts/UserContext";
import { Navbar } from "../containers/Navbar";
import { PartiesList } from "../containers/PartiesList";
import { useNavigate } from "react-router";
import { useEffect } from "react";
import { CreatePartyForm } from "../containers/CreatePartyForm";

export const Profile = () => {
  const { user } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/");
    }
  }, [navigate, user]);

  return (
    <PlainLayout
      Navbar={<Navbar shouldShowAuthButtons={false} />}
      Header={
        <Header>
          <h1 className="title is-1">Hello, {user?.name}!</h1>
        </Header>
      }
      Main={
        <Main>
          <Columns>
            <div>
              {user && (
                <>
                  <div className="box mb-4">
                    <CreatePartyForm />
                  </div>
                  <PartiesList />
                </>
              )}
            </div>
            <div />
          </Columns>
        </Main>
      }
    />
  );
};

Profile.whyDidYouRender = true;

export default Profile;
