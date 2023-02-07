import { FC } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { Field } from "../../components";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { RegisterInterface } from "../../types/user";
import { fetchRegister } from "../../__api__/auth";
import { useUser } from "../../contexts/UserContext";

const schema = yup
  .object({
    name: yup.string().required(),
    email: yup.string().required(),
    password: yup.string().required(),
  })
  .required();
interface RegisterFormProps {}

export const RegisterForm: FC<RegisterFormProps> = (props) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isDirty },
  } = useForm<RegisterInterface>({
    resolver: yupResolver(schema),
    mode: "onBlur",
  });
  const { setUser } = useUser();

  const onSubmit: SubmitHandler<RegisterInterface> = async (data) => {
    if (!isValid) {
      return;
    }
    const response = await fetchRegister(data);
    if ("token" in response) {
      setUser(response);
    }
  };

  return (
    <form id="register-form" className="mt-5" onSubmit={handleSubmit(onSubmit)}>
      <div className="block">
        <Field
          label="Enter your name"
          error={errors.name}
          inputProps={{ type: "text", ...register("name") }}
        />
        <Field
          label="Enter your email"
          error={errors.email}
          inputProps={{ type: "email", ...register("email") }}
        />
        <Field
          label="Enter your password"
          error={errors.password}
          inputProps={{ type: "password", ...register("password") }}
        />
        <button
          type="submit"
          className="button"
          disabled={!isValid || !isDirty}
        >
          Register
        </button>
      </div>
    </form>
  );
};
