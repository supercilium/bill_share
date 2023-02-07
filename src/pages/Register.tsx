import { Header, Main } from "../components";
import { PlainLayout } from "../layouts/plain";
import { RegisterForm } from "../containers/RegisterForm";

export const Register = () => {
  return (
    <PlainLayout
      Header={
        <Header>
          <h1 className="title is-1">Register</h1>
        </Header>
      }
      Main={
        <Main>
          <RegisterForm />
        </Main>
      }
    />
  );
};

Register.whyDidYouRender = true;
