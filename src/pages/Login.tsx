import { Header, Main } from "../components";
import { PlainLayout } from "../layouts/plain";
import { LoginForm } from "../containers/LoginForm";

export const Login = () => {
  return (
    <PlainLayout
      Header={
        <Header>
          <h1 className="title is-1">Log in</h1>
        </Header>
      }
      Main={
        <Main>
          <LoginForm />
        </Main>
      }
    />
  );
};

Login.whyDidYouRender = true;
