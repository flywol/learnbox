import { TransactionTableSection } from '../TransactionTableSection';
import type { TransactionData } from '../../types/payment.types';

interface TransactionsTabProps {
  transactions: TransactionData[];
}

export default function TransactionsTab({ transactions }: TransactionsTabProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-2">Transaction History</h2>
        <p className="text-gray-600">View and manage all payment transactions</p>
      </div>
      
      <TransactionTableSection data={transactions} />
    </div>
  );
}