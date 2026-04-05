// Dashboard page: fetches summary data and renders stats + charts.
// Uses React Query for caching. Recharts for bar (monthly) and pie (categories).
// All amounts passed through formatCurrency helper.
 
import { useQuery } from '@tanstack/react-query';
import { getSummary } from '../api/dashboard.js';
import StatCard from '../components/StatCard.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import { formatCurrency, formatMonth } from '../utils/formatters.js';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend,
  PieChart, Pie, Cell,
} from 'recharts';
 
const COLORS = ['#3b82f6','#10b981','#f59e0b','#ef4444','#8b5cf6','#06b6d4','#f97316'];
 
export default function Dashboard() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['dashboard'],
    queryFn: () => getSummary(),
  });
 
  if (isLoading) return <LoadingSpinner size='lg' />;
  if (error) return <p className='text-red-500 p-4'>Failed to load dashboard: {error.message}</p>;
 
  const { summary, categoryBreakdown, recentActivity, monthlyTrends } = data.data;
  const net = Number(summary.netBalance);
 
  // Build monthly chart data: merge INCOME + EXPENSE rows by month
  const monthMap = {};
  (monthlyTrends || []).forEach(row => {
    if (!monthMap[row.month]) monthMap[row.month] = { month: formatMonth(row.month) };
    monthMap[row.month][row.type] = Number(row.total);
  });
  const monthData = Object.values(monthMap).slice(-6);
 
  // Pie data: top 7 categories by total
  const pieData = (categoryBreakdown || []).slice(0, 7).map(c => ({
    name: c.category,
    value: Number(c.total),
  }));
 
  return (
    <div>
      <div className='mb-6'>
        <h1 className='text-2xl font-bold text-gray-900'>Dashboard</h1>
        <p className='text-gray-500 text-sm'>Financial overview</p>
      </div>
 
      <div className='grid grid-cols-4 gap-4 mb-6'>
        <StatCard title='Total Income'   value={formatCurrency(summary.totalIncome)}   trend='up' />
        <StatCard title='Total Expenses' value={formatCurrency(summary.totalExpenses)} trend='down' />
        <StatCard title='Net Balance'    value={formatCurrency(net)} trend={net >= 0 ? 'up' : 'down'} subtitle={net >= 0 ? 'Positive cash flow' : 'Negative cash flow'} />
        <StatCard title='Transactions'   value={summary.transactionCount || 0} />
      </div>
 
      <div className='grid grid-cols-2 gap-4 mb-6'>
        <div className='bg-white rounded-xl border border-gray-200 p-5 shadow-sm'>
          <h3 className='text-sm font-semibold text-gray-700 mb-4'>Monthly Trends</h3>
          <ResponsiveContainer width='100%' height={220}>
            <BarChart data={monthData}>
              <XAxis dataKey='month' tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} tickFormatter={v => '$' + (v/1000).toFixed(0) + 'k'} />
              <Tooltip formatter={v => formatCurrency(v)} />
              <Legend />
              <Bar dataKey='INCOME'  name='Income'  fill='#22c55e' radius={[3,3,0,0]} />
              <Bar dataKey='EXPENSE' name='Expense' fill='#ef4444' radius={[3,3,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className='bg-white rounded-xl border border-gray-200 p-5 shadow-sm'>
          <h3 className='text-sm font-semibold text-gray-700 mb-4'>Categories</h3>
          <ResponsiveContainer width='100%' height={220}>
            <PieChart>
              <Pie data={pieData} dataKey='value' nameKey='name' cx='50%' cy='50%'
                   innerRadius={55} outerRadius={90} paddingAngle={3}>
                {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip formatter={v => formatCurrency(v)} />
              <Legend iconSize={10} wrapperStyle={{ fontSize: 11 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
 
      <div className='bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden'>
        <div className='px-5 py-4 border-b border-gray-100'>
          <h3 className='text-sm font-semibold text-gray-700'>Recent Activity</h3>
        </div>
        <table className='w-full text-sm'>
          <thead className='bg-gray-50'>
            <tr>{['Date','Category','Type','Amount','Notes'].map(h => (
              <th key={h} className='px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide'>{h}</th>
            ))}</tr>
          </thead>
          <tbody className='divide-y divide-gray-100'>
            {(recentActivity || []).map(t => (
              <tr key={t.id} className='hover:bg-gray-50'>
                <td className='px-4 py-3 text-gray-600'>{new Date(t.date).toLocaleDateString()}</td>
                <td className='px-4 py-3'><span className='bg-gray-100 text-gray-700 px-2 py-0.5 rounded text-xs'>{t.category}</span></td>
                <td className='px-4 py-3'>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${ t.type === 'INCOME' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600' }`}>{t.type}</span>
                </td>
                <td className={`px-4 py-3 font-semibold ${ t.type === 'INCOME' ? 'text-green-600' : 'text-red-500' }`}>{formatCurrency(t.amount)}</td>
                <td className='px-4 py-3 text-gray-400 max-w-xs truncate'>{t.notes || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
