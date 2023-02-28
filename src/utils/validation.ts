import { FieldValues, Path, UseFormSetError } from "react-hook-form";
import { array, object, string, number } from "yup";
import { ErrorRequest } from "../__api__/helpers";

export const createPartySchema = object({
  // userName: yup.string().required(),
  partyName: string().required(),
  id: string().required(),
}).required();

export const itemsSchema = object({
  items: array().of(
    object().shape({
      name: string().required(),
      price: number().min(0).default(0).required(),
      amount: number().min(0).integer().required(),
      discount: number().min(0).max(100).default(0),
    })
  ),
}).required();

export const addUserSchema = object({
  identifier: string().required(),
}).required();

export const addItemSchema = object({
  name: string().required(),
  price: number().min(0).default(0).required(),
  amount: number().min(1).integer().required(),
}).required();

export const signInSchema = object({
  name: string().required(),
  email: string().required(),
  password: string().required(),
}).required();

export const loginSchema = object({
  email: string().required(),
  password: string().required(),
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
