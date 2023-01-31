import { array, object, string, number } from "yup";

export const itemsSchema = object({
    items: array().of(
        object().shape({
            name: string().required(),
            price: number().min(0).integer().default(0).required(),
            amount: number().min(1).integer().required(),
            discount: number().min(0).max(100).default(0),
        })
    ),
}).required();

export const addUserSchema = object({
    userName: string().required(),
}).required();

export const addItemSchema = object({
    name: string().required(),
    price: number().min(0).integer().default(0).required(),
    amount: number().min(1).integer().required(),
}).required();