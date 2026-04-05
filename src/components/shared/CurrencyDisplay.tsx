export function formatCurrency(value: number): string {
  return '$' + value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function formatNumber(value: number, decimals = 0): string {
  return value.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

export function CurrencyValue({
  value,
  className,
}: {
  value: number;
  className?: string;
}) {
  const color = value > 0 ? 'text-green-400' : value < 0 ? 'text-red-400' : '';
  return (
    <span className={`${color} ${className ?? ''}`}>
      {formatCurrency(value)}
    </span>
  );
}

export function DeltaValue({
  value,
  className,
}: {
  value: number;
  className?: string;
}) {
  const color = value > 0 ? 'text-green-400' : value < 0 ? 'text-red-400' : '';
  const prefix = value > 0 ? '+' : '';
  return (
    <span className={`${color} ${className ?? ''}`}>
      {prefix}{formatCurrency(value)}
    </span>
  );
}
