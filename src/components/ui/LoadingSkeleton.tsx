interface LoadingSkeletonProps {
  message?: string;
  className?: string;
}

export function LoadingSkeleton({
  message = 'Cargando...',
  className = '',
}: LoadingSkeletonProps) {
  return (
    <div className={`flex flex-1 animate-pulse items-center justify-center rounded-xl bg-gray-50 ${className}`}>
      <span className="text-sm text-gray-400">{message}</span>
    </div>
  );
}