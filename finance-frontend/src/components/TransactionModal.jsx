import { useForm } from 'react-hook-form';
import { create } from '../api/transactions.js';
import toast from 'react-hot-toast';
import { X } from 'lucide-react';
 
export default function TransactionModal({ isOpen, onClose, onSuccess }) {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
    defaultValues: { type: 'INCOME', date: new Date().toISOString().split('T')[0] }
  });
 
  if (!isOpen) return null;
 
  async function onSubmit(data) {
    try {
      // Convert to API shape here so the form can stay UI-friendly.
      await create({ ...data, amount: parseFloat(data.amount), date: new Date(data.date).toISOString() });
      toast.success('Transaction created');
      reset();
      onClose();
      onSuccess?.();
    } catch (e) {
      toast.error(e.response?.data?.error || 'Failed to create');
    }
  }
 
  return (
    <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4'>
      <div className='bg-white rounded-2xl shadow-xl w-full max-w-md p-6'>
        <div className='flex items-center justify-between mb-5'>
          <h2 className='text-lg font-bold text-gray-900'>New Transaction</h2>
          <button onClick={onClose} className='text-gray-400 hover:text-gray-600'><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
          <div className='grid grid-cols-2 gap-4'>
            <div>
              <label className='block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1'>Amount ($)</label>
              <input type='number' step='0.01' min='0.01'
                {...register('amount', { required: 'Required', min: { value: 0.01, message: 'Must be positive' } })}
                className='w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500' />
              {errors.amount && <p className='text-red-500 text-xs mt-1'>{errors.amount.message}</p>}
            </div>
            <div>
              <label className='block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1'>Type</label>
              <select {...register('type')}
                className='w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500'>
                <option value='INCOME'>Income</option>
                <option value='EXPENSE'>Expense</option>
              </select>
            </div>
          </div>
          <div>
            <label className='block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1'>Category</label>
            <input {...register('category', { required: 'Required' })}
              placeholder='e.g. Salary, Rent...'
              className='w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500' />
            {errors.category && <p className='text-red-500 text-xs mt-1'>{errors.category.message}</p>}
          </div>
          <div>
            <label className='block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1'>Date</label>
            <input type='date' {...register('date', { required: 'Required' })}
              className='w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500' />
          </div>
          <div>
            <label className='block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1'>Notes</label>
            <input {...register('notes')} placeholder='Optional description...'
              className='w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500' />
          </div>
          <div className='flex gap-3 pt-2'>
            <button type='button' onClick={onClose}
              className='flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg text-sm font-medium hover:bg-gray-50'>Cancel</button>
            <button type='submit' disabled={isSubmitting}
              className='flex-1 bg-blue-600 text-white py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 disabled:opacity-50'>
              {isSubmitting ? 'Creating...' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
