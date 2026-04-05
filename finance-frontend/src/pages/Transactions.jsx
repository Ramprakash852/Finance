// Transactions page with pagination + filters + role-gated actions.
// ANALYST can view only. ADMIN can create and delete.
// React Query manages data fetching and cache invalidation.
 
import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getAll, remove } from '../api/transactions.js';
import { useAuth } from '../store/authStore.jsx';
import RoleGuard from '../components/RoleGuard.jsx';
import TransactionModal from '../components/TransactionModal.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import { formatCurrency } from '../utils/formatters.js';
import toast from 'react-hot-toast';
import { Plus, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
 
export default function Transactions() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const [filters, setFilters] = useState({ page: 1, limit: 10, type: '', category: '' });
  const [showModal, setShowModal] = useState(false);
  const isAdmin = user?.role === 'ADMIN';
 
  const { data, isLoading } = useQuery({
    queryKey: ['transactions', filters],
    queryFn: () => {
      const params = { ...filters };
      if (!params.type) delete params.type;
      if (!params.category) delete params.category;
      return getAll(params);
    },
  });
 
  async function handleDelete(id) {
    if (!confirm('Delete this transaction?')) return;
    try {
      await remove(id);
      toast.success('Deleted');
      qc.invalidateQueries(['transactions']);
    } catch (e) {
      toast.error(e.response?.data?.error || 'Failed to delete');
    }
  }
 
  const records = data?.data?.records || [];
  const pagination = data?.data?.pagination || {};
 
  return (
    <RoleGuard roles={['ADMIN', 'ANALYST']}>
      <div>
        <div className='flex items-center justify-between mb-6'>
          <div>
            <h1 className='text-2xl font-bold text-gray-900'>Transactions</h1>
            <p className='text-gray-500 text-sm'>{pagination.total || 0} total records</p>
          </div>
          {isAdmin && (
            <button onClick={() => setShowModal(true)}
              className='flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700'>
              <Plus size={16} /> Add Transaction
            </button>
          )}
        </div>
 
        <div className='flex gap-3 mb-4'>
          <select value={filters.type} onChange={e => setFilters(f => ({ ...f, type: e.target.value, page: 1 }))}
            className='border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500'>
            <option value=''>All Types</option>
            <option value='INCOME'>Income</option>
            <option value='EXPENSE'>Expense</option>
          </select>
          <input placeholder='Filter by category...' value={filters.category}
            onChange={e => setFilters(f => ({ ...f, category: e.target.value, page: 1 }))}
            className='border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-48' />
        </div>
 
        <div className='bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden'>
          {isLoading ? <LoadingSpinner /> : (
            <table className='w-full text-sm'>
              <thead className='bg-gray-50'>
                <tr>{['Date','Category','Type','Amount','Notes', isAdmin ? 'Actions' : ''].filter(Boolean).map(h => (
                  <th key={h} className='px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide'>{h}</th>
                ))}</tr>
              </thead>
              <tbody className='divide-y divide-gray-100'>
                {records.length === 0 ? (
                  <tr><td colSpan={6} className='text-center py-10 text-gray-400'>No transactions found</td></tr>
                ) : records.map(t => (
                  <tr key={t.id} className='hover:bg-gray-50'>
                    <td className='px-4 py-3 text-gray-600'>{new Date(t.date).toLocaleDateString()}</td>
                    <td className='px-4 py-3'><span className='bg-gray-100 text-gray-700 px-2 py-0.5 rounded text-xs'>{t.category}</span></td>
                    <td className='px-4 py-3'>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${ t.type === 'INCOME' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600' }`}>{t.type}</span>
                    </td>
                    <td className={`px-4 py-3 font-semibold ${ t.type === 'INCOME' ? 'text-green-600' : 'text-red-500' }`}>{formatCurrency(t.amount)}</td>
                    <td className='px-4 py-3 text-gray-400 max-w-xs truncate'>{t.notes || '-'}</td>
                    {isAdmin && <td className='px-4 py-3'>
                      <button onClick={() => handleDelete(t.id)} className='text-red-400 hover:text-red-600 p-1'><Trash2 size={14} /></button>
                    </td>}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          <div className='flex items-center justify-between px-4 py-3 border-t border-gray-100'>
            <span className='text-xs text-gray-400'>Page {filters.page} of {pagination.totalPages || 1}</span>
            <div className='flex gap-2'>
              <button disabled={filters.page <= 1} onClick={() => setFilters(f => ({ ...f, page: f.page - 1 }))}
                className='p-1 rounded border border-gray-200 text-gray-500 disabled:opacity-30 hover:bg-gray-50'><ChevronLeft size={16} /></button>
              <button disabled={filters.page >= (pagination.totalPages || 1)} onClick={() => setFilters(f => ({ ...f, page: f.page + 1 }))}
                className='p-1 rounded border border-gray-200 text-gray-500 disabled:opacity-30 hover:bg-gray-50'><ChevronRight size={16} /></button>
            </div>
          </div>
        </div>
 
        <TransactionModal isOpen={showModal} onClose={() => setShowModal(false)}
          onSuccess={() => qc.invalidateQueries(['transactions'])} />
      </div>
    </RoleGuard>
  );
}
