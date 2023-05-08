import { FC, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { Block } from "../../components";
import { yupResolver } from "@hookform/resolvers/yup";
import { User } from "../../types/user";
import { useMutation } from "react-query";
import { ErrorRequest } from "../../__api__/helpers";
import { Loader } from "../../components/Loader";
import { useUser } from "../../contexts/UserContext";
import { useNotifications } from "../../contexts/NotificationContext";
import { setXSRF } from "../../utils/cookie";
import { changeUser } from "../../__api__/users";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { EditableImage } from "../../components/EditableImage";

interface RegisterFormProps {
  code?: string;
}

interface UserProfile {
  avatar: File;
}

export const ChangeAvatarForm: FC<RegisterFormProps> = ({ code }) => {
  const { user, setUser } = useUser();
  const [isEditing, setIsEditing] = useState(false);

  const { addAlert } = useNotifications();
  const {
    setError,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors, isValid, isDirty },
  } = useForm<Partial<UserProfile>>({
    defaultValues: {
      avatar: undefined,
    },
    // resolver: yupResolver(resetPasswordSchema),
    mode: "all",
  });
  const avatar = watch("avatar");

  const { status, mutate, isLoading, error } = useMutation<
    User,
    ErrorRequest,
    FormData,
    unknown
  >(changeUser, {
    onSuccess: (data) => {
      setXSRF();
      setUser(data);
      addAlert({
        mode: "success",
        text: "Your avatar was updated",
      });
    },
    onError: async (error) => {
      if (error) {
        // getValidationErrorsFromREsponse<ResetPasswordInterface>({
        //   error,
        //   setError,
        // });
      }
    },
  });

  const onSubmit: SubmitHandler<Partial<UserProfile>> = async (data) => {
    if (!isValid) {
      return;
    }
    const formData = new FormData();
    if (data.avatar) {
      formData.append("avatar", data.avatar);
    }
    mutate(formData);
  };

  return (
    <form noValidate={true} onSubmit={handleSubmit(onSubmit)}>
      <div className="block">
        <EditableImage
          setIsEditing={() => setIsEditing(true)}
          src={user?.avatar || "/static/media/avatar.svg"}
        />
      </div>
      {isEditing && (
        <div className={`modal${isEditing ? " is-active" : ""}`}>
          <div className="modal-background"></div>
          <div className="modal-content">
            <div className="box has-background-white">
              <Block title="Upload your photo">
                <div className="is-flex is-justify-content-center my-5">
                  {avatar ? (
                    <figure className="image is-128x128 image-preview">
                      <img
                        className="is-rounded has-background-grey"
                        src={URL.createObjectURL(avatar)}
                        alt="Avatar"
                      />
                    </figure>
                  ) : (
                    <div className="file is-boxed">
                      <Controller
                        control={control}
                        name="avatar"
                        render={({ field: { value, onChange, ...field } }) => {
                          return (
                            <label className="file-label">
                              <input
                                {...field}
                                accept="image/*"
                                className="file-input"
                                type="file"
                                onChange={(event) => {
                                  onChange(event.target.files?.[0]);
                                }}
                              />

                              <span className="file-cta">
                                <span className="file-icon">
                                  <FontAwesomeIcon icon="upload" />
                                </span>
                                <span className="file-label">
                                  Choose a file…
                                </span>
                              </span>
                            </label>
                          );
                        }}
                      />
                    </div>
                  )}
                </div>
                <div>
                  <button
                    type="submit"
                    className={
                      isLoading
                        ? "button is-primary is-loading"
                        : "is-primary button"
                    }
                    disabled={!isValid || !isDirty || isLoading}
                  >
                    Submit
                  </button>
                  {avatar && (
                    <button
                      type="button"
                      className="button ml-3"
                      onClick={() => setValue("avatar", undefined)}
                    >
                      Choose another file
                    </button>
                  )}
                </div>
              </Block>
            </div>
          </div>
          <button
            className="modal-close is-large"
            aria-label="close"
            onClick={() => {
              setIsEditing(false);
            }}
          ></button>
        </div>
      )}
    </form>
  );
};
