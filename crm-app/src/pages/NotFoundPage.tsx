export default function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <p className="text-7xl font-black text-indigo-100">404</p>
      <h1 className="mt-4 text-2xl font-bold text-gray-800">Page Not Found</h1>
      <p className="mt-2 text-sm text-gray-500">
        The page you are looking for does not exist.
      </p>
      <a
        href="/"
        className="mt-6 inline-flex items-center rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow hover:bg-indigo-700 transition-colors"
      >
        Go Home
      </a>
    </div>
  );
}
