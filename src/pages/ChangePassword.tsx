import { Columns, Main } from "../components";
import { PlainLayout } from "../layouts/plain";
import { ChangePasswordForm } from "../containers/ChangePasswordForm";

export const ChangePassword = () => {
  return (
    <PlainLayout
      Main={
        <Main>
          <Columns
            columnProps={{ className: "column is-half" }}
            containerProps={{
              className: "is-desktop is-flex is-justify-content-center",
            }}
          >
            <div className="mt-6">
              <div className="box">
                <ChangePasswordForm />
              </div>
            </div>
          </Columns>
        </Main>
      }
    />
  );
};

ChangePassword.whyDidYouRender = true;

export default ChangePassword;
