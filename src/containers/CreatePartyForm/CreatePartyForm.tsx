import { FC } from "react";
import * as yup from "yup";
import { createParty } from "../../__api__/party";
import { yupResolver } from "@hookform/resolvers/yup";
import { CreatePartyInterface } from "../../types/party";
import { SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { Field } from "../../components";
import { useUser } from "../../contexts/UserContext";

interface CreatePartyFormProps {}

const schema = yup
  .object({
    // userName: yup.string().required(),
    partyName: yup.string().required(),
    id: yup.string().required(),
  })
  .required();

export const CreatePartyForm: FC<CreatePartyFormProps> = (props) => {
  const { id } = useUser();
  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isDirty },
  } = useForm<CreatePartyInterface>({
    defaultValues: {
      // userName: name,
      id,
    },
    resolver: yupResolver(schema),
    mode: "onBlur",
  });
  const navigate = useNavigate();

  const onSubmit: SubmitHandler<CreatePartyInterface> = async (data) => {
    if (!isValid) {
      return;
    }
    const response = await createParty(data);
    if ("id" in response) {
      // localStorage.setItem("user", JSON.stringify(response.owner));
      navigate(`/party/${response?.id}`);
    }
  };

  return (
    <form
      id="start-new-party"
      className="mt-5"
      action=""
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="block">
        <h2 className="title is-3 my-2">Create your party</h2>
        {/* Field for /party/temporary creation */}
        {/* <Field
          label="Enter your name"
          error={errors.userName}
          inputProps={{ type: "text", ...register("userName") }}
        /> */}
        <Field
          label="Enter your party name"
          error={errors.partyName}
          inputProps={{ type: "text", ...register("partyName") }}
        />
        <button
          type="submit"
          className="button"
          disabled={!isValid || !isDirty}
        >
          Start party
        </button>
      </div>
    </form>
  );
};
