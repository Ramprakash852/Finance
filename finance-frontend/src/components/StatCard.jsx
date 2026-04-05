// Metric card for dashboard summary numbers.
// Props: title, value, subtitle, trend ('up'|'down'|null), icon.
export default function StatCard({ title, value, subtitle, trend }) {
  return (
    <div className='bg-white rounded-xl border border-gray-200 p-5 shadow-sm'>
      <p className='text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2'>{title}</p>
      <p className={`text-2xl font-bold mb-1 ${
        trend === 'up' ? 'text-green-600' : trend === 'down' ? 'text-red-500' : 'text-gray-900'
      }`}>{value}</p>
      {subtitle && <p className='text-xs text-gray-400'>{subtitle}</p>}
    </div>
  );
}
