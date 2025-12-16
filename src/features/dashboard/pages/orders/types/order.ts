export type OrderStatus = 'pending' | 'processing' | 'completed' | 'cancelled';

export interface Order {
  id: string;
  orderNumber: string;
  contactName: string;
  email: string;
  amount: number;
  status: OrderStatus;
  date: string;
  items: number;
  paymentMethod: string;
}

export interface OrderFilters {
  status: OrderStatus | 'all';
  search: string;
  dateRange: {
    from: Date | undefined;
    to: Date | undefined;
  };
} 