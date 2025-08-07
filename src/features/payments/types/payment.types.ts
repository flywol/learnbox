export interface TransactionData {
  id: string;
  studentName: string;
  parentName: string;
  classLevel: string;
  paymentStatus: 'paid' | 'pending';
  transactionId: string | null;
  dateReceived: string | null;
  totalAmount: number;
  amountPaid: number;
  studentAvatar: string;
  parentAvatar: string;
}

export interface StudentPayment {
  id: string;
  studentName: string;
  parentName: string;
  paymentStatus: 'paid' | 'pending';
  transactionId: string | null;
  dateReceived: string | null;
  totalAmount: number;
  amountPaid: number;
  avatar: string;
  parentAvatar: string;
}