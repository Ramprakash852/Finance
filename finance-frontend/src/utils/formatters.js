// Currency and date formatting helpers used across the whole app.
export const formatCurrency = (value) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(Number(value) || 0);
 
export const formatDate = (dateStr) =>
  new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
 
export const formatMonth = (yyyymm) => {
  const [year, month] = yyyymm.split('-');
  return new Date(year, month - 1).toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
};
