import { formatCurrency } from '../utils/formatters.js';
import { Trash2 } from 'lucide-react';

export default function TransactionTable({ records = [], isAdmin = false, onDelete }) {
  if (records.length === 0) {
    return (
      <tr>
        <td colSpan={isAdmin ? 6 : 5} className="text-center py-10 text-gray-400 text-sm">
          No transactions found
        </td>
      </tr>
    );
  }

  return records.map((t) => (
    <tr key={t.id} className="hover:bg-gray-50 transition-colors">
      <td className="px-4 py-3 text-sm text-gray-600">
        {new Date(t.date).toLocaleDateString()}
      </td>
      <td className="px-4 py-3">
        <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded text-xs font-medium">
          {t.category}
        </span>
      </td>
      <td className="px-4 py-3">
        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
          t.type === 'INCOME'
            ? 'bg-green-100 text-green-700'
            : 'bg-red-100 text-red-600'
        }`}>
          {t.type}
        </span>
      </td>
      <td className={`px-4 py-3 text-sm font-semibold ${
        t.type === 'INCOME' ? 'text-green-600' : 'text-red-500'
      }`}>
        {formatCurrency(t.amount)}
      </td>
      <td className="px-4 py-3 text-sm text-gray-400 max-w-xs truncate">
        {t.notes || '—'}
      </td>
      {isAdmin && (
        <td className="px-4 py-3">
          <button
            onClick={() => onDelete?.(t.id)}
            className="text-red-400 hover:text-red-600 p-1 rounded transition-colors"
            title="Delete transaction"
          >
            <Trash2 size={14} />
          </button>
        </td>
      )}
    </tr>
  ));
}