import { FC, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { Block } from "../../components";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation, useQuery } from "react-query";
import { ErrorRequest } from "../../__api__/helpers";
import { useUser } from "../../contexts/UserContext";
import { useNotifications } from "../../contexts/NotificationContext";
import { setXSRF } from "../../utils/cookie";
import { changeUser, fetchUser } from "../../__api__/users";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { EditableImage } from "../../components/EditableImage";
import {
  getValidationErrorsFromREsponse,
  imageSchema,
} from "../../services/validation";

interface ChangeAvatarFormProps {}

interface UserProfile {
  avatar?: File;
}

export const ChangeAvatarForm: FC<ChangeAvatarFormProps> = () => {
  const { user, setUser } = useUser();
  const { refetch } = useQuery("user", fetchUser, {
    onSuccess: (data) => {
      setUser(data);
    },
    placeholderData: user,
  });

  const [isEditing, setIsEditing] = useState(false);

  const { addAlert } = useNotifications();
  const {
    setError,
    handleSubmit,
    control,
    setValue,
    watch,
    reset,
    formState: { errors, isValid, isDirty },
  } = useForm<UserProfile>({
    defaultValues: {
      avatar: undefined,
    },
    resolver: yupResolver(imageSchema),
    mode: "all",
  });
  const avatar = watch("avatar");
  const onClose = () => {
    reset({ avatar: undefined });
    setIsEditing(false);
  };

  const { mutate, isLoading, error } = useMutation<
    {
      avatar?: string;
    },
    ErrorRequest,
    FormData,
    unknown
  >(changeUser, {
    onSuccess: () => {
      setXSRF();
      setIsEditing(false);
      refetch();
      addAlert({
        mode: "success",
        text: "Your avatar was updated",
      });
    },
    onError: async (error) => {
      if (error) {
        getValidationErrorsFromREsponse<UserProfile>({
          error,
          setError,
        });
      }
    },
  });

  const onSubmit: SubmitHandler<UserProfile> = async (data) => {
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
        <div className="is-flex is-justify-content-center">
          <EditableImage
            setIsEditing={() => setIsEditing(true)}
            src={
              user?.avatar
                ? `data:image/png;base64,${user?.avatar}`
                : "/static/media/avatar.svg"
            }
          />
        </div>
      </div>
      {isEditing && (
        <div className={`modal${isEditing ? " is-active" : ""}`}>
          <div className="modal-background"></div>
          <div className="modal-content">
            <div className="box has-background-white">
              <Block title="Upload your photo">
                <div className="is-flex is-justify-content-center my-5">
                  {avatar ? (
                    <div>
                      <figure className="image is-128x128 image-preview">
                        <img
                          className="is-rounded has-background-grey"
                          src={URL.createObjectURL(avatar)}
                          alt="Avatar"
                        />
                      </figure>
                      {(errors?.avatar?.message || error?.message) && (
                        <p className="help is-danger">
                          {errors?.avatar?.message || error?.message}
                        </p>
                      )}
                    </div>
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
                      className={
                        isLoading ? "button ml-3 is-loading" : "ml-3 button"
                      }
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
            onClick={onClose}
          ></button>
        </div>
      )}
    </form>
  );
};
