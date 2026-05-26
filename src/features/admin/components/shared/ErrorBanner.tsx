type ErrorBannerProps = {
  error: string;
};

export function ErrorBanner({ error }: ErrorBannerProps) {
  return (
    <div className="rounded-3xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
      {error}
    </div>
  );
}