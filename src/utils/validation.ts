import { FieldValues, Path, UseFormSetError } from "react-hook-form";
import { array, object, string, number } from "yup";
import { ErrorRequest } from "../__api__/helpers";

export const createPartySchema = object({
  // userName: yup.string().required(),
  partyName: string().required(),
  id: string().required(),
}).required();

const name = string()
  .required("Field should not be empty")
  .min(2, "Name must be at least two characters")
  .max(255, "Length should not exceeds 255 characters");

const password = string()
  .required("Field should not be empty")
  .min(8, "Password should be at least 8 characters")
  .matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d\w\W]{8,}$/,
    "A password should contain letters (in both registers) and numbers"
  )
  .max(30, "Length should not exceeds 30 characters");

const email = string()
  .required("Field should not be empty")
  .email("Please enter a valid e-mail");

const price = number()
  .typeError("Price must be a number")
  .min(0, "Price should be positive!")
  .default(0)
  .required();

const amount = number()
  .typeError("Amount must be a number")
  .min(0, "Amount should be positive!")
  .integer()
  .required();

export const itemsSchema = object({
  items: array().of(
    object().shape({
      name: string().required(),
      price,
      amount,
      discount: number()
        .typeError("Discount must be a number")
        .min(0, "Discount should be positive!")
        .max(100, "Should not exceed 100%")
        .default(0),
      users: array()
        .nullable()
        .of(
          object().shape({
            value: number()
              .typeError("Amount must be a number")
              .min(0, "Amount should be positive!")
              .integer(),
          })
        ),
    })
  ),
}).required();

export const addUserSchema = object({
  identifier: name,
}).required();

export const addItemSchema = object({
  name,
  price,
  amount,
}).required();

export const signInSchema = object({
  name,
  email,
  password,
}).required();

export const loginSchema = object({
  email,
  password: string().required("Field should not be empty"),
}).required();

export const partySettingsSchema = object({
  discount: number()
    .positive()
    .test({
      name: "max",
      exclusive: false,
      params: {},
      // eslint-disable-next-line no-template-curly-in-string
      message: "${path} must be less than total price",
      test: function (value) {
        if (this.parent.isPercentage) {
          return (value || 0) <= 100;
        }
        return (value || 0) <= parseFloat(this.parent.total);
      },
    })
    .default(0),
}).required();

export const getValidationErrorsFromREsponse = <
  T extends FieldValues = FieldValues
>({
  error,
  setError,
}: {
  error: ErrorRequest;
  setError: UseFormSetError<T>;
}) => {
  if (error.validation) {
    Object.keys(error.validation).forEach((key: string) => {
      setError(key as Path<T>, {
        type: "value",
        message: error?.validation?.[key],
      });
    });
  }
};
