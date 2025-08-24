export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  available: boolean;
  imageUrl: string;
  onSale?: boolean; 
}


