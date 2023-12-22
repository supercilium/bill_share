export interface Item {
  id: string;
  name: string;
  price: number;
  amount: number;
  equally: boolean;
  discount?: number;
  users: Record<string, { id: string; value?: number }>;
}
export interface ItemDTO {
  id: string;
  name: string;
  price: number;
  amount: number;
  equally: boolean;
  discount?: number;
  users: Array<{ id: string; value?: number }>;
}
