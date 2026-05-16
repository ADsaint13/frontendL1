import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// ─── Layout ───────────────────────────────────────────────────────────────────
import Layout from './components/Layout';

// ─── Pages ───────────────────────────────────────────────────────────────────
import DashboardPage from './pages/DashboardPage';
import LeadsListPage from './pages/LeadsListPage';
import LeadDetailPage from './pages/LeadDetailPage';
import LeadCreatePage from './pages/LeadCreatePage';
import LeadEditPage from './pages/LeadEditPage';
import NotFoundPage from './pages/NotFoundPage';
import ComingSoonPage from './pages/ComingSoonPage';

// ─── TanStack Query client ────────────────────────────────────────────────────
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

// ─── App ──────────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            {/* Dashboard  →  / */}
            <Route index element={<DashboardPage />} />

            {/* Leads list  →  /leads */}
            <Route path="leads" element={<LeadsListPage />} />

            {/* Lead create  →  /leads/new */}
            <Route path="leads/new" element={<LeadCreatePage />} />

            {/* Lead detail  →  /leads/:id */}
            <Route path="leads/:id" element={<LeadDetailPage />} />

            {/* Lead edit  →  /leads/:id/edit */}
            <Route path="leads/:id/edit" element={<LeadEditPage />} />

            {/* ── Sidebar stub routes (not yet implemented) ── */}
            <Route path="super" element={<ComingSoonPage />} />
            <Route path="reports" element={<ComingSoonPage />} />
            <Route path="solution-requests" element={<ComingSoonPage />} />
            <Route path="parent-accounts" element={<ComingSoonPage />} />
            <Route path="my-tasks" element={<ComingSoonPage />} />
            <Route path="accounts" element={<ComingSoonPage />} />
            <Route path="opportunities" element={<ComingSoonPage />} />
            <Route path="contacts" element={<ComingSoonPage />} />
            <Route path="deal-support" element={<ComingSoonPage />} />
            <Route path="tickets" element={<ComingSoonPage />} />
            <Route path="srf" element={<ComingSoonPage />} />
            <Route path="bant" element={<ComingSoonPage />} />
            <Route path="tasks" element={<ComingSoonPage />} />
          </Route>

          {/* 404 fallback */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}