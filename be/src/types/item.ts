export interface ItemInterface {
  name: string;
  price: number;
  amount: number;
  equally: boolean;
  discount?: number;
  users: Array<{ id: string; value: number }>
}
