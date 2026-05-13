interface ErrorMessageProps {
  message?: string;
}

export default function ErrorMessage({ message = 'Something went wrong.' }: ErrorMessageProps) {
  return (
    <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
      ⚠️ {message}
    </div>
  );
}
