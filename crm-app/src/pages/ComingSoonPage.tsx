import { useLocation } from 'react-router-dom';

// Derives a readable title from the URL path, e.g. /deal-support → "Deal Support"
function titleFromPath(pathname: string) {
  return pathname
    .replace(/^\//, '')
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

export default function ComingSoonPage() {
  const { pathname } = useLocation();
  const title = titleFromPath(pathname);

  return (
    <div className="flex flex-col h-full bg-[#FAFAFA]">
      {/* Header bar matching leads page style */}
      <div className="flex items-center border-b border-gray-200 px-6 py-4 bg-white shrink-0">
        <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
      </div>

      {/* Body */}
      <div className="flex flex-1 items-center justify-center p-12">
        <div className="flex flex-col items-center text-center max-w-sm">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-indigo-50 mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-indigo-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 6v6l4 2m6-2a10 10 0 11-20 0 10 10 0 0120 0z"
              />
            </svg>
          </div>
          <h2 className="text-lg font-semibold text-gray-900">{title} — Coming Soon</h2>
          <p className="mt-2 text-sm text-gray-500 leading-relaxed">
            This section is not yet implemented. Navigate to{' '}
            <a href="/leads" className="font-medium text-indigo-600 hover:underline">
              Leads
            </a>{' '}
            to see the working module.
          </p>
        </div>
      </div>
    </div>
  );
}
