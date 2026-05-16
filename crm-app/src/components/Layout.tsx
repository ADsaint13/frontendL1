import { NavLink, Outlet } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

const topLinks = [
  { name: 'Home', to: '/' },
  { name: 'Super', to: '/super' },
  { name: 'Reports & Analytics', to: '/reports' },
];

const workspaceSmartboards = [
  { name: 'Solution Requests', to: '/solution-requests' },
  { name: 'Parent Accounts', to: '/parent-accounts' },
  { name: 'My Tasks', to: '/my-tasks' },
];

const workspace = [
  { name: 'Accounts', to: '/accounts' },
  { name: 'Opportunities', to: '/opportunities' },
  { name: 'Contacts', to: '/contacts' },
  { name: 'Leads', to: '/leads' },
  { name: 'Deal Support Requests', to: '/deal-support' },
  { name: 'FreshDesk Tickets', to: '/tickets' },
  { name: 'SRF SPR', to: '/srf' },
  { name: 'BANT Qualifications', to: '/bant' },
  { name: 'Tasks', to: '/tasks' },
];

export default function Layout() {
  return (
    <div className="flex h-screen overflow-hidden bg-white font-sans text-gray-900">
      <Toaster position="top-right" />
      
      {/* ── Sidebar ── */}
      <aside className="w-64 flex-shrink-0 flex flex-col border-r border-gray-200 bg-[#F9FAFB]">
        {/* Header */}
        <div className="flex h-14 items-center px-4 border-b border-gray-200 shrink-0">
          <div className="flex items-center gap-2 font-semibold">
            <div className="size-6 rounded bg-indigo-600 text-white flex items-center justify-center text-xs">A</div>
            Acme Inc.
          </div>
        </div>

        {/* Search */}
        <div className="px-3 py-3 shrink-0">
          <button className="flex w-full items-center justify-between rounded-md border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-500 shadow-sm hover:border-gray-300">
            <span className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              Quick Search...
            </span>
            <span className="rounded bg-gray-100 px-1.5 py-0.5 text-xs text-gray-400">ctrl+k</span>
          </button>
        </div>

        {/* Nav links */}
        <nav className="flex-1 overflow-y-auto px-3 pb-4 space-y-6">
          <div className="space-y-0.5">
            {topLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.to}
                className={({ isActive }) =>
                  `block rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                    isActive ? 'bg-gray-200 text-gray-900' : 'text-gray-600 hover:bg-gray-100'
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
          </div>

          <div>
            <h3 className="mb-2 px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Workspace Smartboards</h3>
            <div className="space-y-0.5">
              <div className="px-3 mb-2">
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-2.5">
                    <svg xmlns="http://www.w3.org/2000/svg" className="size-3.5 text-gray-400" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clipRule="evenodd" /></svg>
                  </div>
                  <input type="text" placeholder="Search smartboards..." className="w-full bg-transparent border-0 py-1 pl-8 text-sm focus:ring-0 text-gray-600 placeholder-gray-400" />
                </div>
              </div>
              {workspaceSmartboards.map((link) => (
                <NavLink
                  key={link.name}
                  to={link.to}
                  className={({ isActive }) =>
                    `block rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                      isActive ? 'bg-gray-200 text-gray-900' : 'text-gray-600 hover:bg-gray-100'
                    }`
                  }
                >
                  {link.name}
                </NavLink>
              ))}
            </div>
          </div>

          <div>
            <h3 className="mb-2 px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Workspace</h3>
            <div className="space-y-0.5">
              {workspace.map((link) => (
                <NavLink
                  key={link.name}
                  to={link.to}
                  className={({ isActive }) =>
                    `block rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                      isActive ? 'bg-gray-200 text-gray-900' : 'text-gray-600 hover:bg-gray-100'
                    }`
                  }
                >
                  {link.name}
                </NavLink>
              ))}
            </div>
          </div>
        </nav>
        
        {/* User Profile */}
        <div className="border-t border-gray-200 p-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="size-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-sm">
              JC
            </div>
            <div className="text-sm font-medium text-gray-700">Jamie Carter</div>
          </div>
        </div>
      </aside>

      {/* ── Main Content ── */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto bg-white">
        <Outlet />
      </main>
    </div>
  );
}
