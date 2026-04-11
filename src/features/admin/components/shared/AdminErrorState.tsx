type AdminErrorStateProps = {
  message: string;
  onRetry?: () => void;
};

export function AdminErrorState({ message, onRetry }: AdminErrorStateProps) {
  return (
    <div className="flex h-full min-h-[60vh] flex-col items-center justify-center gap-4">
      <p className="text-base text-red-600">{message}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="rounded-2xl bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700"
        >
          Reintentar
        </button>
      )}
    </div>
  );
}
