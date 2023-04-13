export class Product {
  _id?: string;
  name: string = '';
  description: string = '';
  price: number = 0;
  image?: string;
  category?: string;
  size?: string;
  color?: string;
  material?: string;
  brand?: string;
  stock: number = 0;
}
