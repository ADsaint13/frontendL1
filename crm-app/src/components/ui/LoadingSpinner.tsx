interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
}

const sizeMap = { sm: 'h-4 w-4', md: 'h-8 w-8', lg: 'h-12 w-12' };

export default function LoadingSpinner({ size = 'md' }: LoadingSpinnerProps) {
  return (
    <div className="flex items-center justify-center w-full py-12">
      <div
        className={`${sizeMap[size]} animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600`}
        role="status"
        aria-label="Loading"
      />
    </div>
  );
}
