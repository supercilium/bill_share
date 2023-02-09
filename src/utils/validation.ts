import { array, object, string, number } from "yup";

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
    userName: string(),
    email: string().required(),
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
