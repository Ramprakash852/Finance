export default function LoadingSpinner({ size = 'md' }) {
  const s = size === 'lg' ? 'w-12 h-12' : size === 'sm' ? 'w-4 h-4' : 'w-8 h-8';
  return (
    <div className='flex items-center justify-center p-8'>
      <div className={`${s} border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin`} />
    </div>
  );
}
