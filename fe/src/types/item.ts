export interface Item {
    id: string;
    name: string;
    price: number;
    users: Array<{ id: string; }>;
}