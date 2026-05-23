type AdminOrganizationFieldErrorProps = {
  id?: string;
  message?: string;
};

export function AdminOrganizationFieldError({
  id,
  message,
}: AdminOrganizationFieldErrorProps) {
  if (!message) {
    return null;
  }

  return (
    <p id={id} role="alert" className="text-label-main-bold text-brand-red-500">
      {message}
    </p>
  );
}
